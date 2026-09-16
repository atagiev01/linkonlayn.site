import React from 'react';
import { MapPin, CalendarDays, Send, Music2 } from 'lucide-react';

interface QuickActionsDockProps {
  /** id of the venue/location section to scroll to */
  venueId?: string;
  /** id of the schedule/program section to scroll to. Falls back to venueId's page top behaviour if absent. */
  scheduleId?: string;
  /** id of the RSVP section to scroll to */
  rsvpId?: string;
  /** Show the 4th "Musiqi" button — only pass true when this invitation actually has music,
   *  since the button simply clicks the floating MusicPlayer's play button (id="music-play-btn"). */
  showMusic?: boolean;
  /** Visual palette to match the host template */
  theme?: 'dark' | 'light';
}

const scrollToId = (id?: string) => {
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const QuickActionsDock: React.FC<QuickActionsDockProps> = ({
  venueId = 'venue-section',
  scheduleId,
  rsvpId = 'rsvp-section',
  showMusic = false,
  theme = 'dark',
}) => {
  const toggleMusic = () => {
    const btn = document.getElementById('music-play-btn') as HTMLButtonElement | null;
    btn?.click();
  };

  const palette =
    theme === 'dark'
      ? {
          bar: 'bg-stone-950/95 border-amber-400/30',
          text: 'text-stone-200',
          icon: 'text-amber-400',
          divider: 'bg-amber-400/20',
          hover: 'hover:text-amber-300',
        }
      : {
          bar: 'bg-white/97 border-stone-200',
          text: 'text-stone-700',
          icon: 'text-stone-500',
          divider: 'bg-stone-200',
          hover: 'hover:text-stone-950',
        };

  return (
    <div
      id="quick-actions-dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-auto max-w-[420px]"
    >
      <div
        className={`border rounded-full px-3 sm:px-5 py-2.5 shadow-2xl flex items-center justify-between sm:justify-around gap-1 ${palette.bar}`}
      >
        <button
          id="quick-actions-venue-btn"
          onClick={() => scrollToId(venueId)}
          className={`flex flex-col items-center gap-0.5 px-1.5 transition-colors cursor-pointer ${palette.text} ${palette.hover}`}
        >
          <MapPin className={`w-4 h-4 ${palette.icon}`} />
          <span className="text-[9px] font-semibold tracking-wider uppercase">Məkan</span>
        </button>

        <div className={`w-px h-5 shrink-0 ${palette.divider}`} />

        <button
          id="quick-actions-schedule-btn"
          onClick={() => scrollToId(scheduleId || venueId)}
          className={`flex flex-col items-center gap-0.5 px-1.5 transition-colors cursor-pointer ${palette.text} ${palette.hover}`}
        >
          <CalendarDays className={`w-4 h-4 ${palette.icon}`} />
          <span className="text-[9px] font-semibold tracking-wider uppercase">Təqvim</span>
        </button>

        <div className={`w-px h-5 shrink-0 ${palette.divider}`} />

        <button
          id="quick-actions-rsvp-btn"
          onClick={() => scrollToId(rsvpId)}
          className={`flex flex-col items-center gap-0.5 px-1.5 transition-colors cursor-pointer ${palette.text} ${palette.hover}`}
        >
          <Send className={`w-4 h-4 ${palette.icon}`} />
          <span className="text-[9px] font-semibold tracking-wider uppercase whitespace-nowrap">İştirak Et</span>
        </button>

        {showMusic && (
          <>
            <div className={`w-px h-5 shrink-0 ${palette.divider}`} />
            <button
              id="quick-actions-music-btn"
              onClick={toggleMusic}
              className={`flex flex-col items-center gap-0.5 px-1.5 transition-colors cursor-pointer ${palette.text} ${palette.hover}`}
            >
              <Music2 className={`w-4 h-4 ${palette.icon}`} />
              <span className="text-[9px] font-semibold tracking-wider uppercase">Musiqi</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
