import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, getIsLiveFirebase } from './config';

export interface AdminUserSession {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isAdmin: boolean;
  isDemo?: boolean;
}

const DEMO_ADMIN_KEY = 'wedding_app_demo_admin_session';

export function getDemoSession(): AdminUserSession | null {
  try {
    const raw = localStorage.getItem(DEMO_ADMIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDemoSession(session: AdminUserSession | null) {
  if (session) {
    localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(DEMO_ADMIN_KEY);
  }
}

/**
 * The ONLY source of truth for admin access: does an `admins/{uid}` document
 * exist in Firestore? This mirrors firestore.rules' isAdmin() check exactly,
 * so the app never shows the admin UI to someone whose writes would be
 * rejected anyway. Being authenticated with Firebase is NOT enough on its
 * own — anyone can create a Firebase Auth account.
 */
async function checkIsAdminInFirestore(uid: string): Promise<boolean> {
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch (e) {
    console.warn('Admin allowlist check failed:', e);
    return false;
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminUserSession> {
  if (getIsLiveFirebase() && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;

      const isAllowed = await checkIsAdminInFirestore(u.uid);
      if (!isAllowed) {
        await firebaseSignOut(auth);
        throw new Error('Bu hesaba admin girişi verilməyib. Zəhmət olmasa sayt sahibi ilə əlaqə saxlayın.');
      }

      const session: AdminUserSession = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || email.split('@')[0],
        isAdmin: true,
      };
      setDemoSession(session);
      return session;
    } catch (err: any) {
      console.warn('Firebase login failed:', err);
      throw err;
    }
  }

  // Standalone / Demo mode
  if (email && password) {
    const demoSession: AdminUserSession = {
      uid: 'demo_admin_' + Date.now(),
      email: email,
      displayName: email.split('@')[0] || 'Admin',
      isAdmin: true,
      isDemo: true,
    };
    setDemoSession(demoSession);
    return demoSession;
  }

  throw new Error('E-poçt və şifrə tələb olunur.');
}

/**
 * Creates a new Firebase Auth account.
 *
 * ⚠️ Not called from any UI anymore (removed from AdminAuthModal) — public
 * self-registration used to grant instant admin access to anyone, because
 * the old Firestore rule treated "any authenticated user" as admin. A newly
 * registered account is never in the `admins/{uid}` allowlist yet, so this
 * function now immediately signs the account back out and throws — it can
 * no longer produce a working admin session by itself. Use this only for
 * scripted/one-off account bootstrap, then manually add the resulting UID
 * to the `admins` collection via the Firebase Console before that person
 * can actually log in.
 */
export async function registerAdmin(email: string, password: string): Promise<AdminUserSession> {
  if (getIsLiveFirebase() && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      await firebaseSignOut(auth);
      throw new Error(
        `Hesab yaradıldı (UID: ${u.uid}), lakin hələ admin təsdiqi yoxdur. Firestore-da "admins/${u.uid}" sənədini yaradın.`
      );
    } catch (err: any) {
      console.warn('Firebase register error:', err);
      throw err;
    }
  }

  // Standalone
  const session: AdminUserSession = {
    uid: 'demo_admin_' + Date.now(),
    email: email,
    displayName: email.split('@')[0],
    isAdmin: true,
    isDemo: true,
  };
  setDemoSession(session);
  return session;
}

export async function logoutAdmin(): Promise<void> {
  setDemoSession(null);
  if (getIsLiveFirebase() && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Firebase signout error:', e);
    }
  }
}

export function subscribeAuth(callback: (user: AdminUserSession | null) => void): () => void {
  if (getIsLiveFirebase() && auth) {
    // Live mode: never trust the locally-cached session by itself — it lives
    // in localStorage, which anyone can edit from devtools to fake
    // `{"isAdmin": true}`. Wait for Firebase's real auth state, then
    // re-verify against the Firestore admins allowlist before granting
    // anything. Start from a "logged out" assumption to avoid a flash of
    // unauthorized admin UI while that check is in flight.
    callback(null);

    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // Re-verify against the Firestore allowlist on every auth-state
        // change (page reload, token refresh, etc.) — not just at login
        // time — so a revoked admin loses UI access immediately too.
        checkIsAdminInFirestore(user.uid).then((isAllowed) => {
          if (!isAllowed) {
            setDemoSession(null);
            firebaseSignOut(auth).catch(() => {});
            callback(null);
            return;
          }
          const session: AdminUserSession = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            isAdmin: true,
          };
          setDemoSession(session);
          callback(session);
        });
      } else {
        setDemoSession(null);
        callback(null);
      }
    });
    return unsub;
  }

  // Standalone / demo mode: no real backend to verify against, so the
  // locally-cached session is the only source of truth (and never carries
  // any real data-access privileges anyway, since there's no live Firestore).
  const demo = getDemoSession();
  callback(demo);
  return () => {};
}
