import React from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, Check, X } from 'lucide-react';

interface RSVPFormProps {
  invitationId?: string;
  invitationSlug?: string;
  brideName: string;
  groomName: string;
  weddingDate?: string;
  venue?: string;
  contactPhone?: string;
  theme?: 'gold' | 'floral' | 'luxury' | 'minimal' | 'modern';
  onSuccess?: () => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  brideName,
  groomName,
  contactPhone,
  theme = 'gold',
}) => {
  // Clean phone number to standard international WhatsApp format: 994XXXXXXXXX
  const getCleanPhone = (phone?: string): string => {
    if (!phone) return '994501234567';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.startsWith('994')) {
      return digitsOnly;
    }
    if (digitsOnly.startsWith('0')) {
      return '994' + digitsOnly.slice(1);
    }
    if (digitsOnly.length === 9) {
      return '994' + digitsOnly;
    }
    return digitsOnly || '994501234567';
  };

  const phoneToUse = getCleanPhone(contactPhone);

  const handleSendAttending = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#eab308', '#ec4899', '#3b82f6'],
    });

    const msg = `Salam! ${groomName} və ${brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər və xoşbəxtliklər arzulayıram! 🎉`;
    const encoded = encodeURIComponent(msg);

    window.open(`https://wa.me/${phoneToUse}?text=${encoded}`, '_blank');
  };

  const handleSendDeclined = () => {
    const msg = `Salam! Təəssüf ki, ${groomName} və ${brideName}-in toy mərasimində iştirak edə bilməyəcəyəm. Bəy və gəlinə bir ömür boyu səadət, cansağlığı və xoşbəxtlik arzulayıram! 💐`;
    const encoded = encodeURIComponent(msg);

    window.open(`https://wa.me/${phoneToUse}?text=${encoded}`, '_blank');
  };

  const themeClasses = {
    gold: {
      card: 'bg-stone-900/90 border border-amber-500/40 text-amber-50 shadow-2xl backdrop-blur-md',
      title: 'text-amber-300 font-serif',
      subtitle: 'text-stone-400',
      btnYes: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40 shadow-lg border border-emerald-400/30',
      btnNo: 'bg-stone-800/90 hover:bg-stone-800 text-stone-300 border border-stone-700 hover:border-stone-500',
    },
    floral: {
      card: 'bg-white/95 border border-rose-200 text-stone-800 shadow-xl backdrop-blur-md',
      title: 'text-rose-800 font-serif',
      subtitle: 'text-stone-500',
      btnYes: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-200 shadow-lg',
      btnNo: 'bg-rose-50 hover:bg-rose-100 text-stone-700 border border-rose-200',
    },
    luxury: {
      card: 'bg-black/95 border border-amber-400/40 text-stone-100 shadow-2xl backdrop-blur-xl',
      title: 'text-[#dfb76c] font-serif',
      subtitle: 'text-stone-400',
      btnYes: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950 shadow-lg border border-emerald-400/30',
      btnNo: 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800',
    },
    minimal: {
      card: 'bg-white border border-stone-200 text-stone-900 shadow-lg',
      title: 'text-stone-900 font-serif',
      subtitle: 'text-stone-500',
      btnYes: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm',
      btnNo: 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200',
    },
    modern: {
      card: 'bg-stone-900 border border-stone-800 text-stone-100 shadow-xl',
      title: 'text-pink-400 font-sans',
      subtitle: 'text-stone-400',
      btnYes: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 shadow-lg',
      btnNo: 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.gold;

  return (
    <div
      id="rsvp-whatsapp-container"
      className={`w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl text-center transition-all ${currentTheme.card}`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <MessageCircle className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Title */}
      <h3 className={`text-xl sm:text-2xl font-bold mb-1.5 ${currentTheme.title}`}>
        Mərasimdə İştirakınız
      </h3>
      <p className={`text-xs sm:text-sm max-w-xs mx-auto leading-relaxed mb-6 ${currentTheme.subtitle}`}>
        Zəhmət olmasa mərasimdə iştirak edib-etməyəcəyinizi WhatsApp vasitəsilə bildirin.
      </p>

      {/* Two Direct Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Button 1: Gələcəyəm */}
        <button
          id="btn-rsvp-attending-whatsapp"
          type="button"
          onClick={handleSendAttending}
          className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all transform active:scale-95 cursor-pointer ${currentTheme.btnYes}`}
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>Gələcəyəm</span>
        </button>

        {/* Button 2: Gələ bilmirəm */}
        <button
          id="btn-rsvp-declined-whatsapp"
          type="button"
          onClick={handleSendDeclined}
          className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-all transform active:scale-95 cursor-pointer ${currentTheme.btnNo}`}
        >
          <X className="w-4 h-4 shrink-0 opacity-70" />
          <span>Gələ Bilmirəm</span>
        </button>
      </div>

      <p className="text-[10px] opacity-40 mt-4">
        Düyməyə toxunduqda birbaşa WhatsApp tətbiqi açılacaq.
      </p>
    </div>
  );
};
