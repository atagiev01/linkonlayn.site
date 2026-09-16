import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  increment,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db, getIsLiveFirebase } from './config';
import { Template, Invitation, RSVP, StatsSummary, ViewLogItem } from '../types';
import { DEFAULT_TEMPLATES, DEFAULT_INVITATIONS, DEFAULT_RSVPS } from '../data/initialData';

// Local storage backup keys for offline or standalone development
const STORAGE_KEYS = {
  TEMPLATES: 'wedding_app_templates_v4',
  INVITATIONS: 'wedding_app_invitations_v4',
  RSVPS: 'wedding_app_rsvps_v4',
  VIEWED_SLUGS: 'wedding_app_viewed_slugs_v4',
};

// Listeners tracking for local sync
type ListenerCallback<T> = (data: T) => void;
const templateListeners = new Set<ListenerCallback<Template[]>>();
const invitationListeners = new Set<ListenerCallback<Invitation[]>>();
const rsvpListeners = new Set<ListenerCallback<RSVP[]>>();

const DELETED_TEMPLATES_KEY = 'wedding_deleted_templates';

function getDeletedTemplateIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_TEMPLATES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function addDeletedTemplateId(id: string): void {
  const set = getDeletedTemplateIds();
  set.add(id);
  try {
    localStorage.setItem(DELETED_TEMPLATES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

// Local cache state with smart merging of new default items
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);

    // Merge default templates if missing from local cache (excluding deleted ones)
    if (key === STORAGE_KEYS.TEMPLATES && Array.isArray(parsed) && Array.isArray(fallback)) {
      const deletedIds = getDeletedTemplateIds();
      const existingMap = new Map(
        (parsed as Template[])
          .filter((t) => !deletedIds.has(t.id))
          .map((t) => [t.id, t])
      );
      (fallback as Template[]).forEach((def) => {
        if (deletedIds.has(def.id)) return;
        const current = existingMap.get(def.id);
        if (!current) {
          existingMap.set(def.id, def);
        } else if (isCustomCodeTemplateStale(current, def)) {
          // If customHtml was empty or outdated without location & map navigation, refresh from default
          existingMap.set(def.id, { ...current, customHtml: def.customHtml, customCss: def.customCss, customJs: def.customJs });
        }
      });
      const merged = Array.from(existingMap.values());
      localStorage.setItem(key, JSON.stringify(merged));
      return merged as unknown as T;
    }

    // Merge default invitations if missing from local cache
    if (key === STORAGE_KEYS.INVITATIONS && Array.isArray(parsed) && Array.isArray(fallback)) {
      const existingMap = new Map((parsed as Invitation[]).map((i) => [i.id, i]));
      (fallback as Invitation[]).forEach((def) => {
        if (!existingMap.has(def.id)) {
          existingMap.set(def.id, def);
        }
      });
      const merged = Array.from(existingMap.values());
      localStorage.setItem(key, JSON.stringify(merged));
      return merged as unknown as T;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

function notifyTemplates(data: Template[]) {
  templateListeners.forEach((cb) => cb(data));
}
function notifyInvitations(data: Invitation[]) {
  invitationListeners.forEach((cb) => cb(data));
}
function notifyRSVPs(data: RSVP[]) {
  rsvpListeners.forEach((cb) => cb(data));
}

// -------------------------------------------------------------
// TEMPLATES REPOSITORY
// -------------------------------------------------------------

// Markers that must be present in a built-in custom-code template's HTML for it
// to be considered up to date with the current app code (venue/location section,
// Google Maps + Waze navigation buttons, background music toggle, etc).
// If a template stored in Firestore/local-storage was seeded from an older
// version of the code, it will be missing one or more of these and needs to be
// refreshed from the current DEFAULT_TEMPLATES definition.
const CUSTOM_CODE_FRESHNESS_MARKERS = ['venue-section', 'nav-btn-google', 'nav-btn-waze', 'wazeUrl', 'music-toggle'];

function isCustomCodeTemplateStale(current: Template, def: Template | undefined): boolean {
  if (!def || !def.isCustomCode) return false;
  if (!current.customHtml || current.customHtml.trim().length === 0) return true;
  return CUSTOM_CODE_FRESHNESS_MARKERS.some((marker) => !current.customHtml!.includes(marker));
}

// Returns a refreshed copy of `current` if it's a built-in custom-code template
// whose HTML is missing newer required features; otherwise returns it unchanged.
function refreshStaleTemplate(current: Template): Template {
  const def = DEFAULT_TEMPLATES.find((t) => t.id === current.id);
  if (!isCustomCodeTemplateStale(current, def)) return current;
  return { ...current, customHtml: def!.customHtml, customCss: def!.customCss, customJs: def!.customJs };
}

function getMissingDefaultTemplates(existingIds: Set<string>, deletedIds: Set<string>): Template[] {
  return DEFAULT_TEMPLATES.filter((t) => !existingIds.has(t.id) && !deletedIds.has(t.id));
}

// Guards so the auto-heal / auto-add-missing-template writes below only ever
// run ONCE per template per browser session. Firestore's onSnapshot fires
// again after each write we make (since we just wrote to the same
// collection we're listening to); without this guard that echo could in
// theory keep re-checking/re-writing on every snapshot and cause repeated
// re-renders — this makes each id a strict one-shot.
const sessionHealedTemplateIds = new Set<string>();
const sessionAddedTemplateIds = new Set<string>();

export async function fetchTemplates(): Promise<Template[]> {
  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'templates');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const deletedIds = getDeletedTemplateIds();
        const rawTemplates = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Template))
          .filter((t) => !deletedIds.has(t.id));

        // Auto-heal any built-in custom-code templates that were seeded before
        // newer features (venue/map/Waze section, etc) existed in the code.
        // Return the in-memory refreshed version immediately (so the UI never
        // waits on a network write), and persist the fix to Firestore in the
        // background, once per id per session.
        const templates: Template[] = rawTemplates.map((t) => {
          const refreshed = refreshStaleTemplate(t);
          if (refreshed !== t && !sessionHealedTemplateIds.has(t.id)) {
            sessionHealedTemplateIds.add(t.id);
            setDoc(doc(db, 'templates', t.id), refreshed).catch((e) =>
              console.warn('Could not persist refreshed template', t.id, e)
            );
          }
          return refreshed;
        });

        // Auto-add any brand-new built-in templates (e.g. newly released designs)
        // that don't exist yet in this site's Firestore, so updates to the app
        // code automatically appear for every existing customer's dashboard too,
        // without needing to reset or re-seed the whole templates collection.
        // Again: show them immediately, persist in the background, once per id.
        const existingIds = new Set(templates.map((t) => t.id));
        const missing = getMissingDefaultTemplates(existingIds, deletedIds);
        for (const t of missing) {
          templates.push(t);
          if (!sessionAddedTemplateIds.has(t.id)) {
            sessionAddedTemplateIds.add(t.id);
            setDoc(doc(db, 'templates', t.id), t).catch((e) =>
              console.warn('Could not add new default template', t.id, e)
            );
          }
        }

        setLocal(STORAGE_KEYS.TEMPLATES, templates);
        return templates;
      }
      // If Firestore is empty, seed non-deleted defaults
      const deletedIds = getDeletedTemplateIds();
      const validDefaults = DEFAULT_TEMPLATES.filter((t) => !deletedIds.has(t.id));
      for (const t of validDefaults) {
        await setDoc(doc(db, 'templates', t.id), t);
      }
      return validDefaults;
    } catch (e) {
      console.warn('Firestore fetchTemplates error, using local fallback:', e);
    }
  }
  return getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
}

