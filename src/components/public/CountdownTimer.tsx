import React, { useState, useEffect } from 'react';

interface CountdownProps {
  weddingDate: string; // YYYY-MM-DD
  weddingTime?: string; // HH:mm
  theme?: 'gold' | 'floral' | 'luxury' | 'minimal';
}

export const CountdownTimer: React.FC<CountdownProps> = ({
  weddingDate,
  weddingTime = '18:00',
  theme = 'gold',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    function calculateTime() {
      try {
        const target = new Date(`${weddingDate}T${weddingTime}:00`).getTime();
        const now = new Date().getTime();
        const difference = target - now;

        if (isNaN(target) || difference <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      } catch (e) {
        console.error('Countdown parse error:', e);
      }
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, weddingTime]);

  const themeStyles = {
    gold: {
      card: 'bg-amber-950/40 border border-amber-500/30 text-amber-100 shadow-lg backdrop-blur-sm',
      num: 'text-amber-300 font-serif',
      label: 'text-amber-200/70',
    },
    floral: {
      card: 'bg-white/80 border border-rose-200 text-stone-800 shadow-md backdrop-blur-sm',
      num: 'text-rose-600 font-serif',
      label: 'text-stone-500',
    },
    luxury: {
      card: 'bg-black/60 border border-amber-400/40 text-stone-100 shadow-xl backdrop-blur-md',
      num: 'text-amber-300 font-serif',
      label: 'text-stone-400',
    },
    minimal: {
      card: 'bg-stone-100 border border-stone-300 text-stone-900',
      num: 'text-stone-900 font-sans font-light',
      label: 'text-stone-500',
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.gold;

  if (timeLeft.isPast) {
    return (
      <div id="wedding-countdown-finished" className="text-center py-4 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 max-w-md mx-auto">
        <span className="text-xl font-serif">✨ Mərasim günü gəldi və ya artıq baş tutub ✨</span>
      </div>
    );
  }

  const items = [
    { label: 'GÜN', value: timeLeft.days },
    { label: 'SAAT', value: timeLeft.hours },
    { label: 'DƏQİQƏ', value: timeLeft.minutes },
    { label: 'SANİYƏ', value: timeLeft.seconds },
  ];

  return (
    <div id="wedding-countdown-timer" className="w-full max-w-xl mx-auto my-8">
      <div className="text-center mb-3">
        <span className="text-xs uppercase tracking-[0.25em] font-medium opacity-80">
          Mərasimə Qalan Vaxt
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-transform hover:scale-105 ${currentTheme.card}`}
          >
            <span className={`text-2xl sm:text-4xl font-bold tracking-tight ${currentTheme.num}`}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span className={`text-[10px] sm:text-xs tracking-wider mt-1 uppercase font-semibold ${currentTheme.label}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
