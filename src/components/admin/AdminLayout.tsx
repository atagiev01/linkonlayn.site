import React from 'react';
import {
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Cloud,
  Database,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { AdminUserSession } from '../../firebase/auth';
import { getIsLiveFirebase } from '../../firebase/config';

export type AdminTab = 'overview' | 'templates' | 'invitations' | 'rsvps' | 'analytics' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  user: AdminUserSession | null;
  onLogout: () => void;
  onOpenPublicHome?: () => void;
  onOpenCatalog?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  user,
  onLogout,
  onOpenPublicHome,
  onOpenCatalog,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isLive = getIsLiveFirebase();

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'İcmal & Dashboard', icon: LayoutDashboard },
    { id: 'invitations', label: 'Dəvətnamələr', icon: Mail },
    { id: 'templates', label: 'Şablonlar', icon: LayoutTemplate },
    { id: 'rsvps', label: 'RSVP Qonaqlar', icon: Users },
    { id: 'analytics', label: 'Statistika & Baxış', icon: BarChart3 },
    { id: 'settings', label: 'Firebase Parametrləri', icon: Settings },
  ];

  return (
    <div id="admin-panel-root" className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Toy Dəvətnamələri</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  Admin
                </span>
              </h1>
              <p className="text-[11px] text-stone-400 hidden sm:block">Firestore Şablon & Dəvətnamə Sistemi</p>
            </div>
          </div>
        </div>

        {/* Right Status & User Menu */}
        <div className="flex items-center gap-3">
          {/* Cloud Connection Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
            title={isLive ? 'Canlı Firebase Firestore bağlantısı aktivdir' : 'Yerli / Hazır Rejim Aktivdir'}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isLive ? 'Firebase Canlı' : 'Yerli Rejim'}</span>
          </div>

          {onOpenCatalog && (
            <button
              id="admin-go-to-catalog-btn"
              onClick={onOpenCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Müştərilərin gördüyü şablon kataloquna keçid"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Müştəri Kataloqu</span>
            </button>
          )}

          {onOpenPublicHome && (
            <button
              onClick={onOpenPublicHome}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Nümunə Linkə Get</span>
            </button>
          )}

          {/* User Account Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold block text-stone-200 truncate max-w-[120px]">
                {user?.displayName || user?.email || 'İnzibatçı'}
              </span>
              <span className="text-[10px] text-amber-400/80 block">Super Admin</span>
            </div>
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-stone-400 transition-colors"
              title="Çıxış"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex w-64 flex-col bg-stone-900 border-r border-stone-800/80 p-4 space-y-1.5 flex-shrink-0">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
            Əsas Menyu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6 mt-auto">
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Firestore Security</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Bütün şablonlar, dəvətnamələr və RSVP sorğuları təhlükəsiz qorunur.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[57px] z-30 bg-stone-900 border-b border-stone-800 p-4 space-y-2 shadow-2xl animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-amber-500 text-stone-950' : 'text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onOpenCatalog && (
              <button
                onClick={() => {
                  onOpenCatalog();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Müştəri Kataloquna Keç</span>
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-950">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
