import React, { useState, useRef, useEffect } from 'react';
import { Invitation, Template, ScheduleItem } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Image,
  Music,
  Link as LinkIcon,
  Play,
  Pause,
  Disc,
  CheckCircle,
} from 'lucide-react';
import { WEDDING_MUSIC_PRESETS, WeddingMusicTrack } from '../../data/weddingMusicPresets';

interface InvitationEditorModalProps {
  isOpen: boolean;
  initialData?: Invitation | null;
  templates: Template[];
  onSave: (invitation: Invitation) => Promise<void>;
  onClose: () => void;
  onPreview?: (invitation: Invitation) => void;
}

export const InvitationEditorModal: React.FC<InvitationEditorModalProps> = ({
  isOpen,
  initialData,
  templates,
  onSave,
  onClose,
  onPreview,
}) => {
  const isEditing = !!initialData;

  const [templateId, setTemplateId] = useState(initialData?.templateId || templates[0]?.id || 'elegant-gold');
  const [brideName, setBrideName] = useState(initialData?.brideName || '');
  const [groomName, setGroomName] = useState(initialData?.groomName || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brideParents, setBrideParents] = useState(initialData?.brideParents || '');
  const [groomParents, setGroomParents] = useState(initialData?.groomParents || '');
  const [weddingDate, setWeddingDate] = useState(initialData?.weddingDate || '2026-10-25');
  const [weddingTime, setWeddingTime] = useState(initialData?.weddingTime || '18:00');
  const [venue, setVenue] = useState(initialData?.venue || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || 'Bakı');
  const [googleMapUrl, setGoogleMapUrl] = useState(initialData?.mapCoordinates?.mapUrl || '');
  const [wazeUrl, setWazeUrl] = useState(initialData?.wazeUrl || '');
  const [heroImage, setHeroImage] = useState(
    initialData?.heroImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  );
  const [customText, setCustomText] = useState(
    initialData?.customText ||
      'Həyatımızın ən özəl günündə, bir ömür boyu sürəcək səadətə ilk addımımızı atarkən siz əzizlərimizi aramızda görməkdən məmnun olarıq.'
  );
  const [music, setMusic] = useState(
    initialData?.music && initialData.music !== 'none'
      ? initialData.music
      : WEDDING_MUSIC_PRESETS[0].url
  );
  const [musicTitle, setMusicTitle] = useState(
    initialData?.musicTitle || WEDDING_MUSIC_PRESETS[0].defaultTitle
  );
  const [musicEnabled, setMusicEnabled] = useState<boolean>(
    initialData?.musicEnabled !== undefined
      ? initialData.musicEnabled
      : initialData
      ? !!initialData.music && initialData.music !== 'none' && initialData.music.trim() !== ''
      : true
  );
  const [musicMode, setMusicMode] = useState<'preset' | 'custom'>(
    initialData?.music && !WEDDING_MUSIC_PRESETS.some((p) => p.url === initialData.music)
      ? 'custom'
      : 'preset'
  );
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlayPreview = (urlToPlay: string) => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.src = urlToPlay;
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch(() => setIsPlayingPreview(false));
    }
  };

  const handleSelectPreset = (preset: WeddingMusicTrack) => {
    setMusic(preset.url);
    setMusicTitle(preset.defaultTitle);
    setMusicMode('preset');
    setMusicEnabled(true);
    if (audioPreviewRef.current && isPlayingPreview) {
      audioPreviewRef.current.src = preset.url;
      audioPreviewRef.current.play().catch(() => {});
    }
  };
  const [video, setVideo] = useState(initialData?.video || '');
  const [dressCode, setDressCode] = useState(initialData?.dressCode || 'Klassik Axşam Geyimi');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '+994 50 000 00 00');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    initialData?.schedule || [
      { time: '17:30', title: 'Qonaqların Qarşılanması', description: 'Canlı musiqi sədaları altında' },
      { time: '18:30', title: 'Nikah Mərasimi', description: 'Təntənəli giriş və andiçmə' },
      { time: '19:30', title: 'Ziyafət & Şam Yeməyi', description: 'Musiqili şou proqram' },
      { time: '22:30', title: 'Toy Tortu & Atəşfəşanlıq', description: 'Xatirə fotoları' },
    ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto generate slug from names if slug is empty
  const handleGenerateSlug = () => {
    if (!groomName && !brideName) return;
    const cleanGroom = groomName
      .toLowerCase()
      .replace(/ə/g, 'e')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c')
      .replace(/ş/g, 's')
      .replace(/[^a-z0-9]/g, '');
    const cleanBride = brideName
      .toLowerCase()
      .replace(/ə/g, 'e')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c')
      .replace(/ş/g, 's')
      .replace(/[^a-z0-9]/g, '');
    setSlug(`${cleanGroom}-ve-${cleanBride}`);
  };

  const handleAddScheduleItem = () => {
    setSchedule([...schedule, { time: '20:00', title: 'Yeni Proqram Hissəsi', description: '' }]);
  };

  const handleRemoveScheduleItem = (idx: number) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const handleUpdateScheduleItem = (idx: number, field: keyof ScheduleItem, val: string) => {
    const updated = [...schedule];
    updated[idx] = { ...updated[idx], [field]: val };
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) {
      setError('Gəlin və Bəyin adları mütləq daxil edilməlidir.');
      return;
    }
    if (!venue.trim()) {
      setError('Məkan adı mütləq daxil edilməlidir.');
      return;
    }

    const finalSlug = (slug.trim() || `${groomName.toLowerCase()}-${brideName.toLowerCase()}`)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    setIsSaving(true);
    setError(null);

    try {
      const inv: Invitation = {
        id: initialData?.id || 'inv_' + Date.now(),
        slug: finalSlug,
        templateId,
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        brideParents: brideParents.trim(),
        groomParents: groomParents.trim(),
        weddingDate,
        weddingTime,
        venue: venue.trim(),
        address: address.trim(),
        city: city.trim(),
        heroImage: heroImage.trim(),
        customText: customText.trim(),
        music: musicEnabled ? music.trim() : '',
        musicTitle: musicEnabled ? musicTitle.trim() : '',
        musicEnabled,
        video: video.trim(),
        dressCode: dressCode.trim(),
        contactPhone: contactPhone.trim(),
        mapCoordinates: googleMapUrl.trim()
          ? { ...(initialData?.mapCoordinates || { lat: 0, lng: 0 }), mapUrl: googleMapUrl.trim() }
          : (initialData?.mapCoordinates || null),
        wazeUrl: wazeUrl.trim(),
        schedule,
        active,
        views: initialData?.views || 0,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(inv);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err?.message || 'Yadda saxlanılarkən xəta baş verdi.');
      setIsSaving(false);
    }
  };

  return (
    <div
      id="invitation-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="invitation-editor-modal-content"
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl text-stone-100 shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-stone-900 border-b border-stone-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-stone-100 truncate">
              {isEditing ? 'Dəvətnaməni Redaktə Et' : 'Yeni Toy Dəvətnaməsi Yarat'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 flex-shrink-0 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs">
              {error}
            </div>
          )}

          {/* 1. Template Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400 mb-3">
              1. Şablon Seçimi <span className="text-stone-400 font-normal">(Eyni şablon çoxlu dəvətnamələrdə istifadə oluna bilər)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((tpl) => {
                const isSelected = templateId === tpl.id;
                const isCustom = tpl.isCustomCode || !!tpl.customHtml || tpl.id.startsWith('custom');

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setTemplateId(tpl.id)}
                    className={`cursor-pointer rounded-2xl border-2 overflow-hidden p-2 transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2 relative">
                      <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          SEÇİLDİ
                        </div>
                      )}
                      {isCustom && (
                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shadow">
                          HTML/CSS/JS
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold truncate text-stone-200">{tpl.name}</div>
                    <div className="text-[10px] text-stone-400 capitalize">{tpl.category}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Couple Information & Slug */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400">
              2. Bəy & Gəlin Məlumatları
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Bəyin Adı *</label>
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  onBlur={handleGenerateSlug}
                  placeholder="Məs: Əli"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Gəlinin Adı *</label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  onBlur={handleGenerateSlug}
                  placeholder="Məs: Nigar"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Unique Public Slug (Custom /slug) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-stone-400 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unikal Link Slag-ı (URL) *</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Adlardan yarat
                </button>
              </div>
              <div className="flex items-center rounded-xl bg-stone-950 border border-stone-800 px-3 py-2 text-xs">
                <span className="text-stone-500 font-mono select-none">/invite/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="ali-ve-nigar"
                  className="w-full bg-transparent text-amber-300 font-mono font-semibold focus:outline-none px-1 text-xs"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Qonaq bu unikal linki açdıqda dəvətnamə və şablon avtomatik yüklənəcək.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Bəyin Valideynləri (İstəyə görə)</label>
                <input
                  type="text"
                  value={groomParents}
                  onChange={(e) => setGroomParents(e.target.value)}
                  placeholder="Məs: Əliyevlər ailəsi"
                  className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Gəlinin Valideynləri (İstəyə görə)</label>
                <input
                  type="text"
                  value={brideParents}
                  onChange={(e) => setBrideParents(e.target.value)}
                  placeholder="Məs: Məmmədovlar ailəsi"
                  className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Date, Time & Venue */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400">
              3. Tarix, Saat & Məkan
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Toy Tarixi *</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Mərasim Saatı *</label>
                <input
                  type="time"
                  required
                  value={weddingTime}
                  onChange={(e) => setWeddingTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Şəhər</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bakı"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Şadlıq Sarayı / Məkanın Adı *</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Məs: Buta Palace və ya Crystal Hall"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Tam Ünvan *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Məs: Heydər Əliyev prospekti 123"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Google Xəritə Linki (məkanı Google Maps-də açıb "Paylaş" düyməsindən linki kopyalayın)
                </label>
                <input
                  type="url"
                  value={googleMapUrl}
                  onChange={(e) => setGoogleMapUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/... (boş qalsa, ünvana görə avtomatik yaranır)"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Waze Linki (Waze tətbiqində məkanı açıb "Share" → "Copy Link")
                </label>
                <input
                  type="url"
                  value={wazeUrl}
                  onChange={(e) => setWazeUrl(e.target.value)}
                  placeholder="https://waze.com/ul?... (boş qalsa, ünvana görə avtomatik yaranır)"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-500 -mt-2">
              Hər iki link boş qalarsa, dəvətnamədəki "Xəritədə Bax" və "Waze ilə Get" düymələri avtomatik olaraq
              məkan adı və ünvana əsasən yaradılır. Dəqiq nöqtəni göstərmək istəyirsinizsə, öz linklərinizi yapışdırın.
            </p>
          </div>

          {/* 4. Media & Audio & Custom Text */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400">
              4. Media, Musiqi & Dəvət Mətni
            </label>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Əsas Şəkil URL (Hero Image)</label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Audio Preview Element */}
            <audio ref={audioPreviewRef} loop onEnded={() => setIsPlayingPreview(false)} />

            {/* Music Manager Section */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">Fon Musiqisi İdarəetməsi</h4>
                    <p className="text-[11px] text-stone-500">Bu dəvətnamə üçün xüsusi musiqi seçin və ya söndürün</p>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (musicEnabled && isPlayingPreview && audioPreviewRef.current) {
                      audioPreviewRef.current.pause();
                      setIsPlayingPreview(false);
                    }
                    setMusicEnabled(!musicEnabled);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    musicEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-stone-900 text-stone-500 border border-stone-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${musicEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'}`}></span>
                  <span>{musicEnabled ? 'Musiqi Aktivdir' : 'Musiqisiz'}</span>
                </button>
              </div>

              {musicEnabled ? (
                <div className="space-y-3 pt-2 border-t border-stone-800/80">
                  {/* Mode switcher */}
                  <div className="flex items-center gap-2 bg-stone-900/80 p-1 rounded-xl border border-stone-800">
                    <button
                      type="button"
                      onClick={() => setMusicMode('preset')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        musicMode === 'preset'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Hazır Toy Musiqiləri ({WEDDING_MUSIC_PRESETS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMusicMode('custom')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        musicMode === 'custom'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Xüsusi MP3 Linki
                    </button>
                  </div>

                  {musicMode === 'preset' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {WEDDING_MUSIC_PRESETS.map((track) => {
                          const isSelected = music === track.url;
                          const isThisPlaying = isPlayingPreview && audioPreviewRef.current?.src === track.url;

                          return (
                            <div
                              key={track.id}
                              onClick={() => handleSelectPreset(track)}
                              className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-950/30 border-amber-500/50 shadow-sm'
                                  : 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700'
                              }`}
                            >
                              <div className="truncate flex-1">
                                <div className="flex items-center gap-1.5">
                                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                  <span className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                                    {track.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-stone-500 truncate mt-0.5">{track.description}</p>
                              </div>

                              {/* Play preview button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePlayPreview(track.url);
                                }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isThisPlaying
                                    ? 'bg-amber-500 text-stone-950 shadow-md animate-pulse'
                                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                }`}
                                title={isThisPlaying ? 'Dayandır' : 'Dinlə'}
                              >
                                {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3 bg-stone-900/40 rounded-xl border border-stone-800/80">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Xüsusi MP3 Linki (.mp3)</label>
                        <input
                          type="url"
                          value={music}
                          onChange={(e) => setMusic(e.target.value)}
                          placeholder="https://server.com/mahniniz.mp3"
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Musiqinin Adı</label>
                        <input
                          type="text"
                          value={musicTitle}
                          onChange={(e) => setMusicTitle(e.target.value)}
                          placeholder="Məs: Toy Valsı (İnstrumental)"
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Active track bar preview */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Disc className={`w-4 h-4 text-amber-400 shrink-0 ${isPlayingPreview ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                      <span className="text-stone-300 truncate font-medium">{musicTitle || 'Seçilmiş musiqi'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePlayPreview(music)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium text-xs transition-colors shrink-0"
                    >
                      {isPlayingPreview ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Dayandır</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Səsi Dinlə</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-stone-900/40 text-stone-500 text-xs text-center border border-stone-800/60">
                  Bu dəvətnamədə fon musiqisi səslənməyəcək (səssiz rejim).
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Dəvətnamə Mətni (Ürək Sözləri)</label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Dress Code</label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="Məs: Klassik Axşam Geyimi"
                  className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">
                  Toy Sahibinin WhatsApp Nömrəsi <span className="text-emerald-400 text-[10px]">(Qonaqların RSVP təsdiqi bura gələcək)</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Schedule Items */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                5. Mərasim Cədvəli
              </label>
              <button
                type="button"
                onClick={handleAddScheduleItem}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hissə Əlavə Et</span>
              </button>
            </div>

            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleUpdateScheduleItem(idx, 'time', e.target.value)}
                    placeholder="18:00"
                    className="w-20 px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-center font-mono text-amber-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateScheduleItem(idx, 'title', e.target.value)}
                    placeholder="Mərhələ adı (məs: Nikah)"
                    className="w-1/3 px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleUpdateScheduleItem(idx, 'description', e.target.value)}
                    placeholder="Ətraflı məlumat"
                    className="flex-1 px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveScheduleItem(idx)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active status */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="inv-active-check"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700"
              />
              <label htmlFor="inv-active-check" className="text-xs font-semibold text-stone-300">
                Dəvətnamə Aktivdir (Qonaqlar linkə daxil ola bilər)
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-800 text-stone-400 text-xs font-semibold hover:bg-stone-800 hover:text-white transition-colors"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saxlanılır...' : isEditing ? 'Dəyişiklikləri Saxla' : 'Dəvətnaməni Yarat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
