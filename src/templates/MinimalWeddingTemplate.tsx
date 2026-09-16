import React, { useState } from 'react';
import { TemplateRenderProps } from './types';
import { CountdownTimer } from '../components/public/CountdownTimer';
import { RSVPForm } from '../components/public/RSVPForm';
import { MusicPlayer } from '../components/public/MusicPlayer';
import { QRCodeModal } from '../components/public/QRCodeModal';
import { QuickActionsDock } from '../components/public/QuickActionsDock';
import { CalendarExportButton } from '../components/public/CalendarExportButton';
import { MapPin, Phone, QrCode, Navigation, Car } from 'lucide-react';

export const MinimalWeddingTemplate: React.FC<TemplateRenderProps> = ({
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
      id="minimal-template-root"
      className="min-h-screen bg-[#fcfbf9] text-stone-900 font-sans selection:bg-stone-200 selection:text-black overflow-x-hidden relative"
    >
 

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#fcfbf9] border-b border-stone-200/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-stone-600">
            {invitation.groomName} + {invitation.brideName}
          </span>

          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-minimal"
              onClick={() => setShowQR(true)}
              className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
              title="QR Kod"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <a
              href="#rsvp-section-minimal"
              className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="text-xs uppercase tracking-[0.3em] text-stone-400 font-medium mb-6">
          Evlilik Mərasimi
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-stone-950 mb-6 tracking-tight">
          {invitation.groomName} <span className="italic font-normal font-serif text-stone-400">&</span> {invitation.brideName}
        </h1>

        <div className="w-12 h-px bg-stone-300 my-4"></div>

        <p className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-8 font-medium">
          {formatDate(invitation.weddingDate)} — Saat {invitation.weddingTime}
        </p>

        {/* Hero Photo with clean borderless framing */}
        {invitation.heroImage && (
          <div className="w-full max-w-xl mx-auto my-6 overflow-hidden rounded-xl shadow-sm">
            <img
              src={invitation.heroImage}
              alt={`${invitation.groomName} & ${invitation.brideName}`}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        )}

        {/* Custom Text */}
        <div className="max-w-md mx-auto my-6 text-stone-600 text-base sm:text-lg leading-relaxed font-serif italic">
          "{invitation.customText}"
        </div>

        {/* Countdown */}
        <CountdownTimer
          weddingDate={invitation.weddingDate}
          weddingTime={invitation.weddingTime}
          theme="minimal"
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <CalendarExportButton
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            weddingDate={invitation.weddingDate}
            weddingTime={invitation.weddingTime}
            venue={invitation.venue}
            address={invitation.address}
            className="bg-white border-stone-300 text-stone-800 hover:bg-stone-100"
          />
        </div>
      </section>

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-minimal" className="py-16 px-6 border-t border-stone-200 bg-white">
          <div className="max-w-xl mx-auto">
            <h3 className="text-xs uppercase tracking-[0.25em] text-stone-400 font-medium text-center mb-8">
              Proqram
            </h3>
            <div className="divide-y divide-stone-100">
              {invitation.schedule.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">{item.title}</h4>
                    {item.description && <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>}
                  </div>
                  <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section id="venue-section-minimal" className="py-16 px-6 border-t border-stone-200">
        <div className="max-w-md mx-auto text-center">
          <MapPin className="w-5 h-5 mx-auto mb-2 text-stone-500" />
          <h3 className="text-2xl font-serif text-stone-900 mb-1">{invitation.venue}</h3>
          <p className="text-stone-500 text-xs sm:text-sm mb-6">{invitation.address}</p>

          <div className="mb-6 rounded-xl overflow-hidden border border-stone-200 aspect-[4/3] sm:aspect-[16/9]">
            <iframe
              title="Mərasim məkanının xəritəsi"
              src={`https://www.google.com/maps?q=${
                invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng
                  ? `${invitation.mapCoordinates.lat},${invitation.mapCoordinates.lng}`
                  : encodeURIComponent(`${invitation.venue} ${invitation.address}`)
              }&output=embed`}
              className="w-full h-full grayscale contrast-[1.05]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex justify-center gap-3">
            <a
              href={
                invitation.mapCoordinates?.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${invitation.venue} ${invitation.address}`
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Xəritə</span>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#33ccff]/60 text-[#1a9cc7] text-xs font-medium hover:bg-[#33ccff]/10 transition-colors"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Waze</span>
            </a>

            {invitation.contactPhone && (
              <a
                href={`tel:${invitation.contactPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-800 text-xs font-medium hover:bg-stone-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp-section-minimal" className="py-20 px-6 border-t border-stone-200 bg-stone-50">
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
      <footer className="py-8 text-center text-xs text-stone-400 border-t border-stone-200">
        <p>© {new Date().getFullYear()} {invitation.groomName} & {invitation.brideName}</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-minimal"
        scheduleId="schedule-section-minimal"
        rsvpId="rsvp-section-minimal"
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
