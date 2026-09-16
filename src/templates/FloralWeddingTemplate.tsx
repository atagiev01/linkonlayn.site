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
  Heart,
  Phone,
  QrCode,
  Navigation,
  Flower2,
  Car,
} from 'lucide-react';

export const FloralWeddingTemplate: React.FC<TemplateRenderProps> = ({
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
      id="floral-template-root"
      className="min-h-screen bg-[#faf6f0] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden relative"
    >
      {/* Floating Petals / Background Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#f43f5e_0.5px,transparent_0.5px)] [background-size:20px_20px]"></div>

 

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 border-b border-rose-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-rose-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-stone-600 font-semibold">
              {invitation.groomName} & {invitation.brideName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="top-qr-btn-floral"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200 text-rose-700 text-xs hover:bg-rose-50 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-floral"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white text-xs font-semibold shadow-sm hover:shadow-rose-200 hover:shadow-md transition-all"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium mb-4">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Biz Evlənirik!</span>
        </div>

        {(invitation.brideParents || invitation.groomParents) && (
          <p className="text-xs text-stone-500 tracking-wide max-w-md mx-auto mb-3 font-serif">
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </p>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-2">
          Toy mərasimimizə xoş gəlmisiniz
        </p>

        {/* Cursive Romantic Names */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal text-stone-900 mb-4" style={{ fontFamily: 'Great Vibes, cursive' }}>
          <span className="text-rose-700">{invitation.groomName}</span>
          <span className="text-3xl sm:text-4xl text-stone-400 mx-3 font-serif">&</span>
          <span className="text-rose-700">{invitation.brideName}</span>
        </h1>

        {/* Date & Time */}
        <div className="my-5 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-full bg-white border border-rose-100 shadow-sm text-sm text-stone-700">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>{formatDate(invitation.weddingDate)}</span>
          </div>
          <div className="hidden sm:block text-stone-300">•</div>
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {/* Hero Photo with Soft Romantic Border */}
        {invitation.heroImage && (
          <div className="w-full max-w-xl mx-auto my-8 p-3 rounded-3xl bg-white border border-rose-100 shadow-xl shadow-rose-100/50 group">
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        )}

        {/* Custom Text */}
        <div className="max-w-lg mx-auto my-4 px-4">
          <p className="text-base sm:text-lg leading-relaxed text-stone-700 font-serif italic">
            "{invitation.customText}"
          </p>
        </div>

        {/* Countdown */}
        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="floral"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <CalendarExportButton
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            weddingDate={invitation.weddingDate}
            weddingTime={invitation.weddingTime}
            venue={invitation.venue}
            address={invitation.address}
            className="bg-white border-rose-200 text-rose-700 hover:bg-rose-50"
          />
        </div>
      </section>

      {/* Schedule Section */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-floral" className="py-16 px-4 bg-white border-y border-rose-100">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
                Günün Axarı
              </span>
              <h2 className="text-3xl font-serif text-stone-900 mt-1">Toy Proqramı</h2>
            </div>

            <div className="space-y-4">
              {invitation.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-white border border-rose-200 flex flex-col items-center justify-center text-rose-700 font-bold text-xs flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 mb-0.5 opacity-70" />
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-stone-900">{item.title}</h4>
                    {item.description && <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>}
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
              <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
                Qalereya
              </span>
              <h2 className="text-3xl font-serif text-stone-900 mt-1">Foto Albom</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitation.galleryImages.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-rose-100 shadow-sm">
                  <img src={img} alt="Floral wedding moment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue Section */}
      <section id="venue-section-floral" className="py-16 px-4 bg-white/70">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Məkan
          </span>
          <h2 className="text-3xl font-serif text-stone-900 mt-1 mb-2">
            {invitation.venue}
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
            {invitation.address}
          </p>

          <div className="mb-6 rounded-3xl overflow-hidden border border-rose-200 shadow-md shadow-rose-100/50 aspect-[16/9] sm:aspect-[21/9]">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-rose-200 text-rose-800 text-xs font-semibold hover:bg-rose-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp-section-floral" className="py-20 px-4">
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
      <footer className="py-10 px-4 text-center border-t border-rose-100 text-xs text-stone-400">
        <p className="font-serif text-sm text-stone-700 mb-1">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-floral"
        scheduleId="schedule-section-floral"
        rsvpId="rsvp-section-floral"
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
