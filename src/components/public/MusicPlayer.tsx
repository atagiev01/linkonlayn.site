import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string;
  musicTitle?: string;
  theme?: 'gold' | 'floral' | 'luxury' | 'minimal' | 'modern';
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  musicTitle = 'Toy Valsı',
  theme = 'gold',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Refs mirror the state above so the mount-time listeners always see the
  // latest value instead of a stale closure from when they were registered.
  const hasStartedRef = useRef<boolean>(false);
  const startedMutedRef = useRef<boolean>(false);

  const isMusicValid = Boolean(musicUrl && musicUrl.trim() !== '' && musicUrl !== 'none');

  useEffect(() => {
    if (!isMusicValid) return;

    // 1) Try to start playing the moment the page loads, with sound on.
    //    Most desktop browsers (and many in-app browsers like WhatsApp/Instagram)
    //    allow this. If the browser blocks it, we fall back to step 2 below.
    const tryImmediateAutoplay = () => {
      if (hasStartedRef.current || !audioRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          // 2) Blocked (common on mobile Chrome/Safari without a tap yet).
          //    Try again, muted — silent autoplay is allowed almost everywhere —
          //    then unmute automatically as soon as the guest taps/scrolls the page.
          if (audioRef.current) {
            audioRef.current.muted = true;
            audioRef.current
              .play()
              .then(() => {
                hasStartedRef.current = true;
                startedMutedRef.current = true;
                setIsPlaying(true);
                setHasStarted(true);
                setIsMuted(true);
              })
              .catch(() => {
                // Still blocked — wait for the first real gesture (handled below).
              });
          }
        });
    };

    tryImmediateAutoplay();

    // 3) Final fallback: first tap/click/scroll anywhere either starts playback
    //    (if nothing worked yet) or unmutes it (if it started muted above).
    const handleFirstGesture = () => {
      if (!audioRef.current) return;
      if (!hasStartedRef.current) {
        audioRef.current
          .play()
          .then(() => {
            hasStartedRef.current = true;
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // User can still press the play button manually.
          });
      } else if (startedMutedRef.current) {
        audioRef.current.muted = false;
        startedMutedRef.current = false;
        setIsMuted(false);
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };
  }, [isMusicValid]);

  if (!isMusicValid) {
    return null;
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => console.log('Audio playback policy:', err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const themeClasses = {
    gold: {
      bar: 'bg-stone-900/90 text-amber-200 border-amber-500/40 shadow-amber-950/60 shadow-xl',
      btnActive: 'bg-amber-500 text-stone-950 shadow-amber-500/40',
      btnInactive: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30',
      tag: 'text-amber-400/80',
      equalizer: 'bg-amber-400',
    },
    floral: {
      bar: 'bg-white/95 text-rose-800 border-rose-200 shadow-rose-200/50 shadow-xl',
      btnActive: 'bg-rose-600 text-white shadow-rose-400/40',
      btnInactive: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
      tag: 'text-rose-500/80',
      equalizer: 'bg-rose-500',
    },
    luxury: {
      bar: 'bg-black/95 text-[#dfb76c] border-[#dfb76c]/40 shadow-black shadow-2xl',
      btnActive: 'bg-[#dfb76c] text-black shadow-[#dfb76c]/40',
      btnInactive: 'bg-[#dfb76c]/20 text-[#dfb76c] hover:bg-[#dfb76c]/30',
      tag: 'text-[#dfb76c]/80',
      equalizer: 'bg-[#dfb76c]',
    },
    minimal: {
      bar: 'bg-white/95 text-stone-900 border-stone-300 shadow-stone-300/40 shadow-lg',
      btnActive: 'bg-stone-900 text-white',
      btnInactive: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
      tag: 'text-stone-500',
      equalizer: 'bg-stone-800',
    },
    modern: {
      bar: 'bg-stone-900/95 text-pink-300 border-stone-700 shadow-stone-950 shadow-xl',
      btnActive: 'bg-pink-600 text-white',
      btnInactive: 'bg-stone-800 text-pink-300 hover:bg-stone-700',
      tag: 'text-stone-400',
      equalizer: 'bg-pink-500',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.gold;

  return (
    <div
      id="floating-music-player"
      className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center gap-2"
    >
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="none"
        onError={() => {
          // Graceful handling of blocked or unavailable audio stream
          setIsPlaying(false);
        }}
      />

      <div
        className={`flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all duration-300 ${currentTheme.bar}`}
      >
        {/* Play / Pause Circular Button */}
        <button
          id="music-play-btn"
          onClick={togglePlay}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying ? currentTheme.btnActive : currentTheme.btnInactive
          }`}
          title={isPlaying ? 'Musiqini dayandır' : 'Musiqini səsləndir'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
          )}
        </button>

        {/* Title & Animated Equalizer */}
        <div className="flex flex-col max-w-[120px] sm:max-w-[170px] truncate">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold leading-tight truncate">
              {musicTitle}
            </span>
          </div>

          {/* Equalizer Wave / Status */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isPlaying ? (
              isMuted ? (
                <span className={`text-[9px] ${currentTheme.tag} flex items-center gap-1`}>
                  <VolumeX className="w-2.5 h-2.5" />
                  <span>Səssiz</span>
                </span>
              ) : (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className={`w-0.5 rounded-full animate-bounce h-2 ${currentTheme.equalizer}`} style={{ animationDuration: '0.6s' }}></span>
                  <span className={`w-0.5 rounded-full animate-bounce h-3 ${currentTheme.equalizer}`} style={{ animationDuration: '0.4s' }}></span>
                  <span className={`w-0.5 rounded-full animate-bounce h-1.5 ${currentTheme.equalizer}`} style={{ animationDuration: '0.8s' }}></span>
                  <span className={`w-0.5 rounded-full animate-bounce h-2.5 ${currentTheme.equalizer}`} style={{ animationDuration: '0.5s' }}></span>
                  <span className={`text-[9px] ${currentTheme.tag} ml-1 font-medium`}>Səslənir...</span>
                </div>
              )
            ) : (
              <span className={`text-[9px] ${currentTheme.tag} flex items-center gap-1`}>
                <Sparkles className="w-2.5 h-2.5" />
                <span>Dinləmək üçün toxunun</span>
              </span>
            )}
          </div>
        </div>

        {/* Mute Button — always available so the guest can pre-mute or silence at any time */}
        <button
          id="music-mute-btn"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          title={isMuted ? 'Səsi aç' : 'Səsi bağla'}
          aria-label="Toggle mute"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80" />
          )}
        </button>
      </div>
    </div>
  );
};
