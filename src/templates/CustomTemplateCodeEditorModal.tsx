import React, { useState, useMemo } from 'react';
import { Template, Invitation } from '../types';
import { CUSTOM_TEMPLATE_STARTERS } from '../data/customTemplateStarters';
import { DEFAULT_INVITATIONS } from '../data/initialData';
import { CustomCodeTemplate } from './CustomCodeTemplate';
import { sanitizeCustomCode, splitFullHtmlDocument } from '../utils/htmlTemplateParser';
import {
  X,
  Code2,
  FileCode,
  Sparkles,
  Palette,
  Play,
  Check,
  Smartphone,
  Monitor,
  Sliders,
  BookOpen,
  Info,
  Wand2,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  Layers,
} from 'lucide-react';

interface CustomTemplateCodeEditorModalProps {
  template: Template;
  isOpen: boolean;
  onSave: (tpl: Template) => Promise<void>;
  onClose: () => void;
}

export const CustomTemplateCodeEditorModal: React.FC<CustomTemplateCodeEditorModalProps> = ({
  template,
  isOpen,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  // Form State
  const [name, setName] = useState(template.name || 'Fərdi HTML/CSS/JS Şablonu');
  const [description, setDescription] = useState(
    template.description || 'Fərdi kodlaşdırılmış unikal toy dəvətnaməsi şablonu.'
  );
  const [category, setCategory] = useState<Template['category']>(template.category || 'modern');
  const [previewImage, setPreviewImage] = useState(
    template.previewImage ||
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  );
  const [active, setActive] = useState(template.active ?? true);

  // Media State — order matters: 1) bağlı dəvətnamə şəkli, 2) açılış videosu, 3) arxa fon
  const [closedEnvelopeImage, setClosedEnvelopeImage] = useState(template.closedEnvelopeImage || '');
  const [openingVideo, setOpeningVideo] = useState(template.openingVideo || '');
  const [openingVideoSpeed, setOpeningVideoSpeed] = useState(template.openingVideoSpeed ?? 1);
  const [openingVideoTrimSeconds, setOpeningVideoTrimSeconds] = useState(template.openingVideoTrimSeconds ?? 0);
  const [backgroundMediaType, setBackgroundMediaType] = useState<'image' | 'video'>(
    template.backgroundMediaType || 'video'
  );
  const [backgroundImage, setBackgroundImage] = useState(template.backgroundImage || '');
  const [backgroundVideo, setBackgroundVideo] = useState(template.backgroundVideo || '');

  // Colors State — rənglər dəyişməsə belə default dəyərlər şablonun öz rənglərini göstərir
  const [colorBackground, setColorBackground] = useState(template.customColors?.background || '#f4f2ee');
  const [colorText, setColorText] = useState(template.customColors?.text || '#211f1b');
  const [colorAccent, setColorAccent] = useState(template.customColors?.accent || '#d4af37');
  const [colorBorder, setColorBorder] = useState(template.customColors?.border || '#d8d3c8');
  const [colorMuted, setColorMuted] = useState(template.customColors?.muted || '#9a9282');

  // Code State
  const defaultStarter = CUSTOM_TEMPLATE_STARTERS[0];
  const [customHtml, setCustomHtml] = useState(template.customHtml || defaultStarter.html);
  const [customCss, setCustomCss] = useState(template.customCss || defaultStarter.css);
  const [customJs, setCustomJs] = useState(template.customJs || defaultStarter.js);

  // Editor Navigation & View State
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'js' | 'settings' | 'media' | 'colors' | 'starters'>('html');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Sample invitation for live preview
  const sampleInvitation: Invitation = DEFAULT_INVITATIONS[0];

  // Dynamic preview template object
  const previewTemplateObj: Template = useMemo(() => ({
    ...template,
    name,
    description,
    category,
    previewImage,
    active,
    isCustomCode: true,
    customHtml,
    customCss,
    customJs,
    closedEnvelopeImage,
    openingVideo,
    openingVideoSpeed,
    openingVideoTrimSeconds,
    backgroundMediaType,
    backgroundImage,
    backgroundVideo,
    customColors: {
      background: colorBackground,
      text: colorText,
      accent: colorAccent,
      border: colorBorder,
      muted: colorMuted,
    },
    updatedAt: new Date().toISOString(),
  }), [
    template,
    name,
    description,
    category,
    previewImage,
    active,
    customHtml,
    customCss,
    customJs,
    closedEnvelopeImage,
    openingVideo,
    openingVideoSpeed,
    openingVideoTrimSeconds,
    backgroundMediaType,
    backgroundImage,
    backgroundVideo,
    colorBackground,
    colorText,
    colorAccent,
    colorBorder,
    colorMuted,
  ]);

  // Insert variable tag into HTML
  const handleInsertTag = (tag: string) => {
    setCustomHtml((prev) => prev + `\n` + tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  // Check if current HTML is a complete <!doctype html> document
  const isFullDocument = useMemo(() => {
    return /<!doctype\s+html/i.test(customHtml) || /<html[\s>]/i.test(customHtml);
  }, [customHtml]);

  // Clean code from anti-debugger and crash loops
  const handleSanitizeCode = () => {
    const cleanedHtml = sanitizeCustomCode(customHtml);
    const cleanedJs = sanitizeCustomCode(customJs);
    const changed = cleanedHtml !== customHtml || cleanedJs !== customJs;
    setCustomHtml(cleanedHtml);
    setCustomJs(cleanedJs);
    if (changed) {
      alert('Koddakı brauzeri donduran "debugger" və anti-tamper dövrləri uğurla təmizləndi!');
    } else {
      alert('Kod təmizdir, heç bir zərərli və ya dondurucu trap tapılmadı.');
    }
  };

  // Auto split a full HTML document into HTML, CSS, JS tabs
  const handleAutoSplit = () => {
    if (!customHtml.trim()) return;
    const res = splitFullHtmlDocument(customHtml);
    if (res.isFullDocument) {
      setCustomHtml(res.html);
      if (res.css) setCustomCss((prev) => (prev ? prev + '\n\n' + res.css : res.css));
      if (res.js) setCustomJs((prev) => (prev ? prev + '\n\n' + res.js : res.js));
      alert('Bütöv sənəd uğurla HTML strukturu, CSS stilləri və JS skriptlərinə ayrıldı!');
    } else {
      alert('Daxil edilmiş kod artıq sırf HTML bədən hissəsidir (<!doctype html> deyil).');
    }
  };

  // Load starter template
  const handleLoadStarter = (starterId: string) => {
    const starter = CUSTOM_TEMPLATE_STARTERS.find((s) => s.id === starterId);
    if (!starter) return;
    if (
      confirm(
        `"${starter.name}" şablonunu yükləmək istəyirsiniz? Mövcud HTML, CSS və JS kodları əvəzlənəcək.`
      )
    ) {
      setCustomHtml(starter.html);
      setCustomCss(starter.css);
      setCustomJs(starter.js);
      setCategory(starter.category);
      setPreviewImage(starter.previewImage);
      setActiveCodeTab('html');
    }
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: Template = {
        ...template,
        name,
        description,
        category,
        previewImage,
        active,
        isCustomCode: true,
        customHtml,
        customCss,
        customJs,
        closedEnvelopeImage,
        openingVideo,
        openingVideoSpeed,
        openingVideoTrimSeconds,
        backgroundMediaType,
        backgroundImage,
        backgroundVideo,
        customColors: {
          background: colorBackground,
          text: colorText,
          accent: colorAccent,
          border: colorBorder,
          muted: colorMuted,
        },
        templatePath: 'templates/custom-code',
        updatedAt: new Date().toISOString(),
      };
      await onSave(updated);
      setIsSaving(false);
      onClose();
    } catch (e) {
      console.error('Save custom code template error:', e);
      setIsSaving(false);
    }
  };

  const AVAILABLE_VARIABLES = [
    { tag: '{{brideName}}', label: 'Gəlinin Adı (məs: Nigar)' },
    { tag: '{{groomName}}', label: 'Bəyin Adı (məs: Əli)' },
    { tag: '{{coupleNames}}', label: 'Cütlük (məs: Nigar & Əli)' },
    { tag: '{{weddingDate}}', label: 'Formatlanmış Tarix (məs: 18 Oktyabr 2026)' },
    { tag: '{{weddingTime}}', label: 'Mərasim Saatı (məs: 18:00)' },
    { tag: '{{venue}}', label: 'Restoran / Saray (məs: Baku Crystal Hall)' },
    { tag: '{{address}}', label: 'Ünvan (məs: Dövlət Bayrağı Meydanı)' },
    { tag: '{{city}}', label: 'Şəhər (məs: Bakı)' },
    { tag: '{{customText}}', label: 'Dəvət Mətni' },
    { tag: '{{dressCode}}', label: 'Geyim Qaydası (Dress Code)' },
    { tag: '{{heroImage}}', label: 'Əsas Foto URL' },
    { tag: '{{brideParents}}', label: 'Gəlinin Valideynləri' },
    { tag: '{{groomParents}}', label: 'Bəyin Valideynləri' },
    { tag: '{{contactPhone}}', label: 'Əlaqə Nömrəsi' },
    { tag: '{{mapUrl}}', label: 'Google Xəritə Linki' },
    { tag: '{{googleMapsUrl}}', label: 'Google Xəritə Linki (alternativ ad)' },
    { tag: '{{wazeUrl}}', label: 'Waze Naviqasiya Linki' },
  ];

  return (
    <div
      id="custom-code-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in text-stone-100"
    >
      <div
        className="relative w-full h-[95vh] max-w-7xl bg-stone-900 border border-stone-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-800 bg-stone-950 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-100">{name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  HTML/CSS/JS Engine
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">ID: {template.id}</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Preview Toggle & Device Switcher */}
            <div className="hidden sm:flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Mobil Ekran Ölçüsü (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Geniş Ekran Ölçüsü"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                showLivePreview
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-300'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Canlı Önizləmə</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saxlanılır...' : 'Şablonu Saxla'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Editor & Live Preview Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Code Editor & Settings */}
          <div className="flex-1 flex flex-col border-r border-stone-800 min-w-0 bg-stone-950">
            {/* Editor Tabs Navigation */}
            <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900/90 px-4 pt-2 overflow-x-auto">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('html')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'html'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-orange-400" />
                  <span>HTML Strukturu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('css')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'css'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Palette className="w-4 h-4 text-sky-400" />
                  <span>CSS Stilləri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('js')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'js'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>JavaScript (JS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('settings')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'settings'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Məlumatlar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('media')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'media'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-pink-400" />
                  <span>Media (Zərf & Fon)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('colors')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'colors'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Palette className="w-4 h-4 text-fuchsia-400" />
                  <span>Rənglər</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCodeTab('starters')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                    activeCodeTab === 'starters'
                      ? 'bg-stone-950 text-amber-400 border-t-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Hazır Şablonlar</span>
                </button>
              </div>
            </div>

            {/* Tab 1: HTML Editor with Variable Insert Bar */}
            {activeCodeTab === 'html' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {/* HTML Actions Bar (Sanitize & Auto-Split) */}
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 bg-stone-900/60 p-2 rounded-xl border border-stone-800">
                  <div className="flex items-center gap-2">
                    {isFullDocument ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Tam Sənəd (Doctype / HTML / Body mövcuddur)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 text-stone-400 text-[11px] font-mono">
                        Bədən (Body) HTML kodu
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isFullDocument && (
                      <button
                        type="button"
                        onClick={handleAutoSplit}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Bütöv HTML faylının içindəki <style> və <script>-ləri ayrıca CSS və JS vərəqlərinə payla"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
                        <span>HTML / CSS / JS-ə Ayır</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSanitizeCode}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                      title="Koddakı dondurucu debugger trap və anti-tamper zərərli kodları sil"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Debugger & Donma Təmizlə</span>
                    </button>
                  </div>
                </div>

                {/* Variable Pills Toolbar */}
                <div className="mb-3 p-2.5 bg-stone-900 border border-stone-800 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Dinamik Dəyişənlər (Koda əlavə etmək üçün klikləyin):
                    </span>
                    {copiedTag && (
                      <span className="text-emerald-400 font-bold animate-pulse">
                        Əlavə olundu: {copiedTag}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {AVAILABLE_VARIABLES.map((v) => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => handleInsertTag(v.tag)}
                        className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-amber-500/20 hover:text-amber-300 text-stone-300 text-[11px] font-mono border border-stone-700 hover:border-amber-500/40 transition-all cursor-pointer"
                        title={v.label}
                      >
                        {v.tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea HTML Editor */}
                <div className="flex-1 relative">
                  <textarea
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    placeholder="<!-- HTML kodunuzu bura daxil edin -->"
                    className="w-full h-full p-4 font-mono text-xs bg-stone-900 border border-stone-800 rounded-2xl text-emerald-300 focus:border-amber-400 focus:outline-none resize-none leading-relaxed selection:bg-amber-500/30 selection:text-white"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: CSS Editor */}
            {activeCodeTab === 'css' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="mb-3 flex items-center justify-between text-xs text-stone-400">
                  <span>CSS Stilləri (Google Fonts @import və animasiyalar dəstəklənir):</span>
                  <span className="text-[11px] text-amber-400 font-mono">.custom-template-wrapper</span>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="/* Xüsusi CSS kodunuz */"
                    className="w-full h-full p-4 font-mono text-xs bg-stone-900 border border-stone-800 rounded-2xl text-sky-300 focus:border-amber-400 focus:outline-none resize-none leading-relaxed selection:bg-amber-500/30 selection:text-white"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: JS Editor */}
            {activeCodeTab === 'js' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="mb-3 p-3 bg-stone-900 border border-stone-800 rounded-2xl text-xs space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    JavaScript API Qaydaları:
                  </div>
                  <p className="text-[11px] text-stone-400">
                    - <code className="text-amber-300">window.InvitationApp.openRSVP()</code> : RSVP qeydiyyat pəncərəsini açır.
                    <br />
                    - <code className="text-amber-300">window.InvitationApp.addToCalendar()</code> : Təqvimə əlavə edir.
                    <br />
                    - <code className="text-amber-300">window.InvitationApp.openMap()</code> : Google Xəritəni açır.
                    <br />
                    - <code className="text-amber-300">window.InvitationApp.openWaze()</code> : Waze naviqasiyasını açır.
                    <br />
                    - <code className="text-amber-300">window.WeddingData</code> : Bütün dəvətnamə parametrlərini saxlayır.
                  </p>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    placeholder="// JavaScript kodunuz"
                    className="w-full h-full p-4 font-mono text-xs bg-stone-900 border border-stone-800 rounded-2xl text-amber-200 focus:border-amber-400 focus:outline-none resize-none leading-relaxed selection:bg-amber-500/30 selection:text-white"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Tab 4: General Template Settings */}
            {activeCodeTab === 'settings' && (
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">Şablonun Adı</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Kateqoriya</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="luxury">Lüks / Elit</option>
                      <option value="classic">Klassik / Qızılı</option>
                      <option value="floral">Gül & Romantik</option>
                      <option value="minimal">Minimal</option>
                      <option value="modern">Müasir & Qeyri-adi</option>
                      <option value="custom">Tam Fərdi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Önizləmə Şəkli (Cover)</label>
                    <input
                      type="url"
                      value={previewImage}
                      onChange={(e) => setPreviewImage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">Təsvir</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">Şablonun Statusu</h4>
                    <p className="text-[11px] text-stone-400">
                      Aktiv olduqda, admin panelində yeni dəvətnamə yaradılarkən bu şablon seçilə bilər.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 bg-stone-950 border-stone-700"
                  />
                </div>
              </div>
            )}

            {/* Tab: Media — envelope image, opening video, background (in this exact order) */}
            {activeCodeTab === 'media' && (
              <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Bu 3 media şablon səviyyəsində təyin olunur — yəni bu şablondan istifadə edən{' '}
                    <strong className="text-stone-200">bütün dəvətnamələr</strong> eyni şəkil/videoları göstərəcək.
                    Doldurulmayan sahələr üçün standart (default) zərf açılışı istifadə olunur. Kodunuzda bu dəyərlərə{' '}
                    <code className="text-amber-300">{'{{closedEnvelopeImage}}'}</code>,{' '}
                    <code className="text-amber-300">{'{{openingVideo}}'}</code>,{' '}
                    <code className="text-amber-300">{'{{backgroundImage}}'}</code> və{' '}
                    <code className="text-amber-300">{'{{backgroundVideo}}'}</code> dəyişənləri ilə də müraciət edə bilərsiniz.
                  </span>
                </div>

                {/* 1. Closed invitation image */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">1</span>
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bağlı Dəvətnamə Şəkli (açılmamış zərf/kart)</span>
                  </label>
                  <input
                    type="url"
                    value={closedEnvelopeImage}
                    onChange={(e) => setClosedEnvelopeImage(e.target.value)}
                    placeholder="https://... (boş buraxsanız standart zərf şəkli istifadə olunur)"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                  />
                  {closedEnvelopeImage && (
                    <img
                      src={closedEnvelopeImage}
                      alt="Bağlı dəvətnamə önizləməsi"
                      className="mt-2 h-24 rounded-xl border border-stone-800 object-cover"
                    />
                  )}
                </div>

                {/* 2. Opening video */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">2</span>
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Açılış Videosu (zərf/kart açılan an)</span>
                  </label>
                  <input
                    type="url"
                    value={openingVideo}
                    onChange={(e) => setOpeningVideo(e.target.value)}
                    placeholder="https://... (.mp4) — boş buraxsanız standart açılış videosu istifadə olunur"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                  />

                  <div className="mt-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-300">Açılma Sürəti</label>
                      <span className="text-[11px] font-mono text-amber-300">{openingVideoSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.25}
                      max={3}
                      step={0.05}
                      value={openingVideoSpeed}
                      onChange={(e) => setOpeningVideoSpeed(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                      <span>0.25x (çox yavaş)</span>
                      <span>1x (normal)</span>
                      <span>3x (çox sürətli)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpeningVideoSpeed(1)}
                      className="mt-2 text-[10px] font-semibold text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      Normal sürətə qaytar (1x)
                    </button>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-300">
                        Videonu Kəs (saniyə)
                      </label>
                      <span className="text-[11px] font-mono text-amber-300">
                        {openingVideoTrimSeconds > 0 ? `${openingVideoTrimSeconds.toFixed(1)}s` : 'Tam video'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={15}
                      step={0.5}
                      value={openingVideoTrimSeconds}
                      onChange={(e) => setOpeningVideoTrimSeconds(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Video uzun olub gec bitirsə, bunu 0-dan yuxarı çəkin — video həmin saniyəyə çatanda
                      (tam bitməsini gözləmədən) əsas dizayna keçid baş verəcək. "Tam video" = kəsmə yoxdur.
                    </p>
                  </div>
                </div>

                {/* 3. Background media */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">3</span>
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Arxa Fon (əsas hissənin arxasında)</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setBackgroundMediaType('image')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        backgroundMediaType === 'image'
                          ? 'bg-amber-500 text-stone-950 border-amber-500'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Şəkil</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBackgroundMediaType('video')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        backgroundMediaType === 'video'
                          ? 'bg-amber-500 text-stone-950 border-amber-500'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>
                  </div>

                  {backgroundMediaType === 'image' ? (
                    <>
                      <input
                        type="url"
                        value={backgroundImage}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        placeholder="https://... (arxa fon şəkli)"
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                      />
                      {backgroundImage && (
                        <img
                          src={backgroundImage}
                          alt="Arxa fon önizləməsi"
                          className="mt-2 h-24 w-full rounded-xl border border-stone-800 object-cover"
                        />
                      )}
                    </>
                  ) : (
                    <input
                      type="url"
                      value={backgroundVideo}
                      onChange={(e) => setBackgroundVideo(e.target.value)}
                      placeholder="https://... (.mp4) — boş buraxsanız standart arxa fon videosu istifadə olunur"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Tab: Colors — quick theme-color management without touching raw CSS */}
            {activeCodeTab === 'colors' && (
              <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Bu rənglər kodun içindəki CSS dəyişənlərinə (<code className="text-amber-300">var(--tpl-...)</code>)
                    bağlıdır — CSS yazmadan bütün dizaynın rəng palitrasını burdan dəyişə bilərsiniz. Dəyişiklik
                    "Önizləmə" tabında dərhal görünür.
                  </span>
                </div>

                {[
                  { label: 'Fon Rəngi', hint: 'Əsas arxa fon (məs. bağlı zərf ekranı)', value: colorBackground, set: setColorBackground },
                  { label: 'Mətn Rəngi', hint: 'Başlıqlar və əsas mətnlər', value: colorText, set: setColorText },
                  { label: 'Aksent Rəngi', hint: 'Düymələr, xətlər, dekorativ elementlər', value: colorAccent, set: setColorAccent },
                  { label: 'Çərçivə Rəngi', hint: 'Bölücü xətlər, incə haşiyələr', value: colorBorder, set: setColorBorder },
                  { label: 'Solğun Mətn Rəngi', hint: 'İkinci dərəcəli, daha aşkar olmayan mətnlər', value: colorMuted, set: setColorMuted },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={row.value}
                        onChange={(e) => row.set(e.target.value)}
                        className="w-11 h-11 rounded-xl border border-stone-800 bg-transparent cursor-pointer p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-semibold text-stone-200">{row.label}</label>
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => row.set(e.target.value)}
                          spellCheck={false}
                          className="w-24 px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">{row.hint}</p>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setColorBackground('#f4f2ee');
                    setColorText('#211f1b');
                    setColorAccent('#d4af37');
                    setColorBorder('#d8d3c8');
                    setColorMuted('#9a9282');
                  }}
                  className="text-[11px] font-semibold text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Standart rənglərə qaytar
                </button>
              </div>
            )}

            {/* Tab 5: Starters & Boilerplates */}
            {activeCodeTab === 'starters' && (
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="text-sm font-bold text-stone-100">Hazır Başlanğıc Şablonları</h3>
                  <p className="text-xs text-stone-400">
                    İstənilən şablonu seçərək dərhal üzərində HTML, CSS və JS dəyişiklikləri apara bilərsiniz.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {CUSTOM_TEMPLATE_STARTERS.map((starter) => (
                    <div
                      key={starter.id}
                      className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-amber-300">{starter.name}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {starter.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLoadStarter(starter.id)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
                      >
                        Bu Kodu Yüklə və Redaktə Et
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Real-time Live Preview */}
          {showLivePreview && (
            <div className="w-full md:w-[45%] lg:w-[48%] bg-stone-950 flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-semibold text-stone-300">Canlı Baxış (Nümunə Məlumatla)</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {previewDevice === 'mobile' ? '390 x 844 (Mobil)' : 'Geniş Ekran'}
                </span>
              </div>

              <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex items-center justify-center bg-stone-950/80">
                <div
                  className={`transition-all duration-300 bg-black rounded-3xl overflow-hidden shadow-2xl border border-stone-800 ${
                    previewDevice === 'mobile'
                      ? 'w-full max-w-[390px] min-h-[680px] my-auto'
                      : 'w-full h-full min-h-[500px]'
                  }`}
                >
                  <CustomCodeTemplate
                    invitation={sampleInvitation}
                    template={previewTemplateObj}
                    isGuestMode={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
