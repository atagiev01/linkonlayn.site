import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TemplateRenderProps } from './types';
import { CountdownTimer } from '../components/public/CountdownTimer';
import { RSVPForm } from '../components/public/RSVPForm';
import { MusicPlayer } from '../components/public/MusicPlayer';
import { QRCodeModal } from '../components/public/QRCodeModal';
import { QuickActionsDock } from '../components/public/QuickActionsDock';
import { CalendarExportButton } from '../components/public/CalendarExportButton';
import {
  Phone,
  QrCode,
  Navigation,
  Car,
  MessageCircle,
  Flower,
} from 'lucide-react';

// ---- Palette -----------------------------------------------------------
const MAROON = '#6b1027';
const MAROON_DARK = '#3f0a18';
const CREAM = '#f7f1e6';

// ---- Torn paper divider (procedurally generated jagged edge) -----------
function buildTornPath(segments = 22, width = 1440, height = 40): string {
  const step = width / segments;
  let d = `M0,${(height * 0.4).toFixed(1)} `;
  for (let i = 1; i <= segments; i++) {
    const x = (i * step).toFixed(1);
    const y = (i % 2 === 0 ? height * 0.12 : height * 0.62).toFixed(1);
    d += `L${x},${y} `;
  }
  d += `L${width},${height} L0,${height} Z`;
  return d;
}
const TORN_PATH = buildTornPath();

const TornEdge: React.FC<{ fill: string; flip?: boolean }> = ({ fill, flip }) => (
  <div
    aria-hidden="true"
    className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}
    style={{ height: '30px' }}
  >
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full block">
      <path d={TORN_PATH} fill={fill} />
    </svg>
  </div>
);

// ---- Simple procedurally-drawn peony cluster ----------------------------
const Peony: React.FC<{ cx: number; cy: number; scale?: number; tone: 'red' | 'white' }> = ({
  cx,
  cy,
  scale = 1,
  tone,
}) => {
  const petals =
    tone === 'red'
      ? ['#7a1f34', '#8f2942', '#a83552', '#c24a68']
      : ['#efe6da', '#f7f1e6', '#fffaf3', '#fffaf3'];
  const angles = [0, 55, 110, 165, 220, 275, 330];
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const ex = Math.cos(rad) * 9;
        const ey = Math.sin(rad) * 9;
        return (
          <ellipse
            key={angle}
            cx={ex}
            cy={ey}
            rx="12"
            ry="8"
            transform={`rotate(${angle} ${ex} ${ey})`}
            fill={petals[i % petals.length]}
            opacity={0.94}
          />
        );
      })}
      <circle r="6.5" fill={tone === 'red' ? '#5c1526' : '#fdf6ea'} />
    </g>
  );
};

const PeonyCluster: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 320 90" className={className} aria-hidden="true">
    <Peony cx={38} cy={58} scale={1.55} tone="red" />
    <Peony cx={84} cy={34} scale={1.05} tone="white" />
    <Peony cx={128} cy={60} scale={1.6} tone="red" />
    <Peony cx={174} cy={30} scale={1.0} tone="white" />
    <Peony cx={220} cy={58} scale={1.55} tone="red" />
    <Peony cx={266} cy={38} scale={1.15} tone="white" />
    <Peony cx={296} cy={60} scale={1.1} tone="red" />
  </svg>
);

