import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TemplateRenderProps } from './types';
import {
  VolumeX,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Send,
  Share2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  CalendarPlus,
  Users,
  Navigation,
  Car,
  ArrowLeft,
} from 'lucide-react';

const TOP_RIGHT_FLORAL = '/golden-envelope/top-right-flowers.webp';
const BOTTOM_LEFT_FLORAL = '/golden-envelope/bottom-left-flowers.webp';
const FLORAL_HEADER = '/golden-envelope/floral-header.webp';
const DEFAULT_MUSIC_TRACK = '/wedding-music.mp3';

function getCleanPhone(phone?: string): string {
  if (!phone) return '994501234567';
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.startsWith('994')) return digitsOnly;
  if (digitsOnly.startsWith('0')) return '994' + digitsOnly.slice(1);
  return digitsOnly || '994501234567';
}

function formatAzDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Isolated so its once-a-second tick only re-renders these four digits, not
// the whole template (which previously caused the floating decorations to
// visibly "jump"/restart every second because their parent kept re-rendering).
const CountdownDisplay: React.FC<{ weddingDateISO: string }> = ({ weddingDateISO }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(weddingDateISO).getTime();
    const update = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [weddingDateISO]);

  return (
    <div className="grid grid-cols-4 gap-2 bg-[#3D2E20]/90 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/40 shadow-inner text-center">
      {[
        { v: timeLeft.days, l: 'Gün' },
        { v: timeLeft.hours, l: 'Saat' },
        { v: timeLeft.minutes, l: 'Dəqiqə' },
        { v: timeLeft.seconds, l: 'Saniyə', pulse: true },
      ].map((t, i) => (
        <div key={t.l} className={i < 3 ? 'border-r border-[#D4AF37]/20 pr-1' : ''}>
          <span className={`font-serif text-3xl sm:text-4xl font-light block ${t.pulse ? 'text-[#FFD700] animate-pulse' : 'text-[#FFF8E7]'}`}>
            {String(t.v).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#C5A059] mt-1 block">{t.l}</span>
        </div>
      ))}
    </div>
  );
};

