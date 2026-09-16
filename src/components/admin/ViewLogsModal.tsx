import React, { useState } from 'react';
import { Eye, Smartphone, Monitor, Tablet, X, RotateCcw, ExternalLink, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Wifi } from 'lucide-react';
import { Invitation } from '../../types';
import { resetInvitationViews, incrementInvitationViews } from '../../firebase/firestore';
import { getIsLiveFirebase } from '../../firebase/config';

interface ViewLogsModalProps {
  invitation: Invitation;
  onClose: () => void;
}

export const ViewLogsModal: React.FC<ViewLogsModalProps> = ({ invitation, onClose }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const logs = invitation.viewLogs || [];
  const totalViews = invitation.views || 0;
  const isLive = getIsLiveFirebase();

  const mobileCount = logs.filter((l) => l.device === 'mobile').length;
  const desktopCount = logs.filter((l) => l.device === 'desktop').length;
  const tabletCount = logs.filter((l) => l.device === 'tablet').length;

  const mobilePercent = logs.length > 0 ? Math.round((mobileCount / logs.length) * 100) : 0;
  const desktopPercent = logs.length > 0 ? Math.round((desktopCount / logs.length) * 100) : 0;

  const handleReset = async () => {
    if (!window.confirm('Bu dəvətnamənin bütün baxış sayğacını və ziyarətçi tarixçəsini sıfırlamaq istədiyinizə əminsiniz?')) {
      return;
    }
    setIsResetting(true);
    try {
      await resetInvitationViews(invitation.id);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSimulateTestView = async () => {
    await incrementInvitationViews(invitation.id, invitation.slug, {
      device: 'mobile',
      browser: 'Test Brauzer (Admin Yoxlama)',
    });
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('az-AZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      id="view-logs-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="view-logs-modal-card"
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-stone-100 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Ziyarətçi & Baxış İzləmə</span>
                {isLive ? (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium whitespace-nowrap">
                    Canlı (bütün müştərilər)
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium whitespace-nowrap">
                    Yerli Rejim — yalnız bu cihaz
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400 truncate">
                {invitation.groomName} & {invitation.brideName} —{' '}
                <span className="text-amber-400 font-mono">/invite/{invitation.slug}</span>
              </p>
            </div>
          </div>
          <button
            id="close-view-logs-modal-btn"
            onClick={onClose}
            className="p-2 flex-shrink-0 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-300">
          {!isLive && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 mb-1">Diqqət: Firebase qoşulmayıb, sayğac hələ paylaşılmır</p>
                <p className="text-amber-200/80 leading-relaxed">
                  Bu rəqəmlər hazırda yalnız bu brauzerdə saxlanılır. Real müştərilər dəvətnaməni açanda onların baxışı
                  sizin admin panelinizə <strong>ötürülmür</strong>, çünki tətbiq "Yerli Rejim"də işləyir. Real vaxtda,
                  bütün müştərilər üçün doğru baxış sayı görmək üçün <strong>Firebase Ayarları</strong> bölməsindən canlı
                  Firebase layihəsi qoşmalı və həmin açarları saytın host (Vercel və s.) mühit dəyişənlərinə
                  (VITE_FIREBASE_...) əlavə etməlisiniz — əks halda hər ziyarətçinin öz cihazı ayrı sayılır.
                </p>
              </div>
            </div>
          )}
          {isLive && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-200 text-xs">
              <Wifi className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Firebase canlı qoşulub — aşağıdakı rəqəmlər bütün müştərilərin real baxışlarını əks etdirir.</p>
            </div>
          )}

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80">
              <p className="text-xs text-stone-400 mb-1">Ümumi Baxış Sayı</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400">{totalViews}</span>
                <span className="text-xs text-stone-500">həqiqi giriş</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80">
              <p className="text-xs text-stone-400 mb-1">Mobil Baxışlar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">{mobileCount}</span>
                <span className="text-xs text-stone-500 font-medium">
                  {mobilePercent}% (Smartfon)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80">
              <p className="text-xs text-stone-400 mb-1">Kompüter / Digər</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-400">{desktopCount + tabletCount}</span>
                <span className="text-xs text-stone-500 font-medium">
                  {desktopPercent}% (Kompüter)
                </span>
              </div>
            </div>
          </div>

          {/* Reset banner notification */}
          {resetSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Baxış sayğacı və ziyarətçi tarixçəsi uğurla sıfırlandı!</span>
            </div>
          )}

          {/* Logs List Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Dəqiq Ziyarət Tarixçəsi (Son Girişlər)
              </h3>
              <span className="text-xs text-stone-500">
                {logs.length > 0 ? `${logs.length} giriş qeydə alınıb` : 'Giriş yoxdur'}
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-stone-950/40 border border-stone-800/60">
                <ShieldCheck className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-stone-300 mb-1">
                  Hələlik heç bir qonaq bu linki açmayıb
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
                  Dəvətnamə linkini qonaqlara və ya müştərilərə WhatsApp ilə göndərdiyiniz zaman hər bir real
                  ziyarət dəqiq saniyəsi, cihazı (iPhone, Android, PC) ilə bu siyahıya avtomatik düşəcək.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={`/invite/${invitation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Linki Yeni Pəncərədə Aç (Yoxla)</span>
                  </a>
                  <button
                    onClick={handleSimulateTestView}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-700 transition-colors"
                  >
                    <span>+ Test Baxışı Əlavə Et</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => {
                  const isMobile = log.device === 'mobile';
                  const isTablet = log.device === 'tablet';

                  return (
                    <div
                      key={log.id || index}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs hover:border-stone-700/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isMobile
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isTablet
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {isMobile ? (
                            <Smartphone className="w-4 h-4" />
                          ) : isTablet ? (
                            <Tablet className="w-4 h-4" />
                          ) : (
                            <Monitor className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-200">
                              {isMobile
                                ? 'Mobil Ziyarətçi'
                                : isTablet
                                ? 'Planşet Ziyarətçi'
                                : 'Kompüter Ziyarətçi'}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                              {log.browser || 'Brauzer'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Real ziyarətçi identifikasiyası aktivdir
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-stone-300 font-medium block">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                          Uğurlu Giriş
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <button
            id="reset-views-btn"
            onClick={handleReset}
            disabled={isResetting || totalViews === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sayğacı Sıfırla (0 et)</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              id="open-invite-external-btn"
              href={`/invite/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Dəvətnaməni Aç</span>
            </a>
            <button
              id="close-modal-footer-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 text-xs font-bold transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