// ---- Scroll-reveal wrapper ----------------------------------------------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const CrimsonPetalsTemplate: React.FC<TemplateRenderProps> = ({
  invitation,
  template,
  isGuestMode = true,
}) => {
  const [showQR, setShowQR] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const whatsappHref = (() => {
    const raw = invitation.contactPhone || '';
    const digits = raw.replace(/\D/g, '');
    const phone = digits.startsWith('994') ? digits : digits.length === 9 ? `994${digits}` : digits || '994501234567';
    const msg = encodeURIComponent(
      `Salam! ${invitation.groomName} & ${invitation.brideName}-in toyu haqqında sualım var.`
    );
    return `https://wa.me/${phone}?text=${msg}`;
  })();

  return (
    <div
      id="crimson-petals-template-root"
      className="min-h-screen text-[#f7ece9] font-sans overflow-x-hidden"
      style={{ backgroundColor: MAROON }}
    >
      {invitation.music && (
        <MusicPlayer
          musicUrl={invitation.music}
          musicTitle={invitation.musicTitle || `${invitation.brideName} & ${invitation.groomName}`}
          theme="floral"
        />
      )}

      {/* Sticky nav */}
      <header
        className="sticky top-0 z-30 w-full backdrop-blur-md border-b border-[#f7ece9]/15 px-5 py-4"
        style={{ backgroundColor: `${MAROON}e6` }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-[#f2d9d1] font-semibold">
            {invitation.groomName} & {invitation.brideName}
          </span>
          <div className="flex items-center gap-3">
            <button
              id="top-qr-btn-crimson-petals"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#f7ece9]/30 text-[#f2d9d1] text-xs hover:bg-white/10 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kod</span>
            </button>
            <a
              href="#rsvp-section-crimson-petals"
              className="px-5 py-1.5 rounded-full bg-[#f7ece9] text-[#6b1027] text-xs font-bold hover:bg-white transition-colors"
            >
              RSVP
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
        style={
          invitation.heroImage
            ? {
                backgroundImage: `linear-gradient(to bottom, ${MAROON_DARK}55, ${MAROON}cc 65%, ${MAROON} 100%), url(${invitation.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: `radial-gradient(circle at 50% 30%, ${MAROON}, ${MAROON_DARK})` }
        }
      >
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl mb-3 text-[#f7ece9]"
          style={{ fontFamily: 'Great Vibes, cursive' }}
        >
          Wedding Day
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base tracking-[0.3em] text-[#f2d9d1] mb-8"
        >
          {formatDate(invitation.weddingDate)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl leading-[1.05] mb-4"
        >
          {invitation.groomName}
          <span className="block text-2xl sm:text-3xl my-2 opacity-70">&</span>
          {invitation.brideName}
        </motion.h1>

        {(invitation.brideParents || invitation.groomParents) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs text-[#f2d9d1]/80 tracking-wide max-w-md mx-auto mb-2"
          >
            {[invitation.groomParents, invitation.brideParents].filter(Boolean).join(' və ')}
          </motion.p>
        )}

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full max-w-md mt-6"
        >
          <PeonyCluster className="w-full h-auto drop-shadow-xl" />
        </motion.div>
      </section>

      {/* Quote */}
      <section className="px-6 py-16 sm:py-20 text-center">
        <Reveal>
          <p className="font-serif text-2xl sm:text-3xl mb-6" style={{ fontFamily: 'Great Vibes, cursive' }}>
            Dear Friends and Family,
          </p>
          <p className="max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-[#f2d9d1] italic">
            "{invitation.customText}"
          </p>
        </Reveal>
      </section>

      <TornEdge fill={CREAM} />

      {/* Countdown */}
      <section className="px-6 py-16 sm:py-20 text-center" style={{ backgroundColor: CREAM, color: '#3f2530' }}>
        <Reveal>
          <p className="font-serif text-2xl sm:text-3xl mb-2" style={{ fontFamily: 'Great Vibes, cursive' }}>
            The Celebration Begins In
          </p>
          <CountdownTimer weddingDate={invitation.weddingDate} weddingTime={invitation.weddingTime} theme="minimal" />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <CalendarExportButton
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              weddingDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              venue={invitation.venue}
              address={invitation.address}
              className="bg-white border-[#e3d4c8] text-[#6b1027] hover:bg-[#f3e7dd]"
            />
          </div>
        </Reveal>
      </section>

      <TornEdge fill={MAROON} flip />

      {/* Schedule */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section id="schedule-section-crimson-petals" className="px-6 py-16 sm:py-20">
          <Reveal className="text-center mb-12">
            <p className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: 'Great Vibes, cursive' }}>
              Schedule of Events
            </p>
          </Reveal>

          <div className="max-w-md mx-auto relative">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
              className="absolute left-[74px] top-2 bottom-2 w-px bg-[#f7ece9]/40"
            />
            <div className="space-y-10">
              {invitation.schedule.map((item, idx) => {
                const isLast = idx === invitation.schedule!.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    className="flex items-center gap-6 relative"
                  >
                    <span className="w-16 text-right font-serif text-lg flex-shrink-0">{item.time}</span>
                    {isLast ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f7ece9] flex items-center justify-center flex-shrink-0 relative z-10">
                        <Flower className="w-6 h-6 text-[#f7ece9] absolute" />
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f7ece9] flex-shrink-0 relative z-10" />
                    )}
                    <div>
                      <h4 className="font-serif text-lg">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-[#f2d9d1]/70 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TornEdge fill={CREAM} />

      {/* Gallery + Location */}
      <section id="venue-section-crimson-petals" className="px-6 py-16 sm:py-20" style={{ backgroundColor: CREAM, color: '#3f2530' }}>
        {invitation.galleryImages && invitation.galleryImages.length > 0 && (
          <Reveal className="max-w-4xl mx-auto mb-16 text-center">
            <p className="font-serif text-2xl sm:text-3xl mb-8" style={{ fontFamily: 'Great Vibes, cursive' }}>
              Our Moments
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {invitation.galleryImages.map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden aspect-square border border-[#e3d4c8]">
                  <img src={img} alt="Anımız" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="max-w-xl mx-auto text-center">
          <p className="font-serif text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Great Vibes, cursive' }}>
            Location
          </p>
          <h3 className="text-xl font-serif mb-1">{invitation.venue}</h3>
          <p className="text-sm text-[#6a5449] mb-8">{invitation.address}</p>

          {/* Simple line-art chateau flourish */}
          <svg viewBox="0 0 200 70" className="w-40 h-auto mx-auto mb-8 opacity-70" aria-hidden="true">
            <g fill="none" stroke="#6b1027" strokeWidth="1">
              <rect x="20" y="30" width="160" height="35" />
              <polygon points="90,10 110,30 70,30" />
              <rect x="45" y="40" width="10" height="15" />
              <rect x="65" y="40" width="10" height="15" />
              <rect x="95" y="40" width="10" height="15" />
              <rect x="125" y="40" width="10" height="15" />
              <rect x="145" y="40" width="10" height="15" />
              <line x1="20" y1="65" x2="180" y2="65" />
            </g>
          </svg>

          <div className="mb-6 rounded-xl overflow-hidden border border-[#e3d4c8] aspect-[16/9]">
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
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${invitation.venue} ${invitation.address}`)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: MAROON }}
            >
              <Navigation className="w-4 h-4" />
              <span>Xəritədə Aç</span>
            </a>
            <a
              href={invitation.wazeUrl || `https://waze.com/ul?q=${encodeURIComponent(`${invitation.venue} ${invitation.address}`)}&navigate=yes`}
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#e3d4c8] text-[#6b1027] text-xs font-semibold hover:bg-[#f3e7dd] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{invitation.contactPhone}</span>
              </a>
            )}
          </div>
        </Reveal>
      </section>

      <TornEdge fill={MAROON} flip />

      {/* Details + RSVP */}
      <section className="px-6 py-16 sm:py-20 text-center" id="rsvp-section-crimson-petals">
        <Reveal>
          <p className="font-serif text-2xl sm:text-3xl mb-6" style={{ fontFamily: 'Great Vibes, cursive' }}>
            Details
          </p>
          <p className="max-w-md mx-auto text-sm text-[#f2d9d1] mb-4 leading-relaxed">
            Sualınız varsa, aşağıdakı düymədən birbaşa bizimlə WhatsApp üzərindən əlaqə saxlaya bilərsiniz.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-4"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp ilə Yazın</span>
          </a>
          {invitation.contactPhone && (
            <p className="text-xs text-[#f2d9d1]/70 mb-10">{invitation.contactPhone}</p>
          )}

          <PeonyCluster className="w-64 h-auto mx-auto mb-10 opacity-90" />

          <p className="font-serif text-2xl sm:text-3xl mb-2" style={{ fontFamily: 'Great Vibes, cursive' }}>
            Confirm Your Attendance
          </p>
          <p className="max-w-md mx-auto text-sm text-[#f2d9d1] mb-8 leading-relaxed">
            Şənliyə hazırlaşmağımıza kömək etmək üçün, zəhmət olmasa iştirakınızı təsdiqləyin.
          </p>

          <RSVPForm
            invitationId={invitation.id}
            invitationSlug={invitation.slug}
            brideName={invitation.brideName}
            groomName={invitation.groomName}
            contactPhone={invitation.contactPhone}
            weddingDate={invitation.weddingDate}
            theme="minimal"
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-16">
          <p className="font-serif text-2xl sm:text-3xl mb-2" style={{ fontFamily: 'Great Vibes, cursive' }}>
            Hope to see you there!
          </p>
          <p className="text-base font-serif">
            {invitation.groomName} & {invitation.brideName}
          </p>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-[#f7ece9]/15 text-xs text-[#f2d9d1]/60">
        <p>© {new Date().getFullYear()} Rəqəmsal Toy Dəvətnaməsi</p>
      </footer>

      <QuickActionsDock
        venueId="venue-section-crimson-petals"
        scheduleId="schedule-section-crimson-petals"
        rsvpId="rsvp-section-crimson-petals"
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