export const GoldenEnvelopeTemplate: React.FC<TemplateRenderProps> = ({
  invitation,
  onOpenRSVP,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [guestNote, setGuestNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const groomName = invitation.groomName || 'Bəy';
  const brideName = invitation.brideName || 'Gəlin';
  const initials = `${groomName.charAt(0)} & ${brideName.charAt(0)}`;
  const weddingDateISO = `${invitation.weddingDate}T${invitation.weddingTime || '18:00'}:00`;
  const weddingDateFormatted = formatAzDate(invitation.weddingDate);
  const phoneToUse = getCleanPhone(invitation.contactPhone);
  const mapUrl =
    invitation.mapCoordinates?.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${invitation.venue} ${invitation.address}`)}`;
  const wazeUrl =
    invitation.wazeUrl ||
    `https://waze.com/ul?q=${encodeURIComponent(`${invitation.venue} ${invitation.address}`)}&navigate=yes`;

  // Two simple, reliable music modes for this invitation — both play through
  // one real <audio> element (no synthesized/procedural sound, which was
  // too quiet/unreliable across browsers):
  //  1. musicEnabled === false -> music turned off entirely (no button, no audio)
  //  2. musicEnabled !== false -> plays the admin's custom track if one is set,
  //     otherwise falls back to the bundled default wedding music file.
  // (musicEnabled defaults to true for older invitations saved before this field existed.)
  const isMusicModeOn = invitation.musicEnabled !== false;
  const musicSrc = isMusicModeOn
    ? (invitation.music && invitation.music.trim().length > 0 ? invitation.music.trim() : DEFAULT_MUSIC_TRACK)
    : null;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpen = () => {
    setIsOpening(true);
    if (musicSrc) {
      audioRef.current
        ?.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {
          // Autoplay blocked by the browser; guest can start it via the Musiqi button
        });
    }
    setTimeout(() => {
      setIsOpened(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  const handleToggleMusic = () => {
    const audio = audioRef.current;
    if (!musicSrc || !audio) return;
    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      showToast('🔇 Musiqi dayandırıldı');
    } else {
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          showToast('🎵 Musiqi qoşuldu');
        })
        .catch(() => {});
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const statusText = rsvpAttending ? 'İştirak Edəcək' : 'Gələ Bilməyəcək';
    const message = `Salam! Mən ${guestName}. Toyunuzda ${statusText} (${guestCount} nəfər). ${guestNote ? 'Qeyd: ' + guestNote : ''}`;
    window.open(`https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`, '_blank');
    setShowRsvpModal(false);
    showToast('✅ Cavabınız WhatsApp vasitəsilə ötürüldü!');
    onOpenRSVP?.();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Dəvətnamə linki kopyalandı!');
  };

  const handleAddToCalendar = () => {
    const title = `${groomName} və ${brideName} — Toy Mərasimi`;
    const description = invitation.customText || 'Toy mərasimimizdə sizinlə birgə olmaqdan şad olarıq.';
    const location = `${invitation.venue}, ${invitation.address}`;
    const startDate = new Date(weddingDateISO);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const startF = fmt(startDate);
    const endF = fmt(endDate);

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//AZ',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startF}`,
      `DTEND:${endF}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${groomName}_${brideName}_Toy.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startF}/${endF}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(gcalUrl, '_blank');
    showToast('📅 Toy günü təqviminizə əlavə olundu!');
  };

  const RibbonArt = ({ viewBoxH = 200 }: { viewBoxH?: number }) => (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 text-[#D4AF37] overflow-visible"
      viewBox={`0 0 400 ${viewBoxH}`}
      fill="none"
    >
      <motion.path
        d="M 30,100 C 10,30 140,10 220,70 C 300,130 380,50 350,130 C 320,200 160,220 80,180 C 0,130 80,50 180,30 C 280,10 370,100 340,180"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.98, 1.02, 0.98], rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.path
        d="M 80,25 C 220,-10 360,60 320,140 C 280,210 120,230 50,160 C -20,90 80,15 200,30"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="1"
        strokeDasharray="5 5"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
    </svg>
  );

  const FloralCorners = () => (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <motion.div
        initial={false}
        animate={{ y: [0, -6, 2, -4, 0], x: [0, 4, -3, 2, 0], rotate: [0, 2, -1.5, 1, 0], scale: [1, 1.015, 0.995, 1.01, 1] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute -top-6 -right-6 w-72 sm:w-96 md:w-[440px] opacity-95 origin-top-right"
      >
        <img src={TOP_RIGHT_FLORAL} alt="" loading="eager" className="w-full h-auto object-contain" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: [0, 5, -3, 3, 0], x: [0, -4, 3, -2, 0], rotate: [0, -2, 1.5, -1, 0], scale: [1, 1.01, 0.995, 1.015, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute -bottom-6 -left-6 w-72 sm:w-96 md:w-[440px] opacity-95 origin-bottom-left"
      >
        <img src={BOTTOM_LEFT_FLORAL} alt="" loading="eager" className="w-full h-auto object-contain" />
      </motion.div>
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">
        <polygon points="0,0 200,0 350,500 200,1000 0,1000" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
        <polygon points="1000,0 800,0 650,500 800,1000 1000,1000" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
        <line x1="220" y1="0" x2="370" y2="500" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="6 4" />
        <line x1="370" y1="500" x2="220" y2="1000" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="6 4" />
        <line x1="780" y1="0" x2="630" y2="500" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="6 4" />
        <line x1="630" y1="500" x2="780" y2="1000" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="6 4" />
      </svg>
    </div>
  );

  return (
    <div id="golden-envelope-template-root" className="relative">
      {/* Mounted at the root, outside the open/closed view swap, so the ref
          is already attached to a real <audio> element the moment the guest
          taps the envelope — otherwise handleOpen's play() call fires before
          this element exists and silently does nothing. */}
      {musicSrc && (
        <audio
          ref={audioRef}
          src={musicSrc}
          loop
          preload="auto"
          onError={() => setIsMusicPlaying(false)}
        />
      )}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          // ── ENTRANCE / ENVELOPE COVER ──
          <motion.div
            key="entrance-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <div className="relative min-h-screen w-full bg-[#FAF7F2] text-[#3A2E1E] flex flex-col justify-between items-center overflow-hidden font-sans select-none">
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                  initial={false}
                  animate={{ y: [0, -6, 2, -4, 0], x: [0, 4, -3, 2, 0], rotate: [0, 2, -1.5, 1, 0], scale: [1, 1.015, 0.995, 1.01, 1] }}
                  transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 w-72 sm:w-96 md:w-[440px] pointer-events-none z-10 opacity-95 origin-top-right"
                >
                  <img src={TOP_RIGHT_FLORAL} alt="" loading="eager" className="w-full h-auto object-contain" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ y: [0, 6, -3, 4, 0], x: [0, -4, 3, -2, 0], rotate: [0, -2, 1.5, -1, 0], scale: [1, 1.01, 0.995, 1.015, 1] }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 w-72 sm:w-96 md:w-[440px] pointer-events-none z-10 opacity-95 origin-bottom-left"
                >
                  <img src={BOTTOM_LEFT_FLORAL} alt="" loading="eager" className="w-full h-auto object-contain" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#F3E5C8]/30 blur-3xl pointer-events-none" />
              </div>

              <header className="relative z-30 w-full max-w-2xl px-6 pt-6 flex items-center justify-between">
                <span className="font-serif text-xs font-semibold tracking-[0.2em] text-[#C5A059] uppercase">{initials}</span>
                {isMusicModeOn && (
                  <button
                    onClick={handleToggleMusic}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-sm hover:border-[#C5A059] transition-all text-[#5A4325]"
                    title={isMusicPlaying ? 'Musiqini saxla' : 'Musiqini qoş'}
                  >
                    {isMusicPlaying ? (
                      <>
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className="w-0.5 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                          <span className="w-0.5 h-3.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                          <span className="w-0.5 h-2.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C5A059]">Musiqi</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#9A8870]" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9A8870]">Səs</span>
                      </>
                    )}
                  </button>
                )}
              </header>

              <main className="relative z-20 my-auto w-full max-w-md px-6 py-4 flex flex-col items-center text-center">
                <motion.div
                  animate={isOpening ? { scale: 1.06, opacity: 0, y: -14 } : { scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-[#C5A059] uppercase mb-3"
                  >
                    EVLƏNİRİK
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative mb-6 py-2 px-6 flex flex-col items-center justify-center"
                  >
                    <RibbonArt />
                    <h1 className="relative z-10 font-serif text-5xl sm:text-6xl font-light text-[#4A3822] tracking-widest uppercase leading-tight">
                      {groomName}
                    </h1>
                    <p className="relative z-10 italic font-serif text-3xl sm:text-4xl text-[#C5A059] my-0 font-normal">və</p>
                    <h1 className="relative z-10 font-serif text-5xl sm:text-6xl font-light text-[#4A3822] tracking-widest uppercase leading-tight">
                      {brideName}
                    </h1>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative w-full max-w-[320px] mx-auto my-4 group cursor-pointer"
                    onClick={handleOpen}
                  >
                    <div className="relative rounded-2xl bg-gradient-to-b from-white via-[#FCFAF7] to-[#F7F2EA] border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(197,160,89,0.2)] p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:border-[#C5A059] group-hover:shadow-[0_25px_60px_rgba(197,160,89,0.35)]">
                      <svg className="w-full h-16 mb-2 opacity-40 text-[#D4AF37]" viewBox="0 0 200 60" fill="none">
                        <path d="M0 0 L100 50 L200 0" stroke="currentColor" strokeWidth="1" />
                        <path d="M0 5 L100 53 L200 5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" />
                      </svg>
                      <div className="relative my-2">
                        <div className="absolute -inset-2 rounded-full bg-[#D4AF37]/25 animate-ping pointer-events-none" />
                        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#D4AF37]/30 to-[#B8944A]/20 blur-md group-hover:scale-110 transition-transform duration-300" />
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#E6C675] via-[#C5A059] to-[#9E7A33] p-0.5 shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B8944A] to-[#8A6A29] border-2 border-[#FFF0C2]/60 flex flex-col items-center justify-center text-white shadow-inner">
                            <span className="font-serif text-lg font-bold tracking-widest text-[#FFF8E7] drop-shadow-sm">{initials}</span>
                            <Heart className="w-3 h-3 text-[#FFF8E7] fill-[#FFF8E7] mt-0.5 opacity-90" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-xs font-bold tracking-[0.2em] text-[#4A3822] uppercase block">DƏVƏTNAMƏNİ AÇ</span>
                        <span className="text-[10px] text-[#A6823B] tracking-wider block mt-1">Möhürə toxunun</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-4">
                    <p className="text-xs font-medium tracking-[0.2em] text-[#8C785D] uppercase">
                      {weddingDateFormatted} • {invitation.venue}
                    </p>
                  </motion.div>
                </motion.div>
              </main>

              <footer className="relative z-20 w-full py-5 text-center text-[10px] uppercase tracking-[0.25em] text-[#C5A059]/80">
                {groomName} & {brideName} — {weddingDateFormatted}
              </footer>
            </div>
          </motion.div>
        ) : (
          // ── FULL INVITATION ──
          <motion.div
            key="wedding-invitation-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen bg-[#FAF7F2] text-[#3A2E1E] font-sans relative overflow-x-hidden selection:bg-[#C5A059] selection:text-white">
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3A2E1E] text-[#FAF7F2] px-5 py-2.5 rounded-full text-xs font-medium shadow-2xl border border-[#C5A059]/50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="fixed top-4 left-4 z-50">
                <button
                  onClick={() => setIsOpened(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 border border-[#D4AF37]/40 shadow-md text-[#5A4325] text-xs font-medium hover:border-[#C5A059] transition-all hover:scale-105"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Geri</span>
                </button>
              </div>

              <div className="min-h-screen w-full relative bg-[#FAF7F2] text-[#3A2E1E] overflow-x-hidden">
                <FloralCorners />

                <div className="relative z-10 max-w-[500px] mx-auto min-h-screen px-4 pt-16 pb-28 flex flex-col items-center">
                  {/* HERO */}
                  <section className="w-full flex flex-col items-center text-center py-6 mb-4">
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-xs sm:text-sm font-semibold tracking-[0.45em] text-[#C5A059] uppercase mb-5"
                    >
                      E V L Ə N İ R İ K
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="relative flex flex-col items-center justify-center my-1 py-4 px-8"
                    >
                      <RibbonArt viewBoxH={240} />
                      <h1 className="relative z-10 font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#3A2E1E] tracking-[0.2em] uppercase leading-tight">
                        {groomName}
                      </h1>
                      <span className="relative z-10 italic font-serif text-3xl sm:text-4xl text-[#C5A059] my-0.5 font-normal">və</span>
                      <h1 className="relative z-10 font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#3A2E1E] tracking-[0.2em] uppercase leading-tight">
                        {brideName}
                      </h1>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#8C785D] uppercase mt-4 mb-3"
                    >
                      {weddingDateFormatted} • {invitation.venue}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="mt-2 cursor-pointer"
                      onClick={() => scrollToSection(invitation.heroImage ? 'photo-section' : 'countdown-section')}
                    >
                      <ChevronDown className="w-5 h-5 text-[#C5A059] animate-bounce mx-auto" />
                    </motion.div>
                  </section>

                  {/* COUPLE PHOTO */}
                  {invitation.heroImage && (
                    <section id="photo-section" className="w-full flex justify-center mb-10">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        className="relative rounded-3xl overflow-hidden bg-white p-2 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.18)] max-w-sm w-full group"
                      >
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
                          <img
                            src={invitation.heroImage}
                            alt={`${groomName} və ${brideName}`}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D10]/55 via-transparent to-transparent" />
                          <div className="absolute bottom-5 left-4 right-4 text-center text-white">
                            <p className="italic font-serif text-4xl text-[#FFF8E7] drop-shadow-lg">
                              {groomName} & {brideName}
                            </p>
                            <p className="text-[10px] tracking-[0.2em] text-[#E6C675] uppercase mt-1">{weddingDateFormatted}</p>
                          </div>
                        </div>
                      </motion.div>
                    </section>
                  )}

                  {/* COUNTDOWN */}
                  <section id="countdown-section" className="w-full flex justify-center mb-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#2B2117] via-[#35281C] to-[#211810] text-[#F5EBD8] rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.22)] relative overflow-hidden text-center"
                    >
                      <div
                        className="w-20 h-8 mx-auto mb-2 bg-contain bg-center bg-no-repeat opacity-90 filter invert brightness-125 contrast-125"
                        style={{ backgroundImage: `url(${FLORAL_HEADER})` }}
                      />
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C5A059] mb-5">Toya Qalan Vaxt</p>
                      <CountdownDisplay weddingDateISO={weddingDateISO} />
                    </motion.div>
                  </section>

                  {/* PROGRAM / SCHEDULE */}
                  <section id="program-section" className="w-full flex justify-center mb-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.14)] text-center"
                    >
                      <div className="w-24 h-9 mx-auto mb-1 bg-contain bg-center bg-no-repeat opacity-85" style={{ backgroundImage: `url(${FLORAL_HEADER})` }} />
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C5A059] text-center mb-1">Mərasim Məlumatları</p>
                      <div className="text-center text-[#C5A059] text-xs mb-6">✦ 🌸 ✦</div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#FAF7F2] rounded-2xl p-3.5 text-center border border-[#D4AF37]/35 shadow-sm">
                          <Calendar className="w-5 h-5 text-[#C5A059] mx-auto mb-1" />
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C5A059] block mb-0.5">Tarix</span>
                          <p className="font-serif text-base text-[#4A3822] font-semibold leading-tight">{weddingDateFormatted}</p>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-2xl p-3.5 text-center border border-[#D4AF37]/35 shadow-sm">
                          <Clock className="w-5 h-5 text-[#C5A059] mx-auto mb-1" />
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C5A059] block mb-0.5">Saat</span>
                          <p className="font-serif text-base text-[#4A3822] font-semibold leading-tight">{invitation.weddingTime}</p>
                        </div>
                      </div>

                      {invitation.schedule && invitation.schedule.length > 0 && (
                        <>
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] text-center mb-4">Mərasim Axışı</p>
                          <div className="space-y-2.5 text-left">
                            {invitation.schedule.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3.5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#D4AF37]/30 shadow-sm">
                                <div className="font-serif text-base font-bold text-[#C5A059] px-2 py-1 bg-white rounded-xl border border-[#D4AF37]/25 min-w-[50px] text-center">
                                  {item.time}
                                </div>
                                <div>
                                  <h4 className="font-serif text-base font-semibold text-[#4A3822] leading-tight">{item.title}</h4>
                                  {item.description && <p className="text-[10px] text-[#8C785D] mt-0.5">{item.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {invitation.dressCode && (
                        <div className="mt-5 inline-block px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-xs text-[#5A4325]">
                          <strong>Dress Code:</strong> {invitation.dressCode}
                        </div>
                      )}

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={handleAddToCalendar}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5A4325] hover:bg-[#C5A059] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105"
                        >
                          <CalendarPlus className="w-4 h-4 text-[#FFF8E7]" />
                          Təqvimə Əlavə Et
                        </button>
                      </div>
                    </motion.div>
                  </section>

                  {/* MESSAGE */}
                  {invitation.customText && (
                    <section className="w-full flex justify-center mb-10">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.14)] text-center"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059] mb-3">Bəylə Gəlinin Mesajı</p>
                        <blockquote className="italic font-serif text-xl text-[#4A3822] leading-relaxed">“{invitation.customText}”</blockquote>
                        <p className="italic font-serif text-3xl text-[#C5A059] mt-3 font-normal">
                          — {groomName} & {brideName}
                        </p>
                      </motion.div>
                    </section>
                  )}

                  {/* VENUE & MAP */}
                  <section id="venue-section" className="w-full flex justify-center mb-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.14)] text-center"
                    >
                      <div className="w-24 h-9 mx-auto mb-1 bg-contain bg-center bg-no-repeat opacity-80" style={{ backgroundImage: `url(${FLORAL_HEADER})` }} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059] mb-1">Məkan Məlumatı</p>
                      <h2 className="font-serif text-3xl font-semibold text-[#3A2E1E] mb-2">{invitation.venue}</h2>
                      <p className="text-xs text-[#7A6452] max-w-xs mx-auto mb-6 leading-relaxed">{invitation.address}</p>

                      <div className="flex flex-col gap-2.5">
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-full bg-[#5A4325] hover:bg-[#C5A059] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-[#FFF8E7]" />
                          Google Maps-də Açın
                        </a>
                        <a
                          href={wazeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#5A4325] hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Car className="w-4 h-4 text-[#C5A059]" />
                          Waze İlə Ünvana Get
                        </a>
                      </div>
                    </motion.div>
                  </section>

                  {/* RSVP */}
                  <section id="rsvp-section" className="w-full flex justify-center mb-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,56,34,0.14)] text-center"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C5A059] mb-1">Lütfən İştirakınızı Bildirin</p>
                      <p className="italic font-serif text-base text-[#7A6452] mb-6">Mərasimdə iştirak edəcəyinizi öncədən bildirməyinizi xahiş edirik.</p>

                      <div className="flex flex-col gap-3 max-w-xs mx-auto">
                        <a
                          href={`https://wa.me/${phoneToUse}?text=${encodeURIComponent('Salam! Toyunuzda böyük məmnuniyyətlə iştirak edəcəyəm!')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-6 rounded-full bg-[#C5A059] hover:bg-[#5A4325] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#FFE6A0]" />
                          ✓ İştirak Edəcəyəm
                        </a>
                        <a
                          href={`https://wa.me/${phoneToUse}?text=${encodeURIComponent('Salam! Təəssüf ki, həmin tarixdə iştirak edə bilməyəcəyəm. Sizə xoşbəxtliklər arzulayıram!')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-6 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#5A4123] hover:border-[#5A4325] text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <XCircle className="w-4 h-4 text-[#8A7258]" />
                          ✕ Gələ Bilmirəm
                        </a>
                        <button
                          onClick={() => setShowRsvpModal(true)}
                          className="mt-2 text-xs text-[#C5A059] font-semibold hover:underline flex items-center justify-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Ətraflı Qonaq Qeydiyyatı (Qonaq Sayı Və Qeydlər)
                        </button>
                      </div>
                    </motion.div>
                  </section>

                  <section className="w-full flex justify-center mb-10">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/95 hover:bg-[#C5A059] hover:text-white text-[#5A4325] border-2 border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:scale-105"
                    >
                      <Share2 className="w-4 h-4 text-[#C5A059]" />
                      Dəvətnamə Linkini Paylaşın
                    </button>
                  </section>

                  <footer className="w-full py-8 text-center">
                    <div className="italic font-serif text-5xl text-[#8A682F] mb-1">
                      {groomName.charAt(0)} & {brideName.charAt(0)}
                    </div>
                    <p className="text-[10px] tracking-[0.25em] text-[#735E46] uppercase font-semibold">{weddingDateFormatted}</p>
                  </footer>
                </div>
              </div>

              {/* FLOATING BOTTOM NAV */}
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] sm:w-auto max-w-[460px]">
                <div className="bg-[#2B2117]/98 border border-[#D4AF37]/40 rounded-full px-3.5 sm:px-5 py-2.5 shadow-2xl flex items-center justify-between sm:justify-around text-white gap-1 sm:gap-2">
                  <button onClick={() => scrollToSection('venue-section')} className="flex flex-col items-center gap-0.5 text-[#F5EBD8] hover:text-[#FFD700] transition-colors px-1">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-semibold tracking-wider uppercase">Məkan</span>
                  </button>
                  <div className="w-px h-5 bg-[#D4AF37]/30 shrink-0" />
                  <button onClick={() => scrollToSection('program-section')} className="flex flex-col items-center gap-0.5 text-[#F5EBD8] hover:text-[#FFD700] transition-colors px-1">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-semibold tracking-wider uppercase">Təqvim</span>
                  </button>
                  <div className="w-px h-5 bg-[#D4AF37]/30 shrink-0" />
                  <button onClick={() => scrollToSection('rsvp-section')} className="flex flex-col items-center gap-0.5 text-[#F5EBD8] hover:text-[#FFD700] transition-colors px-1">
                    <Send className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-semibold tracking-wider uppercase whitespace-nowrap">İştirak Et</span>
                  </button>
                  {isMusicModeOn && (
                    <>
                      <div className="w-px h-5 bg-[#D4AF37]/30 shrink-0" />
                      <button onClick={handleToggleMusic} className="flex flex-col items-center gap-0.5 text-[#F5EBD8] hover:text-[#FFD700] transition-colors px-1" title={isMusicPlaying ? 'Musiqini saxla' : 'Musiqini qoş'}>
                        {isMusicPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-4 w-4 my-0.5">
                            <span className="w-0.5 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                            <span className="w-0.5 h-3.5 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                            <span className="w-0.5 h-2.5 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                          </div>
                        ) : (
                          <VolumeX className="w-4 h-4 text-[#C5A059]" />
                        )}
                        <span className="text-[9px] font-semibold tracking-wider uppercase">{isMusicPlaying ? 'Musiqi' : 'Səs'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* DETAILED RSVP MODAL */}
              <AnimatePresence>
                {showRsvpModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-[#3A2E1E]"
                    >
                      <button onClick={() => setShowRsvpModal(false)} className="absolute top-4 right-4 text-[#9A8870] hover:text-[#3A2E1E] text-lg">
                        ✕
                      </button>
                      <h3 className="font-serif text-2xl font-semibold text-[#5A4325] text-center mb-1">İştirak Qeydiyyatı</h3>
                      <p className="text-[11px] text-[#9A8870] text-center mb-4">
                        {groomName} & {brideName} — {weddingDateFormatted}
                      </p>
                      <form onSubmit={handleRsvpSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A4325] mb-1 uppercase tracking-wider">Adınız və Soyadınız</label>
                          <input
                            type="text"
                            required
                            placeholder="Məsələn: Əli Məmmədov"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full bg-[#EDE5D4] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A4325] mb-1 uppercase tracking-wider">Gəliş Statusu</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setRsvpAttending(true)}
                              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${rsvpAttending === true ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'bg-[#EDE5D4] text-[#5A4325] border-[#D4AF37]/30'}`}
                            >
                              ✓ Qatılacağam
                            </button>
                            <button
                              type="button"
                              onClick={() => setRsvpAttending(false)}
                              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${rsvpAttending === false ? 'bg-[#5A4325] text-white border-[#5A4325]' : 'bg-[#EDE5D4] text-[#5A4325] border-[#D4AF37]/30'}`}
                            >
                              ✕ Qatıla Bilmirəm
                            </button>
                          </div>
                        </div>
                        {rsvpAttending && (
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A4325] mb-1 uppercase tracking-wider">Qonaq Sayı</label>
                            <select
                              value={guestCount}
                              onChange={(e) => setGuestCount(parseInt(e.target.value))}
                              className="w-full bg-[#EDE5D4] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                            >
                              <option value={1}>1 nəfər (Tək)</option>
                              <option value={2}>2 nəfər (Cüt)</option>
                              <option value={3}>3 nəfər (Ailəlikcə)</option>
                              <option value={4}>4+ nəfər</option>
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A4325] mb-1 uppercase tracking-wider">Əlavə Qeyd (İstəyə görə)</label>
                          <textarea
                            rows={2}
                            placeholder="Məsələn: Təbriklər, sevinclə gələcəyik!"
                            value={guestNote}
                            onChange={(e) => setGuestNote(e.target.value)}
                            className="w-full bg-[#EDE5D4] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] resize-none"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#5A4325] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md mt-2">
                          WhatsApp İlə Cavabı Təsdiqlə
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
