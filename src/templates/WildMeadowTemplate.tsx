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
  Phone,
  QrCode,
  Navigation,
  Car,
  Flower,
} from 'lucide-react';

export const WildMeadowTemplate: React.FC<TemplateRenderProps> = ({
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
      id="wild-meadow-template-root"
      className="min-h-screen bg-[#f6f2e7] text-[#3f4a34] font-sans selection:bg-[#a7b789]/40 overflow-x-hidden relative"
    >


      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#f6f2e7]/90 backdrop-blur-sm border-b border-[#d9cfae] px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flower className="w-4 h-4 text-[#8a9a5b]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#5a6a45] font-semibold">
              {invitation.groomName} & {invitation.brideName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-wild-meadow"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#b7a76a]/50 text-[#7a6a35] text-xs hover:bg-[#ece3c8] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-wild-meadow"
              className="px-5 py-1.5 rounded-full bg-[#7c8a4f] text-white text-xs font-semibold hover:bg-[#697742] transition-colors"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="flex items-center gap-2 mb-5 text-[#8a9a5b]">
          <Flower className="w-4 h-4" />
          <Flower className="w-5 h-5" />
          <Flower className="w-4 h-4" />
        </div>

        {(invitation.brideParents || invitation.groomParents) && (
          <p className="text-xs text-[#6a6a52] tracking-wide max-w-md mx-auto mb-3">
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </p>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-[#8a9a5b] mb-3 font-semibold">
          Çöl Çiçəkləri Arasında Bir Sevgi
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#3f4a34] mb-4">
          {invitation.groomName} <span className="italic text-[#a68b3f]">&</span> {invitation.brideName}
        </h1>

        <div className="my-4 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-full bg-white/60 border border-[#d9cfae] text-sm text-[#4d5940]">
          <span className="font-medium">{formatDate(invitation.weddingDate)}</span>
          <div className="hidden sm:block text-[#c3b98d]">•</div>
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#8a9a5b]" />
            <span>Saat {invitation.weddingTime}</span>
          </div>
        </div>

        {invitation.heroImage && (
          <div className="w-full max-w-xl mx-auto my-8 relative">
            <div className="absolute -inset-2 border border-[#b7a76a]/50 rounded-full scale-x-105 scale-y-110 -z-10 hidden sm:block" />
            <div className="overflow-hidden rounded-[3rem] aspect-[4/3] shadow-lg shadow-[#d9cfae]/50 group">
              <img
                src={invitation.heroImage}
                alt={`${invitation.groomName} & ${invitation.brideName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto my-4 px-4">
          <p className="text-base sm:text-lg leading-relaxed text-[#5a6650] font-serif italic">
            "{invitation.customText}"
          </p>
        </div>

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
            className="bg-white/60 border-[#d9cfae] text-[#5a6a45] hover:bg-[#ece3c8]"
          />
        </div>
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-wild-meadow" className="py-16 px-4 border-y border-[#d9cfae] bg-white/40">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8a9a5b] font-semibold">
                Proqram
              </span>
              <h2 className="text-3xl font-serif text-[#3f4a34] mt-1">Günün Axarı</h2>
            </div>
            <div className="space-y-4">
              {invitation.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#ece3c8]/60 border border-[#d9cfae]"
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-[#b7a76a]/40 flex flex-col items-center justify-center text-[#7a6a35] font-bold text-xs flex-shrink-0">
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#3f4a34]">{item.title}</h4>
                    {item.description && <p className="text-xs text-[#6a6a52] mt-0.5">{item.description}</p>}
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#8a9a5b] font-semibold">
                Qalereya
              </span>
              <h2 className="text-3xl font-serif text-[#3f4a34] mt-1">Anlarımız</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitation.galleryImages.map((img, idx) => (
                <div key={idx} className="rounded-[2rem] overflow-hidden aspect-square border border-[#d9cfae] shadow-sm">
                  <img src={img} alt="Wild meadow wedding moment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-wild-meadow" className="py-16 px-4 border-t border-[#d9cfae] bg-white/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#ece3c8] border border-[#d9cfae] flex items-center justify-center text-[#7a6a35] mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8a9a5b] font-semibold">
            Məkan
          </span>
          <h2 className="text-3xl font-serif text-[#3f4a34] mt-1 mb-2">{invitation.venue}</h2>
          <p className="text-[#6a6a52] text-sm max-w-md mx-auto mb-6">{invitation.address}</p>

          <div className="mb-6 rounded-[2.5rem] overflow-hidden border border-[#d9cfae] aspect-[16/9] sm:aspect-[21/9]">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7c8a4f] text-white text-xs font-semibold hover:bg-[#697742] transition-all"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#d9cfae] text-[#5a6a45] text-xs font-semibold hover:bg-[#ece3c8] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp-section-wild-meadow" className="py-20 px-4">
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
      <footer className="py-10 px-4 text-center border-t border-[#d9cfae] text-xs text-[#8a8a70]">
        <p className="font-serif text-sm text-[#3f4a34] mb-1">
          {invitation.groomName} & {invitation.brideName}
        </p>
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-wild-meadow"
        scheduleId="schedule-section-wild-meadow"
        rsvpId="rsvp-section-wild-meadow"
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
