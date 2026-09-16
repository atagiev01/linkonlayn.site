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
  Leaf,
} from 'lucide-react';

export const BohoLinenTemplate: React.FC<TemplateRenderProps> = ({
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
      id="boho-linen-template-root"
      className="min-h-screen bg-[#f4ece0] text-[#4a3f35] font-sans selection:bg-[#c99a6c]/40 overflow-x-hidden relative"
    >
      {/* Subtle linen texture via dotted pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(#d8c3a5 0.6px, transparent 0.6px)',
          backgroundSize: '14px 14px',
        }}
      />



      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#f4ece0]/90 backdrop-blur-sm border-b border-[#d8c3a5] px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#7c8a5c]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#6b5a45] font-semibold">
              {invitation.groomName} & {invitation.brideName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-boho-linen"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c99a6c]/50 text-[#8a6a45] text-xs hover:bg-[#e9dcc7] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-boho-linen"
              className="px-5 py-1.5 rounded-full bg-[#a97c50] text-white text-xs font-semibold hover:bg-[#8f6842] transition-colors"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-10 h-px bg-[#c99a6c] mb-5" />
        <p className="text-xs uppercase tracking-[0.35em] text-[#8a6a45] mb-3 font-semibold">
          Bizim Toy Günümüz
        </p>

        {(invitation.brideParents || invitation.groomParents) && (
          <p className="text-xs text-[#7a6a58] tracking-wide max-w-md mx-auto mb-3">
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </p>
        )}

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#4a3f35] mb-4 tracking-tight">
          {invitation.groomName} <span className="italic text-[#a97c50]">&</span> {invitation.brideName}
        </h1>

        <div className="my-4 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-2xl bg-white/50 border border-[#d8c3a5] text-sm text-[#5a4c3d]">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-[#a97c50]" />
            <span>{formatDate(invitation.weddingDate)}</span>
          </div>
          <div className="hidden sm:block text-[#c9b696]">•</div>
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#a97c50]" />
            <span>Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {invitation.heroImage && (
          <div className="w-full max-w-xl mx-auto my-8 p-2 bg-white/60 border border-[#d8c3a5] shadow-lg shadow-[#d8c3a5]/40 group">
            <div className="overflow-hidden aspect-[4/3]">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover grayscale-[0.1] sepia-[0.08] group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto my-4 px-4">
          <p className="text-base sm:text-lg leading-relaxed text-[#5a4c3d] font-serif italic">
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
            className="bg-white/60 border-[#d8c3a5] text-[#6b5a45] hover:bg-[#e9dcc7]"
          />
        </div>
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-boho-linen" className="py-16 px-4 border-y border-[#d8c3a5] bg-white/40">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8a6a45] font-semibold">
                Proqram
              </span>
              <h2 className="text-3xl font-serif text-[#4a3f35] mt-1">Günün Axarı</h2>
            </div>
            <div className="divide-y divide-[#d8c3a5]">
              {invitation.schedule.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-serif font-semibold text-[#4a3f35]">{item.title}</h4>
                    {item.description && <p className="text-xs text-[#8a7860] mt-0.5">{item.description}</p>}
                  </div>
                  <span className="text-xs font-mono font-medium text-[#8a6a45] bg-[#e9dcc7] px-2.5 py-1 rounded-full flex-shrink-0">
                    {item.time}
                  </span>
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#8a6a45] font-semibold">
                Qalereya
              </span>
              <h2 className="text-3xl font-serif text-[#4a3f35] mt-1">Xatirələrimiz</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitation.galleryImages.map((img, idx) => (
                <div key={idx} className="overflow-hidden aspect-square border border-[#d8c3a5] p-1 bg-white/50">
                  <img
                    src={img}
                    alt="Boho wedding moment"
                    className="w-full h-full object-cover grayscale-[0.1] sepia-[0.08] hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-boho-linen" className="py-16 px-4 border-t border-[#d8c3a5] bg-white/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#e9dcc7] border border-[#d8c3a5] flex items-center justify-center text-[#8a6a45] mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8a6a45] font-semibold">
            Məkan
          </span>
          <h2 className="text-3xl font-serif text-[#4a3f35] mt-1 mb-2">{invitation.venue}</h2>
          <p className="text-[#7a6a58] text-sm max-w-md mx-auto mb-6">{invitation.address}</p>

          <div className="mb-6 rounded-lg overflow-hidden border border-[#d8c3a5] aspect-[16/9] sm:aspect-[21/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full sepia-[0.15]"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#a97c50] text-white text-xs font-semibold hover:bg-[#8f6842] transition-all"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#d8c3a5] text-[#6b5a45] text-xs font-semibold hover:bg-[#e9dcc7] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp-section-boho-linen" className="py-20 px-4">
        <RSVPForm
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          contactPhone={invitation.contactPhone}
          weddingDate={invitation.weddingDate}
          theme="minimal"
        />
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-[#d8c3a5] text-xs text-[#8a7860]">
        <p className="font-serif text-sm text-[#4a3f35] mb-1">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-boho-linen"
        scheduleId="schedule-section-boho-linen"
        rsvpId="rsvp-section-boho-linen"
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
