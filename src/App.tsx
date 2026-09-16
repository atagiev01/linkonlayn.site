import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Template,
  Invitation,
  RSVP,
  StatsSummary,
} from './types';
import {
  subscribeTemplates,
  subscribeInvitations,
  subscribeRSVPs,
  saveTemplate,
  deleteTemplate,
  saveInvitation,
  deleteInvitation,
  deleteRSVP,
  calculateStats,
} from './firebase/firestore';
import {
  subscribeAuth,
  logoutAdmin,
  AdminUserSession,
} from './firebase/auth';
import { AdminTab } from './components/admin/AdminLayout';
import { PublicInvitationView } from './components/public/PublicInvitationView';
import { CustomerCatalogView } from './components/public/CustomerCatalogView';
import { ShieldCheck } from 'lucide-react';

// Admin panel code is only ever needed by the site owner, never by a wedding
// guest opening an invitation link or browsing the public catalog. Loading it
// lazily keeps the customer-facing bundle small and fast on all devices.
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const DashboardOverview = lazy(() =>
  import('./components/admin/DashboardOverview').then((m) => ({ default: m.DashboardOverview }))
);
const InvitationsManager = lazy(() =>
  import('./components/admin/InvitationsManager').then((m) => ({ default: m.InvitationsManager }))
);
const TemplatesManager = lazy(() =>
  import('./components/admin/TemplatesManager').then((m) => ({ default: m.TemplatesManager }))
);
const RSVPManager = lazy(() =>
  import('./components/admin/RSVPManager').then((m) => ({ default: m.RSVPManager }))
);
const AnalyticsView = lazy(() =>
  import('./components/admin/AnalyticsView').then((m) => ({ default: m.AnalyticsView }))
);
const FirebaseSettingsView = lazy(() =>
  import('./components/admin/FirebaseSettingsView').then((m) => ({ default: m.FirebaseSettingsView }))
);
const InvitationEditorModal = lazy(() =>
  import('./components/admin/InvitationEditorModal').then((m) => ({ default: m.InvitationEditorModal }))
);
const AdminAuthModal = lazy(() =>
  import('./components/admin/AdminAuthModal').then((m) => ({ default: m.AdminAuthModal }))
);

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-400 text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
        <span>İdarəetmə paneli yüklənir...</span>
      </div>
    </div>
  );
}

type AppView = 'catalog' | 'admin' | 'invitation' | 'preview';

