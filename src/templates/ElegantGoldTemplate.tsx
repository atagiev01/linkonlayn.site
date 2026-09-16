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
  Music,
  Car,
} from 'lucide-react';

export const ElegantGoldTemplate: React.FC<TemplateRenderProps> = ({
  invitation,
  template,
  isGuestMode = true,
}) => {
  const [showQR, setShowQR] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const initials = `${invitation.brideName.charAt(0)} & ${invitation.groomName.charAt(0)}`;

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
      id="elegant-gold-template-root"
      className="min-h-screen bg-[#0f0e0c] text-[#f7f2e7] font-serif selection:bg-[#c89b3f] selection:text-black overflow-x-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(200, 155, 63, 0.08) 0%, transparent 70%)`,
      }}
    >
      {/* Background Gold Grain & Ambient Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#c89b3f_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Floating Music Player */}
      {invitation.music && (
        <MusicPlayer
          musicUrl={invitation.music}
          musicTitle={invitation.musicTitle || `${invitation.brideName} & ${invitation.groomName} Toy Valsı`}
          theme="gold"
        />
      )}

      {/* Top Floating Action Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#0f0e0c]/95 border-b border-[#c89b3f]/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full border border-[#c89b3f] flex items-center justify-center text-[#c89b3f] font-serif text-xs font-bold">
              {initials}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#c89b3f] font-sans font-semibold">
              Rəqəmsal Dəvətnamə
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="top-qr-btn"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c89b3f]/40 text-[#c89b3f] text-xs font-sans hover:bg-[#c89b3f]/10 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c89b3f] to-[#e6be65] text-[#0f0e0c] text-xs font-sans font-bold hover:shadow-lg hover:shadow-[#c89b3f]/20 transition-all"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
        {/* Royal Monogram Frame */}
        <div className="relative mb-6 animate-fade-in">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#c89b3f] p-1.5 flex items-center justify-center mx-auto shadow-2xl shadow-[#c89b3f]/20">
            <div className="w-full h-full rounded-full border border-[#c89b3f]/40 flex flex-col items-center justify-center bg-[#171512]">
              <Sparkles className="w-4 h-4 text-[#c89b3f] mb-0.5 animate-pulse" />
              <span className="text-xl sm:text-2xl font-bold tracking-widest text-[#e6be65]">
                {initials}
              </span>
            </div>
          </div>
          {/* Gold Decorative Corner Wings */}
          <div className="text-[#c89b3f] text-xs tracking-[0.3em] uppercase font-sans mt-3">
            BİSMİLLAHİR-RƏHMANİR-RƏHİM
          </div>
        </div>

        {/* Parents Announcement (if provided) */}
        {(invitation.brideParents || invitation.groomParents) && (
          <p className="text-xs sm:text-sm text-[#e6be65]/80 font-sans tracking-wide max-w-lg mx-auto mb-4 italic">
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </p>
        )}

        <div className="text-xs uppercase tracking-[0.4em] text-[#c89b3f] font-sans font-medium mb-3">
          Övladlarının Toy Mərasiminə Dəvət Edirlər
        </div>

        {/* Bride & Groom Names */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#fbf8f1] mb-4">
          <span className="block text-[#e6be65]">{invitation.groomName}</span>
          <span className="text-2xl sm:text-4xl font-serif text-[#c89b3f] my-1 block">&</span>
          <span className="block text-[#fbf8f1]">{invitation.brideName}</span>
        </h1>

        {/* Wedding Date & Time Highlight */}
        <div className="my-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl border border-[#c89b3f]/30 bg-[#171512]/80 backdrop-blur-sm text-sm sm:text-base text-[#e6be65]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c89b3f]" />
            <span className="font-semibold">{formatDate(invitation.weddingDate)}</span>
          </div>
          <div className="hidden sm:block text-[#c89b3f]/40">•</div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c89b3f]" />
            <span className="font-semibold">Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {/* Hero Photo / Couple Banner */}
        {invitation.heroImage && (
          <div className="w-full max-w-2xl mx-auto my-8 p-2 rounded-3xl border-2 border-[#c89b3f]/40 bg-[#171512] shadow-2xl shadow-[#c89b3f]/10 relative group">
            <div className="overflow-hidden rounded-2xl aspect-[16/10]">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        )}

        {/* Romantic Invitation Custom Text */}
        <div className="max-w-xl mx-auto my-4 px-4">
          <p className="text-base sm:text-lg leading-relaxed text-[#f7f2e7]/90 font-serif italic">
            "{invitation.customText}"
          </p>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="gold"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <CalendarExportButton
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            weddingDate={invitation.weddingDate}
            weddingTime={invitation.weddingTime}
            venue={invitation.venue}
            address={invitation.address}
            className="border-[#c89b3f]/40 text-[#c89b3f] hover:bg-[#c89b3f]/10"
          />
          <a
            href="#venue-section"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c89b3f]/40 text-xs font-sans uppercase tracking-wider text-[#f7f2e7] hover:bg-white/5 transition-all"
          >
            <Navigation className="w-4 h-4 text-[#c89b3f]" />
            <span>Məkan & Xəritə</span>
          </a>
        </div>
      </section>

      {/* Schedule / Timeline Section */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section" className="py-16 px-4 bg-[#14120f] border-y border-[#c89b3f]/20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] text-[#c89b3f] font-sans font-semibold">
                Mərasim Proqramı
              </span>
              <h2 className="text-3xl font-bold text-[#fbf8f1] mt-1 font-serif">
                Günün Cədvəli
              </h2>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-[#c89b3f]/30">
              {invitation.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center gap-6 ${
                    idx % 2 === 0 ? 'sm:flex-row-reverse text-left sm:text-right' : 'text-left'
                  }`}
                >
                  <div className="hidden sm:block w-1/2">
                    {idx % 2 === 0 ? (
                      <div>
                        <span className="text-sm font-sans font-bold text-[#c89b3f] block">
                          {item.time}
                        </span>
                        <h4 className="text-lg font-bold text-[#fbf8f1]">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-stone-400 mt-1">{item.description}</p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Center Dot */}
                  <div className="z-10 w-10 h-10 rounded-full border-2 border-[#c89b3f] bg-[#0f0e0c] flex items-center justify-center text-[#e6be65] font-sans text-xs font-bold shadow-lg flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#c89b3f]" />
                  </div>

                  <div className="w-full sm:w-1/2">
                    {idx % 2 !== 0 ? (
                      <div>
                        <span className="text-sm font-sans font-bold text-[#c89b3f] block">
                          {item.time}
                        </span>
                        <h4 className="text-lg font-bold text-[#fbf8f1]">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-stone-400 mt-1">{item.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="sm:hidden">
                        <span className="text-sm font-sans font-bold text-[#c89b3f] block">
                          {item.time}
                        </span>
                        <h4 className="text-lg font-bold text-[#fbf8f1]">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-stone-400 mt-1">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section (if available) */}
      {invitation.galleryImages && invitation.galleryImages.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#c89b3f] font-sans font-semibold">
                Xatirələr
              </span>
              <h2 className="text-3xl font-bold text-[#fbf8f1] mt-1">Foto Qalereya</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {invitation.galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-[#c89b3f]/30 aspect-square group shadow-lg"
                >
                  <img
                    src={img}
                    alt="Gallery"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue & Location Section */}
      <section id="venue-section" className="py-16 px-4 bg-[#14120f]/60">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full border border-[#c89b3f] bg-[#0f0e0c] flex items-center justify-center text-[#c89b3f] mx-auto mb-4 shadow-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#c89b3f] font-sans font-semibold">
            Mərasim Məkanı
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#fbf8f1] mt-1 mb-2 font-serif">
            {invitation.venue}
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-lg mx-auto mb-6">
            {invitation.address} {invitation.city ? `, ${invitation.city}` : ''}
          </p>

          {invitation.dressCode && (
            <div className="inline-block px-5 py-2 rounded-xl bg-[#1d1a15] border border-[#c89b3f]/30 text-xs text-[#e6be65] font-sans mb-8">
              <strong>Dress Code:</strong> {invitation.dressCode}
            </div>
          )}

          <div className="mb-8 rounded-2xl overflow-hidden border border-[#c89b3f]/30 shadow-xl shadow-black/30 aspect-[16/9] sm:aspect-[21/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full grayscale-[15%] contrast-[1.05] saturate-[0.9]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              id="google-maps-direction-btn"
              href={
                invitation.mapCoordinates?.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c89b3f] text-[#0f0e0c] text-xs font-sans font-bold hover:bg-[#e6be65] transition-all shadow-lg shadow-[#c89b3f]/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Xəritədə Bax & Naviqasiya</span>
            </a>

            <a
              id="waze-direction-btn"
              href={
                invitation.wazeUrl ||
                `https://waze.com/ul?q=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}&navigate=yes`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#33ccff]/50 text-[#33ccff] text-xs font-sans font-bold hover:bg-[#33ccff]/10 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Waze ilə Get</span>
            </a>

            {invitation.contactPhone && (
              <a
                href={`tel:${invitation.contactPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#c89b3f]/40 text-[#c89b3f] text-xs font-sans font-semibold hover:bg-[#c89b3f]/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Əlaqə: {invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp-section" className="py-20 px-4">
        <RSVPForm
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          contactPhone={invitation.contactPhone}
          weddingDate={invitation.weddingDate}
          theme="gold"
        />
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-[#c89b3f]/20 text-xs font-sans text-stone-500">
        <div className="max-w-md mx-auto space-y-3">
          <p className="font-serif text-sm text-[#e6be65]">
            {invitation.groomName} & {invitation.brideName}
          </p>
          <p>© {new Date().getFullYear()} Bütün hüquqlar qorunur. Rəqəmsal Toy Dəvətnaməsi Sistemi.</p>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QuickActionsDock
        venueId="venue-section"
        scheduleId="schedule-section"
        rsvpId="rsvp-section"
        showMusic={Boolean(invitation.music)}
        theme="dark"
      />

      {showQR && (
        <QRCodeModal
          url={currentUrl}
          title={`${invitation.groomName} & ${invitation.brideName} Dəvətnaməsi`}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};
