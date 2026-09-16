import React, { useState } from 'react';
import { TemplateRenderProps } from './types';
import { CountdownTimer } from '../components/public/CountdownTimer';
import { RSVPForm } from '../components/public/RSVPForm';
import { MusicPlayer } from '../components/public/MusicPlayer';
import { QRCodeModal } from '../components/public/QRCodeModal';
import { QuickActionsDock } from '../components/public/QuickActionsDock';
import { CalendarExportButton } from '../components/public/CalendarExportButton';
import {
  MapPin,
  Clock,
  Calendar,
  Phone,
  QrCode,
  Navigation,
  Car,
  Zap,
} from 'lucide-react';

export const NeonNightTemplate: React.FC<TemplateRenderProps> = ({
  invitation,
  template,
  isGuestMode = true,
}) => {
  const [showQR, setShowQR] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('az-AZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id="neon-night-template-root"
      className="min-h-screen bg-[#0a0a0f] text-stone-100 font-sans selection:bg-fuchsia-500/40 selection:text-white overflow-x-hidden relative"
    >
      {/* Neon grid backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />



      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#0a0a0f]/80 backdrop-blur-md border-b border-fuchsia-500/20 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {invitation.groomName} × {invitation.brideName}
          </span>
          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-neon-night"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/40 text-cyan-300 text-xs hover:bg-cyan-400/10 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-neon-night"
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black text-xs font-bold shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_28px_rgba(217,70,239,0.6)] transition-shadow"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-semibold mb-6 tracking-wide">
          <Zap className="w-3.5 h-3.5" />
          <span>BİZ EVLƏNİRİK</span>
        </div>

        {(invitation.brideParents || invitation.groomParents) && (
          <p className="text-xs text-stone-400 tracking-wide max-w-md mx-auto mb-3">
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </p>
        )}

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[0.95]">
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-fuchsia-400"
            style={{ textShadow: '0 0 40px rgba(217,70,239,0.35)' }}
          >
            {invitation.groomName}
          </span>
          <span className="block text-2xl sm:text-3xl text-stone-500 my-1">&</span>
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-300"
            style={{ textShadow: '0 0 40px rgba(34,211,238,0.35)' }}
          >
            {invitation.brideName}
          </span>
        </h1>

        <div className="my-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-stone-200 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            <span>{formatDate(invitation.weddingDate)}</span>
          </div>
          <div className="hidden sm:block text-stone-600">•</div>
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {invitation.heroImage && (
          <div className="w-full max-w-xl mx-auto my-8 p-1 rounded-3xl bg-gradient-to-r from-fuchsia-500/60 via-transparent to-cyan-400/60 group">
            <div className="overflow-hidden rounded-[1.4rem] aspect-[4/3] bg-[#0a0a0f]">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto my-4 px-4">
          <p className="text-base sm:text-lg leading-relaxed text-stone-300">
            "{invitation.customText}"
          </p>
        </div>

        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="minimal"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <CalendarExportButton
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            weddingDate={invitation.weddingDate}
            weddingTime={invitation.weddingTime}
            venue={invitation.venue}
            address={invitation.address}
            className="bg-white/5 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
          />
        </div>
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-neon-night" className="py-16 px-4 border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 font-semibold">
                Vaxt Xətti
              </span>
              <h2 className="text-3xl font-bold text-white mt-1">Gecənin Proqramı</h2>
            </div>

            <div className="space-y-4">
              {invitation.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-400/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-black/40 border border-cyan-400/30 flex flex-col items-center justify-center text-cyan-300 font-bold text-xs flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 mb-0.5 opacity-70" />
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    {item.description && <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {invitation.galleryImages && invitation.galleryImages.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-semibold">
                Qalereya
              </span>
              <h2 className="text-3xl font-bold text-white mt-1">Anlar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitation.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden aspect-square border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                >
                  <img src={img} alt="Neon wedding moment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-neon-night" className="py-16 px-4 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-300 mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 font-semibold">
            Məkan
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 mb-2">{invitation.venue}</h2>
          <p className="text-stone-400 text-sm max-w-md mx-auto mb-6">{invitation.address}</p>

          <div className="mb-6 rounded-3xl overflow-hidden border border-white/10 aspect-[16/9] sm:aspect-[21/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full grayscale invert-[0.9] contrast-[1.1]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={
                invitation.mapCoordinates?.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black text-xs font-bold hover:shadow-[0_0_24px_rgba(217,70,239,0.5)] transition-shadow"
            >
              <Navigation className="w-4 h-4" />
              <span>Xəritədə Aç</span>
            </a>

            <a
              href={
                invitation.wazeUrl ||
                `https://waze.com/ul?q=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}&navigate=yes`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-400/10 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Waze ilə Get</span>
            </a>

            {invitation.contactPhone && (
              <a
                href={`tel:${invitation.contactPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-stone-200 text-xs font-semibold hover:bg-white/5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp-section-neon-night" className="py-20 px-4">
        <RSVPForm
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          contactPhone={invitation.contactPhone}
          weddingDate={invitation.weddingDate}
          theme="modern"
        />
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-white/10 text-xs text-stone-500">
        <p className="text-sm text-stone-300 mb-1 font-semibold">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-neon-night"
        scheduleId="schedule-section-neon-night"
        rsvpId="rsvp-section-neon-night"
        showMusic={Boolean(invitation.music)}
        theme="dark"
      />

      {showQR && (
        <QRCodeModal
          url={currentUrl}
          title={`${invitation.groomName} & ${invitation.brideName}`}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};