export default function App() {
  // Global Data State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [user, setUser] = useState<AdminUserSession | null>(null);

  // Admin Navigation State
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modal / Editor State
  const [isCreateInvModalOpen, setIsCreateInvModalOpen] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);

  // Routing State
  const [appView, setAppView] = useState<AppView>('catalog');
  const [activePublicSlug, setActivePublicSlug] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [previewSource, setPreviewSource] = useState<'admin' | 'customer'>('customer');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 1. Resolve URL / Path on mount and popstate
  useEffect(() => {
    function resolveRoute() {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      // Check query param e.g. ?invite=ali-ve-nigar
      const queryInvite = searchParams.get('invite') || searchParams.get('slug');
      if (queryInvite) {
        setActivePublicSlug(queryInvite);
        setPreviewTemplateId(null);
        setIsPreviewMode(searchParams.get('preview') === 'true');
        setAppView('invitation');
        return;
      }

      // Check preview template param e.g. ?preview_template=custom-video-envelope
      const previewTpl = searchParams.get('preview_template');
      if (previewTpl) {
        setPreviewTemplateId(previewTpl);
        setActivePublicSlug(null);
        setIsPreviewMode(true);
        setPreviewSource(searchParams.get('from') === 'admin' ? 'admin' : 'customer');
        setAppView('preview');
        return;
      }

      // Check template preview path e.g. /preview/template/:id or /template-preview/:id
      if (path.startsWith('/preview/template/') || path.startsWith('/template-preview/')) {
        const parts = path.split('/').filter(Boolean);
        const tplId = parts[parts.length - 1];
        if (tplId) {
          setPreviewTemplateId(tplId);
          setActivePublicSlug(null);
          setIsPreviewMode(true);
          setPreviewSource(searchParams.get('from') === 'admin' ? 'admin' : 'customer');
          setAppView('preview');
          return;
        }
      }

      // Check Admin path or hash e.g. /admin, #admin, ?admin=true
      if (
        path.startsWith('/admin') ||
        hash.startsWith('#admin') ||
        searchParams.get('admin') === 'true'
      ) {
        setActivePublicSlug(null);
        setPreviewTemplateId(null);
        setIsPreviewMode(false);
        setAppView('admin');
        return;
      }

      // Check pathname e.g. /invite/ali-ve-nigar or /d/ali-ve-nigar
      if (path.startsWith('/invite/') || path.startsWith('/d/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2) {
          setActivePublicSlug(parts[1]);
          setPreviewTemplateId(null);
          setIsPreviewMode(false);
          setAppView('invitation');
          return;
        }
      } else if (
        path !== '/' &&
        path !== '/catalog' &&
        path !== '/templates' &&
        !path.startsWith('/admin') &&
        path.length > 2
      ) {
        // e.g. /ali-ve-nigar
        const slugCandidate = path.replace(/^\//, '');
        if (slugCandidate && !slugCandidate.includes('.')) {
          setActivePublicSlug(slugCandidate);
          setPreviewTemplateId(null);
          setIsPreviewMode(false);
          setAppView('invitation');
          return;
        }
      }

      // Check Hash e.g. #/invite/ali-ve-nigar
      if (hash.startsWith('#/invite/') || hash.startsWith('#/d/')) {
        const slug = hash.split('/')[2];
        if (slug) {
          setActivePublicSlug(slug);
          setPreviewTemplateId(null);
          setIsPreviewMode(false);
          setAppView('invitation');
          return;
        }
      }

      // Default View: Customer Template Catalog Showcase!
      setActivePublicSlug(null);
      setPreviewTemplateId(null);
      setIsPreviewMode(false);
      setAppView('catalog');
    }

    resolveRoute();
    window.addEventListener('popstate', resolveRoute);
    return () => window.removeEventListener('popstate', resolveRoute);
  }, [invitations]);

  // 2. Real-time Subscriptions (Firestore onSnapshot)
  useEffect(() => {
    const unsubTemplates = subscribeTemplates((tpls) => {
      setTemplates(tpls);
    });

    const unsubInvitations = subscribeInvitations((invs) => {
      setInvitations(invs);
    });

    const unsubRSVPs = subscribeRSVPs((rlist) => {
      setRSVPs(rlist);
    });

    const unsubAuth = subscribeAuth((adminUser) => {
      setUser(adminUser);
    });

    return () => {
      unsubTemplates();
      unsubInvitations();
      unsubRSVPs();
      unsubAuth();
    };
  }, []);

  const stats: StatsSummary = calculateStats(invitations, rsvps);

  // Navigation Helpers
  const handleOpenInvitationPublic = (slugOrId: string, preview = false) => {
    setActivePublicSlug(slugOrId);
    setPreviewTemplateId(null);
    setIsPreviewMode(preview);
    setPreviewSource('admin');
    setAppView('invitation');
    window.history.pushState({}, '', `/invite/${slugOrId}${preview ? '?preview=true' : ''}`);
  };

  const handleReturnToAdmin = () => {
    setActivePublicSlug(null);
    setPreviewTemplateId(null);
    setIsPreviewMode(false);
    setAppView('admin');
    window.history.pushState({}, '', '/admin');
  };

  const handleReturnToCatalog = () => {
    setActivePublicSlug(null);
    setPreviewTemplateId(null);
    setIsPreviewMode(false);
    setAppView('catalog');
    window.history.pushState({}, '', '/');
  };

  const handlePreviewTemplateFromAdmin = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setActivePublicSlug(null);
    setIsPreviewMode(true);
    setPreviewSource('admin');
    setAppView('preview');
    window.history.pushState({}, '', `?preview_template=${encodeURIComponent(templateId)}&from=admin`);
  };

  const handlePreviewTemplateFromCatalog = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setActivePublicSlug(null);
    setIsPreviewMode(true);
    setPreviewSource('customer');
    setAppView('preview');
    window.history.pushState({}, '', `?preview_template=${encodeURIComponent(templateId)}&from=customer`);
  };

  // 1. Template Preview or Direct Public Invitation View
  if (appView === 'preview' || (appView === 'invitation' && activePublicSlug)) {
    return (
      <PublicInvitationView
        slugOrId={activePublicSlug || ''}
        previewTemplateId={previewTemplateId}
        isPreview={isPreviewMode}
        previewSource={previewSource}
        onNavigateHome={handleReturnToAdmin}
        onNavigateToCatalog={handleReturnToCatalog}
      />
    );
  }

  // 2. Customer-facing Template Showcase & Catalog Page
  if (appView === 'catalog') {
    return (
      <CustomerCatalogView
        templates={templates}
        onPreviewTemplate={handlePreviewTemplateFromCatalog}
        onNavigateToAdmin={() => {
          setAppView('admin');
          window.history.pushState({}, '', '/admin');
        }}
      />
    );
  }

  // 3. Admin Panel
  if (!user && isAuthModalOpen) {
    return (
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminAuthModal
          onSuccess={() => setIsAuthModalOpen(false)}
          onCancel={() => setIsAuthModalOpen(false)}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Suspense fallback={<AdminLoadingFallback />}>
      <AdminLayout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        user={user}
        onLogout={async () => {
          await logoutAdmin();
          setUser(null);
        }}
        onOpenCatalog={handleReturnToCatalog}
        onOpenPublicHome={() => {
          if (invitations.length > 0) {
            handleOpenInvitationPublic(invitations[0].slug, false);
          }
        }}
      >
        {/* If user is not logged in, show auth prompt banner or lock */}
        {!user ? (
          <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-stone-900 border border-amber-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              Admin İdarəetmə Paneli
            </h2>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
              Toy dəvətnamələrini redaktə etmək, yeni şablonlar əlavə etmək və RSVP qonaq siyahısına baxmaq üçün admin girişi tələb olunur.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                id="open-login-modal-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Admin Girişi / Demo Giriş
              </button>
              <button
                onClick={handleReturnToCatalog}
                className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
              >
                Şablonlar Kataloquna Bax
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab 1: Dashboard Overview */}
            {currentTab === 'overview' && (
              <DashboardOverview
                stats={stats}
                invitations={invitations}
                templates={templates}
                rsvps={rsvps}
                onOpenCreateInvitation={() => {
                  setEditingInvitation(null);
                  setIsCreateInvModalOpen(true);
                }}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onPreviewInvitation={(inv) => handleOpenInvitationPublic(inv.slug, true)}
              />
            )}

            {/* Tab 2: Invitations Manager */}
            {currentTab === 'invitations' && (
              <InvitationsManager
                invitations={invitations}
                templates={templates}
                onOpenCreate={() => {
                  setEditingInvitation(null);
                  setIsCreateInvModalOpen(true);
                }}
                onEditInvitation={(inv) => {
                  setEditingInvitation(inv);
                  setIsCreateInvModalOpen(true);
                }}
                onDeleteInvitation={async (id) => {
                  await deleteInvitation(id);
                }}
                onToggleActive={async (inv) => {
                  await saveInvitation({
                    ...inv,
                    active: !inv.active,
                    updatedAt: new Date().toISOString(),
                  });
                }}
                onPreviewInvitation={(inv) => handleOpenInvitationPublic(inv.slug, true)}
              />
            )}

            {/* Tab 3: Templates Manager */}
            {currentTab === 'templates' && (
              <TemplatesManager
                templates={templates}
                onSaveTemplate={async (tpl) => {
                  await saveTemplate(tpl);
                }}
                onDeleteTemplate={async (id) => {
                  await deleteTemplate(id);
                }}
                onPreviewTemplate={handlePreviewTemplateFromAdmin}
              />
            )}

            {/* Tab 4: RSVP Manager */}
            {currentTab === 'rsvps' && (
              <RSVPManager
                rsvps={rsvps}
                invitations={invitations}
                onDeleteRSVP={async (id) => {
                  await deleteRSVP(id);
                }}
              />
            )}

            {/* Tab 5: Analytics */}
            {currentTab === 'analytics' && (
              <AnalyticsView
                stats={stats}
                invitations={invitations}
                rsvps={rsvps}
              />
            )}

            {/* Tab 6: Settings */}
            {currentTab === 'settings' && <FirebaseSettingsView />}
          </>
        )}
      </AdminLayout>

      {/* Create / Edit Invitation Modal */}
      {isCreateInvModalOpen && (
        <InvitationEditorModal
          isOpen={isCreateInvModalOpen}
          initialData={editingInvitation}
          templates={templates.filter((t) => t.active)}
          onSave={async (inv) => {
            await saveInvitation(inv);
          }}
          onClose={() => {
            setIsCreateInvModalOpen(false);
            setEditingInvitation(null);
          }}
          onPreview={(inv) => handleOpenInvitationPublic(inv.slug, true)}
        />
      )}
      </Suspense>
    </div>
  );
}