export function subscribeTemplates(callback: (templates: Template[]) => void): () => void {
  templateListeners.add(callback);

  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'templates');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const deletedIds = getDeletedTemplateIds();
          if (!snapshot.empty) {
            const rawList = snapshot.docs
              .map((d) => ({ id: d.id, ...d.data() } as Template))
              .filter((t) => !deletedIds.has(t.id));

            // Auto-heal stale built-in custom-code templates the same way fetchTemplates does,
            // guarded so each id is only ever (re-)written once per session.
            const list: Template[] = rawList.map((t) => {
              const refreshed = refreshStaleTemplate(t);
              if (refreshed !== t && !sessionHealedTemplateIds.has(t.id)) {
                sessionHealedTemplateIds.add(t.id);
                setDoc(doc(db, 'templates', t.id), refreshed).catch((e) =>
                  console.warn('Could not persist refreshed template', t.id, e)
                );
              }
              return refreshed;
            });

            // Auto-add any brand-new built-in templates missing from this site's Firestore,
            // guarded so each id is only ever added once per session.
            const existingIds = new Set(list.map((t) => t.id));
            const missing = getMissingDefaultTemplates(existingIds, deletedIds);
            for (const t of missing) {
              list.push(t);
              if (!sessionAddedTemplateIds.has(t.id)) {
                sessionAddedTemplateIds.add(t.id);
                setDoc(doc(db, 'templates', t.id), t).catch((e) =>
                  console.warn('Could not add new default template', t.id, e)
                );
              }
            }

            setLocal(STORAGE_KEYS.TEMPLATES, list);
            callback(list);
          } else {
            const fallback = getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
            callback(fallback);
          }
        },
        (err) => {
          console.warn('Templates subscription snapshot error, falling to local:', err);
          callback(getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES));
        }
      );
      return () => {
        templateListeners.delete(callback);
        unsubscribe();
      };
    } catch (err) {
      console.warn('subscribeTemplates catch error:', err);
    }
  }

  // Local immediate response
  const initial = getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  callback(initial);
  return () => {
    templateListeners.delete(callback);
  };
}

