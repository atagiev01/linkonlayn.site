import React from 'react';
import { StatsSummary, Invitation, RSVP } from '../../types';
import { BarChart3, Eye, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { getIsLiveFirebase } from '../../firebase/config';

interface AnalyticsViewProps {
  stats: StatsSummary;
  invitations: Invitation[];
  rsvps: RSVP[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, invitations, rsvps }) => {
  const isLive = getIsLiveFirebase();
  return (
    <div id="analytics-view-container" className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-400" />
          <span>Statistika & Analitika</span>
        </h2>
        <p className="text-xs text-stone-400">
          Dəvətnamələrin baxış statistikası və qonaqların iştirak nisbətləri.
        </p>
      </div>

      {!isLive && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Firebase canlı qoşulmayıb — buradakı baxış rəqəmləri yalnız bu cihazda toplanır, real müştəri
            baxışlarını əks etdirmir. "Firebase Ayarları" bölməsindən qoşulun.
          </p>
        </div>
      )}

      {/* Main Ratio Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>RSVP Qəbul Nisbəti</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{stats.acceptanceRate}%</div>
          <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${stats.acceptanceRate}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-stone-400 block pt-1">
            Cavab verənlərin {stats.acceptanceRate}%-i toya gələcəyini bildirib.
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Orta Baxış / Dəvətnamə</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {invitations.length > 0 ? Math.round(stats.totalViews / invitations.length) : 0}
          </div>
          <p className="text-[11px] text-stone-400">
            Hər dəvətnaməyə orta hesabla baxış sayı
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Orta Qonaq Sayı / RSVP</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {rsvps.filter((r) => r.attending).length > 0
              ? (
                  stats.attendingGuests / rsvps.filter((r) => r.attending).length
                ).toFixed(1)
              : '0'}
          </div>
          <p className="text-[11px] text-stone-400">
            Bir müsbət RSVP cavabına düşən orta qonaq sayı
          </p>
        </div>
      </div>

      {/* Breakdown by Invitations */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
        <h3 className="text-base font-bold text-stone-100">Dəvətnamələr üzrə Müqayisə</h3>
        <div className="space-y-3">
          {invitations.map((inv) => {
            const invRsvps = rsvps.filter(
              (r) => r.invitationId === inv.id || r.invitationSlug === inv.slug
            );
            const attendingCount = invRsvps
              .filter((r) => r.attending)
              .reduce((sum, r) => sum + (Number(r.guestCount) || 1), 0);
            const viewPercent = stats.totalViews > 0 ? Math.round(((inv.views || 0) / stats.totalViews) * 100) : 0;

            return (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-200">
                    {inv.groomName} & {inv.brideName}
                  </h4>
                  <div className="text-[11px] text-amber-400/80 font-mono">
                    /invite/{inv.slug} • {inv.weddingDate}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Baxış</span>
                    <span className="font-bold text-stone-200">{inv.views || 0} ({viewPercent}%)</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px]">RSVP</span>
                    <span className="font-bold text-purple-300">{invRsvps.length} cavab</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px]">Gələcək Qonaqlar</span>
                    <span className="font-bold text-emerald-400">{attendingCount} nəfər</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
