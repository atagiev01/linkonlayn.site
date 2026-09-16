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
  Phone,
  QrCode,
  Navigation,
  Car,
  Heart,
} from 'lucide-react';

export const BlushGardenTemplate: React.FC<TemplateRenderProps> = ({
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
      id="blush-garden-template-root"
      className="min-h-screen bg-[#fbf7f4] text-stone-800 font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden relative"
    >
   

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#fbf7f4]/90 backdrop-blur-sm border-b border-[#eaddd4] px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a9645a] font-semibold">
            {invitation.groomName.charAt(0)}&{invitation.brideName.charAt(0)}
          </span>
          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-blush-garden"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#eaddd4] text-[#a9645a] text-xs hover:bg-[#f3e7e0] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-blush-garden"
              className="px-5 py-1.5 rounded-full bg-[#c98a80] text-white text-xs font-semibold hover:bg-[#b97669] transition-colors"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero — split editorial layout */}
      <section className="max-w-5xl mx-auto px-5 pt-12 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c98a80] mb-4 font-semibold">
            Evlilik Dəvətnaməsi
          </p>

          {(invitation.brideParents || invitation.groomParents) && (
            <p className="text-xs text-stone-500 mb-3 font-serif">
              {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-900 leading-tight mb-4">
            {invitation.groomName}
            <span className="inline-flex items-center mx-2 text-[#c98a80]">
              <Heart className="w-6 h-6 fill-current" />
            </span>
            {invitation.brideName}
          </h1>

          <p className="text-stone-500 text-sm sm:text-base mb-6 leading-relaxed max-w-md mx-auto md:mx-0 font-serif italic">
            "{invitation.customText}"
          </p>

          <div className="inline-flex flex-col gap-2 text-sm text-stone-700 mb-6">
            <span className="font-semibold">{formatDate(invitation.weddingDate)} — Saat {invitation.weddingTime}</span>
            <span className="text-stone-500">{invitation.venue}</span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <CalendarExportButton
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              weddingDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              venue={invitation.venue}
              address={invitation.address}
              className="bg-white border-[#eaddd4] text-[#a9645a] hover:bg-[#f3e7e0]"
            />
          </div>
        </div>

        {invitation.heroImage && (
          <div className="order-1 md:order-2 relative">
            <div className="absolute -inset-3 rounded-[2.5rem] border border-[#eaddd4] -z-10" />
            <div className="overflow-hidden rounded-[2rem] aspect-[3/4] shadow-xl shadow-[#eaddd4]/60">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Countdown Band */}
      <section className="py-10 px-5 bg-white border-y border-[#eaddd4]">
        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="floral"
        />
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-blush-garden" className="py-16 px-5">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c98a80] font-semibold">Proqram</span>
              <h2 className="text-3xl font-serif text-stone-900 mt-1">Günün Axarı</h2>
            </div>
            <div className="relative pl-6 border-l-2 border-[#eaddd4] space-y-8">
              {invitation.schedule.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#c98a80] border-4 border-[#fbf7f4]" />
                  <span className="text-xs font-mono font-semibold text-[#a9645a]">{item.time}</span>
                  <h4 className="text-base font-serif font-bold text-stone-900 mt-0.5">{item.title}</h4>
                  {item.description && <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {invitation.galleryImages && invitation.galleryImages.length > 0 && (
        <section className="py-16 px-5 bg-white border-y border-[#eaddd4]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c98a80] font-semibold">Qalereya</span>
              <h2 className="text-3xl font-serif text-stone-900 mt-1">Anlarımız</h2>
            </div>
            <div className="columns-2 md:columns-3 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
              {invitation.galleryImages.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-[#eaddd4] break-inside-avoid">
                  <img src={img} alt="Blush garden wedding moment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-blush-garden" className="py-16 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#f3e7e0] border border-[#eaddd4] flex items-center justify-center text-[#a9645a] mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#c98a80] font-semibold">Məkan</span>
          <h2 className="text-3xl font-serif text-stone-900 mt-1 mb-2">{invitation.venue}</h2>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">{invitation.address}</p>

          <div className="mb-6 rounded-[2rem] overflow-hidden border border-[#eaddd4] aspect-[16/9] sm:aspect-[21/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c98a80] text-white text-xs font-semibold hover:bg-[#b97669] transition-all"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#33ccff]/50 text-[#1a9cc7] text-xs font-semibold hover:bg-[#33ccff]/10 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Waze ilə Get</span>
            </a>

            {invitation.contactPhone && (
              <a
                href={`tel:${invitation.contactPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#eaddd4] text-[#a9645a] text-xs font-semibold hover:bg-[#f3e7e0] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp-section-blush-garden" className="py-20 px-5 bg-white border-t border-[#eaddd4]">
        <RSVPForm
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          contactPhone={invitation.contactPhone}
          weddingDate={invitation.weddingDate}
          theme="floral"
        />
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 text-center border-t border-[#eaddd4] text-xs text-stone-400">
        <p className="font-serif text-sm text-stone-700 mb-1">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-blush-garden"
        scheduleId="schedule-section-blush-garden"
        rsvpId="rsvp-section-blush-garden"
        showMusic={Boolean(invitation.music)}
        theme="light"
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