export async function saveTemplate(template: Template): Promise<void> {
  const localList = getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  const idx = localList.findIndex((t) => t.id === template.id);
  const updated = idx >= 0 ? localList.map((t) => (t.id === template.id ? template : t)) : [...localList, template];
  setLocal(STORAGE_KEYS.TEMPLATES, updated);
  notifyTemplates(updated);

  if (getIsLiveFirebase() && db) {
    try {
      await setDoc(doc(db, 'templates', template.id), {
        ...template,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore saveTemplate error:', e);
    }
  }
}

export async function deleteTemplate(templateId: string): Promise<void> {
  // Mark template as permanently deleted so auto-heal never re-seeds it
  addDeletedTemplateId(templateId);

  const localList = getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, []);
  const filtered = localList.filter((t) => t.id !== templateId);
  setLocal(STORAGE_KEYS.TEMPLATES, filtered);
  notifyTemplates(filtered);

  if (getIsLiveFirebase() && db) {
    try {
      await deleteDoc(doc(db, 'templates', templateId));
    } catch (e) {
      console.error('Firestore deleteTemplate error:', e);
    }
  }
}

// -------------------------------------------------------------
// INVITATIONS REPOSITORY
// -------------------------------------------------------------

export async function fetchInvitations(): Promise<Invitation[]> {
  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'invitations');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const invs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invitation));
        setLocal(STORAGE_KEYS.INVITATIONS, invs);
        return invs;
      }
      // Seed defaults if empty
      for (const inv of DEFAULT_INVITATIONS) {
        await setDoc(doc(db, 'invitations', inv.id), inv);
      }
      return DEFAULT_INVITATIONS;
    } catch (e) {
      console.warn('Firestore fetchInvitations error, using local fallback:', e);
    }
  }
  return getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
}

export function subscribeInvitations(callback: (invitations: Invitation[]) => void): () => void {
  invitationListeners.add(callback);

  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'invitations');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Invitation));
            setLocal(STORAGE_KEYS.INVITATIONS, list);
            callback(list);
          } else {
            callback(getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS));
          }
        },
        (err) => {
          console.warn('Invitations subscription error, using local:', err);
          callback(getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS));
        }
      );
      return () => {
        invitationListeners.delete(callback);
        unsubscribe();
      };
    } catch (e) {
      console.warn('subscribeInvitations catch:', e);
    }
  }

  callback(getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS));
  return () => {
    invitationListeners.delete(callback);
  };
}

