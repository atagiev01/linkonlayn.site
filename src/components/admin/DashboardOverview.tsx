import React from 'react';
import { Invitation, Template, RSVP, StatsSummary } from '../../types';
import {
  Mail,
  Users,
  Eye,
  CheckCircle2,
  Plus,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: StatsSummary;
  invitations: Invitation[];
  templates: Template[];
  rsvps: RSVP[];
  onOpenCreateInvitation: () => void;
  onNavigateToTab: (tab: any) => void;
  onPreviewInvitation: (inv: Invitation) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  invitations,
  templates,
  rsvps,
  onOpenCreateInvitation,
  onNavigateToTab,
  onPreviewInvitation,
}) => {
  const recentRSVPs = [...rsvps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topInvitations = [...invitations]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <div id="dashboard-overview-container" className="space-y-8 animate-fade-in">
      {/* Top Banner / Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-stone-900 to-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Firestore Dəvətnamə Paneli</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              Xoş gəlmisiniz, İnzibatçı!
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Buradan dəvətnamə şablonlarını idarə edə, istənilən sayda yeni dəvətnamə linki yarada, qonaqların RSVP cavablarını və baxış saylarını real-vaxtda izləyə bilərsiniz.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <button
              id="dashboard-create-inv-btn"
              onClick={onOpenCreateInvitation}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-xs hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Dəvətnamə Yarat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Essential Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Invitations */}
        <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl relative group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-400">Ümumi Dəvətnamələr</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-100">{stats.totalInvitations}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>{stats.activeInvitations} aktiv dəvətnamə</span>
          </div>
        </div>

        {/* Card 2: Total Views */}
        <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl relative group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-400">Ümumi Baxışlar</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-100">{stats.totalViews}</div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Real ziyarətçi və cihaz izləməsi</span>
          </div>
        </div>

        {/* Card 3: Total RSVPs */}
        <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl relative group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-400">Ümumi RSVP Cavabları</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-100">{stats.totalRSVPs}</div>
          <div className="text-[11px] text-stone-400 mt-1">
            <span>Konversiya: {stats.acceptanceRate}%</span>
          </div>
        </div>

        {/* Card 4: Attending Guests */}
        <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl relative group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-400">İştirak Edəcək Qonaqlar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.attendingGuests} nəfər</div>
          <div className="text-[11px] text-rose-400 mt-1">
            <span>{stats.declinedRSVPs} imtina cavabı</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Invitations & Live RSVP Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Active Invitations List with Slugs */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Dəvətnamələr & Şablonlar</span>
              </h3>
              <p className="text-xs text-stone-400">Ən çox baxılan dəvətnamə linkləri</p>
            </div>
            <button
              onClick={() => onNavigateToTab('invitations')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Hamısına bax</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topInvitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-800 flex-shrink-0">
                    <img src={inv.heroImage} alt={inv.groomName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">
                      {inv.groomName} & {inv.brideName}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                      <span className="font-mono text-amber-400">/invite/{inv.slug}</span>
                      <span>•</span>
                      <span className="capitalize">{inv.templateId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-2 hidden sm:block">
                    <span className="text-xs font-bold text-stone-200 block">{inv.views || 0} baxış</span>
                    <span className="text-[10px] text-stone-500">{inv.weddingDate}</span>
                  </div>
                  <button
                    onClick={() => onPreviewInvitation(inv)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    title="Dəvətnaməyə Bax"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live RSVP Stream */}
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Son RSVP Cavabları</span>
              </h3>
              <p className="text-xs text-stone-400">Qonaqların real-vaxtda göndərdiyi təsdiqlər</p>
            </div>
            <button
              onClick={() => onNavigateToTab('rsvps')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>RSVP Paneli</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRSVPs.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-500">
                Hələ heç bir RSVP cavabı daxil olmayıb.
              </div>
            ) : (
              recentRSVPs.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-200">{rsvp.guestName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          rsvp.attending
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {rsvp.attending ? `İştirak edəcək (${rsvp.guestCount} nəfər)` : 'İştirak edə bilmir'}
                      </span>
                    </div>

                    {rsvp.message && (
                      <p className="text-[11px] text-stone-400 italic">"{rsvp.message}"</p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                      <span>Dəvətnamə: {rsvp.invitationSlug || rsvp.invitationId}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-500 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(rsvp.createdAt).toLocaleDateString('az-AZ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
