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
  Sparkles,
  Navigation,
  Crown,
  Car,
} from 'lucide-react';

export const LuxuryWeddingTemplate: React.FC<TemplateRenderProps> = ({
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
      id="luxury-template-root"
      className="min-h-screen bg-[#07090e] text-stone-100 font-sans selection:bg-[#dfb76c] selection:text-black overflow-x-hidden relative"
    >
      {/* Background Deep Glow Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(223,183,108,0.12),transparent_60%)]"></div>

      {/* Floating Music Player */}
      {invitation.music && (
        <MusicPlayer
          musicUrl={invitation.music}
          musicTitle={invitation.musicTitle || `${invitation.brideName} & ${invitation.groomName} Toy Valsı`}
          theme="luxury"
        />
      )}

      {/* Top Luxury Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#07090e]/97 border-b border-[#dfb76c]/20 px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#dfb76c]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#dfb76c] font-semibold">
              LUXURY WEDDING
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-luxury"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#dfb76c]/30 text-[#dfb76c] text-xs hover:bg-[#dfb76c]/10 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-luxury"
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#dfb76c] to-[#f4d084] text-black text-xs font-bold shadow-lg shadow-[#dfb76c]/20 hover:scale-105 transition-all"
            >
              RSVP Təsdiqi
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs uppercase tracking-[0.25em] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Təntənəli Toy Dəvətnaməsi</span>
        </div>

        {/* Groom & Bride Names in High-fashion serif */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif tracking-tight text-white mb-6">
          <span className="bg-gradient-to-r from-[#f4d084] via-[#dfb76c] to-[#bf9546] bg-clip-text text-transparent font-light">
            {invitation.groomName}
          </span>
          <span className="block text-2xl sm:text-3xl text-[#dfb76c]/70 my-2 font-serif font-normal italic">
            &
          </span>
          <span className="font-light text-stone-100">{invitation.brideName}</span>
        </h1>

        {/* Date & Time */}
        <div className="my-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-8 py-3.5 rounded-2xl bg-[#0f131f]/90 border border-[#dfb76c]/30 backdrop-blur-md text-sm text-[#dfb76c]">
          <div className="flex items-center gap-2 font-medium tracking-wider">
            <Calendar className="w-4 h-4 text-[#dfb76c]" />
            <span>{formatDate(invitation.weddingDate)}</span>
          </div>
          <div className="hidden sm:block text-[#dfb76c]/40">•</div>
          <div className="flex items-center gap-2 font-medium tracking-wider">
            <Clock className="w-4 h-4 text-[#dfb76c]" />
            <span>Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {/* Hero Image */}
        {invitation.heroImage && (
          <div className="w-full max-w-3xl mx-auto my-10 p-2 rounded-3xl bg-[#0f131f] border border-[#dfb76c]/40 shadow-2xl shadow-[#dfb76c]/10">
            <div className="overflow-hidden rounded-2xl aspect-[16/9]">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Custom Text */}
        <div className="max-w-2xl mx-auto my-6 px-4">
          <p className="text-lg sm:text-xl leading-relaxed text-stone-300 font-serif italic">
            "{invitation.customText}"
          </p>
        </div>

        {/* Countdown */}
        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="luxury"
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <CalendarExportButton
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            weddingDate={invitation.weddingDate}
            weddingTime={invitation.weddingTime}
            venue={invitation.venue}
            address={invitation.address}
            className="border-[#dfb76c]/40 text-[#dfb76c] hover:bg-[#dfb76c]/10"
          />
        </div>
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-luxury" className="py-20 px-4 bg-[#0a0d16] border-y border-[#dfb76c]/15">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] text-[#dfb76c] font-semibold">
                Tədbir Qrafiki
              </span>
              <h2 className="text-3xl font-serif text-white mt-1">Mərasim Cədvəli</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {invitation.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0f1424]/70 border border-[#dfb76c]/25 backdrop-blur-sm"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#dfb76c] block mb-1">
                    {item.time}
                  </span>
                  <h4 className="text-base font-bold text-white font-serif">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-stone-400 mt-1">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-luxury" className="py-20 px-4 bg-[#07090e]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0f1424] border border-[#dfb76c]/40 flex items-center justify-center text-[#dfb76c] mx-auto mb-4 shadow-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#dfb76c] font-semibold">
            Təntənəli Məkan
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-1 mb-2">
            {invitation.venue}
          </h2>
          <p className="text-stone-300 text-sm max-w-lg mx-auto mb-6">
            {invitation.address}
          </p>

          {invitation.dressCode && (
            <div className="inline-block px-5 py-2 rounded-xl bg-[#0f1424] border border-[#dfb76c]/30 text-xs text-[#dfb76c] font-sans mb-8">
              <strong>Dress Code:</strong> {invitation.dressCode}
            </div>
          )}

          <div className="mb-8 rounded-2xl overflow-hidden border border-[#dfb76c]/30 shadow-2xl shadow-black/40 aspect-[16/9] sm:aspect-[21/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full grayscale-[20%] contrast-[1.1] brightness-95"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={
                invitation.mapCoordinates?.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#dfb76c] text-black text-xs font-bold hover:bg-[#f4d084] transition-all shadow-xl shadow-[#dfb76c]/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Xəritədə Marşrutu Aç</span>
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
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#33ccff]/50 text-[#33ccff] text-xs font-semibold hover:bg-[#33ccff]/10 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Waze ilə Get</span>
            </a>

            {invitation.contactPhone && (
              <a
                href={`tel:${invitation.contactPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold hover:bg-[#dfb76c]/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp-section-luxury" className="py-20 px-4">
        <RSVPForm
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          contactPhone={invitation.contactPhone}
          weddingDate={invitation.weddingDate}
          theme="luxury"
        />
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-[#dfb76c]/15 text-xs text-stone-500">
        <p className="font-serif text-sm text-[#dfb76c] mb-1">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Luxury Digital Wedding Invitation</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-luxury"
        scheduleId="schedule-section-luxury"
        rsvpId="rsvp-section-luxury"
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