export async function getInvitationBySlugOrId(identifier: string): Promise<Invitation | null> {
  const cleanId = identifier.trim().toLowerCase();

  // Try local first for instant responsive feel
  const localList = getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  const foundLocal = localList.find((i) => i.slug.toLowerCase() === cleanId || i.id.toLowerCase() === cleanId);

  if (getIsLiveFirebase() && db) {
    try {
      // 1. Search by slug
      const colRef = collection(db, 'invitations');
      const q = query(colRef, where('slug', '==', cleanId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const item = { id: snap.docs[0].id, ...snap.docs[0].data() } as Invitation;
        return item;
      }

      // 2. Search by document ID
      const docRef = doc(db, 'invitations', identifier);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Invitation;
      }
    } catch (e) {
      console.warn('Firestore getInvitationBySlugOrId query error, using local:', e);
    }
  }

  return foundLocal || null;
}

export async function saveInvitation(invitation: Invitation): Promise<void> {
  const localList = getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  const idx = localList.findIndex((i) => i.id === invitation.id);
  const updated = idx >= 0 ? localList.map((i) => (i.id === invitation.id ? invitation : i)) : [invitation, ...localList];
  setLocal(STORAGE_KEYS.INVITATIONS, updated);
  notifyInvitations(updated);

  if (getIsLiveFirebase() && db) {
    try {
      await setDoc(doc(db, 'invitations', invitation.id), {
        ...invitation,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Firestore saveInvitation error:', e);
    }
  }
}

export async function deleteInvitation(invitationId: string): Promise<void> {
  const localList = getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  const filtered = localList.filter((i) => i.id !== invitationId);
  setLocal(STORAGE_KEYS.INVITATIONS, filtered);
  notifyInvitations(filtered);

  if (getIsLiveFirebase() && db) {
    try {
      await deleteDoc(doc(db, 'invitations', invitationId));
    } catch (e) {
      console.error('Firestore deleteInvitation error:', e);
    }
  }
}

// -------------------------------------------------------------
// VIEW COUNTER WITH SPAM PROTECTION
// -------------------------------------------------------------

export async function incrementInvitationViews(
  invitationId: string,
  slug: string,
  clientMeta?: { device?: 'mobile' | 'desktop' | 'tablet'; browser?: string }
): Promise<void> {
  // Prevent duplicate spam counts from the same browser tab within 1 minute
  const sessionKey = `viewed_${invitationId}`;
  const lastViewTime = sessionStorage.getItem(sessionKey);
  const now = Date.now();

  if (lastViewTime && now - parseInt(lastViewTime, 10) < 60 * 1000) {
    // Already counted in this session within last 60 seconds
    return;
  }
  sessionStorage.setItem(sessionKey, now.toString());

  const newLog: ViewLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    device: clientMeta?.device || 'mobile',
    browser: clientMeta?.browser || 'Mobil / Brauzer',
  };

  // Update local
  const localList = getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  const updated = localList.map((inv) => {
    if (inv.id === invitationId || inv.slug === slug) {
      const logs = [newLog, ...(inv.viewLogs || [])].slice(0, 100);
      return {
        ...inv,
        views: (inv.views || 0) + 1,
        viewLogs: logs,
        updatedAt: new Date().toISOString(),
      };
    }
    return inv;
  });
  setLocal(STORAGE_KEYS.INVITATIONS, updated);
  notifyInvitations(updated);

  if (getIsLiveFirebase() && db) {
    try {
      const docRef = doc(db, 'invitations', invitationId);
      await updateDoc(docRef, {
        views: increment(1),
        viewLogs: arrayUnion(newLog),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore incrementInvitationViews error:', e);
    }
  }
}

export async function resetInvitationViews(invitationId: string): Promise<void> {
  const localList = getLocal<Invitation[]>(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  const updated = localList.map((inv) => {
    if (inv.id === invitationId) {
      return { ...inv, views: 0, viewLogs: [], updatedAt: new Date().toISOString() };
    }
    return inv;
  });
  setLocal(STORAGE_KEYS.INVITATIONS, updated);
  notifyInvitations(updated);

  if (getIsLiveFirebase() && db) {
    try {
      const docRef = doc(db, 'invitations', invitationId);
      await updateDoc(docRef, {
        views: 0,
        viewLogs: [],
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore resetInvitationViews error:', e);
    }
  }
}

// -------------------------------------------------------------
// RSVP REPOSITORY
// -------------------------------------------------------------

export async function fetchRSVPs(): Promise<RSVP[]> {
  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'rsvps');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const rsvps = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RSVP));
        setLocal(STORAGE_KEYS.RSVPS, rsvps);
        return rsvps;
      }
      for (const r of DEFAULT_RSVPS) {
        await setDoc(doc(db, 'rsvps', r.id), r);
      }
      return DEFAULT_RSVPS;
    } catch (e) {
      console.warn('Firestore fetchRSVPs error, using local fallback:', e);
    }
  }
  return getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
}

export function subscribeRSVPs(callback: (rsvps: RSVP[]) => void): () => void {
  rsvpListeners.add(callback);

  if (getIsLiveFirebase() && db) {
    try {
      const colRef = collection(db, 'rsvps');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RSVP));
            setLocal(STORAGE_KEYS.RSVPS, list);
            callback(list);
          } else {
            callback(getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS));
          }
        },
        (err) => {
          console.warn('RSVP subscription error:', err);
          callback(getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS));
        }
      );
      return () => {
        rsvpListeners.delete(callback);
        unsubscribe();
      };
    } catch (e) {
      console.warn('subscribeRSVPs catch:', e);
    }
  }

  callback(getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS));
  return () => {
    rsvpListeners.delete(callback);
  };
}

export async function submitRSVP(rsvpData: Omit<RSVP, 'id' | 'createdAt'>): Promise<RSVP> {
  const newRsvp: RSVP = {
    ...rsvpData,
    id: 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  // Local storage save
  const current = getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
  const updated = [newRsvp, ...current];
  setLocal(STORAGE_KEYS.RSVPS, updated);
  notifyRSVPs(updated);

  if (getIsLiveFirebase() && db) {
    try {
      await setDoc(doc(db, 'rsvps', newRsvp.id), newRsvp);
    } catch (e) {
      console.error('Firestore submitRSVP error:', e);
    }
  }

  return newRsvp;
}

export async function deleteRSVP(rsvpId: string): Promise<void> {
  const current = getLocal<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
  const updated = current.filter((r) => r.id !== rsvpId);
  setLocal(STORAGE_KEYS.RSVPS, updated);
  notifyRSVPs(updated);

  if (getIsLiveFirebase() && db) {
    try {
      await deleteDoc(doc(db, 'rsvps', rsvpId));
    } catch (e) {
      console.error('Firestore deleteRSVP error:', e);
    }
  }
}

// -------------------------------------------------------------
// STATS CALCULATION
// -------------------------------------------------------------

export function calculateStats(invitations: Invitation[], rsvps: RSVP[]): StatsSummary {
  const totalInvitations = invitations.length;
  const activeInvitations = invitations.filter((i) => i.active).length;
  const totalViews = invitations.reduce((sum, i) => sum + (i.views || 0), 0);
  const totalRSVPs = rsvps.length;
  const attendingGuests = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + (Number(r.guestCount) || 1), 0);
  const declinedRSVPs = rsvps.filter((r) => !r.attending).length;
  const acceptanceRate =
    totalRSVPs > 0 ? Math.round((rsvps.filter((r) => r.attending).length / totalRSVPs) * 100) : 0;

  return {
    totalInvitations,
    activeInvitations,
    totalViews,
    totalRSVPs,
    attendingGuests,
    declinedRSVPs,
    acceptanceRate,
  };
}

export function resetAllDataToDefault(): void {
  setLocal(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  setLocal(STORAGE_KEYS.INVITATIONS, DEFAULT_INVITATIONS);
  setLocal(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
  notifyTemplates(DEFAULT_TEMPLATES);
  notifyInvitations(DEFAULT_INVITATIONS);
  notifyRSVPs(DEFAULT_RSVPS);
}
