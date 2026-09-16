import React, { useState } from 'react';
import { Template } from '../types';
import { X, Code, Palette, Layout, Sliders, Code2 } from 'lucide-react';

interface TemplateCustomizerModalProps {
  template: Template | null;
  isOpen: boolean;
  onSave: (updatedTemplate: Template) => Promise<void>;
  onClose: () => void;
  onOpenCodeEditor?: (template: Template) => void;
}

export const TemplateCustomizerModal: React.FC<TemplateCustomizerModalProps> = ({
  template,
  isOpen,
  onSave,
  onClose,
  onOpenCodeEditor,
}) => {
  if (!isOpen || !template) return null;

  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [previewImage, setPreviewImage] = useState(template.previewImage);
  const [category, setCategory] = useState(template.category);
  const [active, setActive] = useState(template.active);
  const [primaryColor, setPrimaryColor] = useState(template.themeConfig?.primaryColor || '#c89b3f');
  const [accentColor, setAccentColor] = useState(template.themeConfig?.accentColor || '#1c1917');
  const [customCss, setCustomCss] = useState(template.themeConfig?.customCss || '');
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'css'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: Template = {
        ...template,
        name,
        description,
        previewImage,
        category,
        active,
        updatedAt: new Date().toISOString(),
        themeConfig: {
          ...template.themeConfig,
          primaryColor,
          accentColor,
          customCss,
        },
      };
      await onSave(updated);
      setIsSaving(false);
      onClose();
    } catch (e) {
      console.error('Save template customizer error:', e);
      setIsSaving(false);
    }
  };

  return (
    <div
      id="template-customizer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="template-customizer-content"
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl text-stone-100 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-800 bg-stone-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-stone-100 truncate">{template.name} Şablonunu Tənzimlə</h3>
              <p className="text-[11px] text-stone-400 font-mono truncate">ID: {template.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {onOpenCodeEditor && (
              <button
                type="button"
                onClick={() => onOpenCodeEditor(template)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap"
                title="Tam HTML / CSS / JS kod redaktoruna keç"
              >
                <Code2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">HTML/CSS/JS Redaktoru</span>
                <span className="sm:hidden">Kod Redaktoru</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 flex-shrink-0 rounded-xl bg-stone-800 text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex overflow-x-auto border-b border-stone-800 bg-stone-950 px-4 sm:px-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'general'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Əsas Məlumatlar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'design'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Rənglər & Palitra</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'css'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Fərdi CSS & Dizayn</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Şablonun Adı</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Kateqoriya</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="classic">Klassik / Qızılı</option>
                  <option value="floral">Gül / Romantik</option>
                  <option value="luxury">Lüks / Elit</option>
                  <option value="minimal">Minimal / Skandinav</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Önizləmə Şəkli URL</label>
                <input
                  type="url"
                  value={previewImage}
                  onChange={(e) => setPreviewImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Təsvir</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="tpl-active-check"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700"
                />
                <label htmlFor="tpl-active-check" className="text-xs font-semibold text-stone-300">
                  Şablon aktivdir (Dəvətnamə yaradılarkən seçilə bilər)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Əsas Rəng (Primary)</label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950 border border-stone-800">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Vurğu Rəngi (Accent)</label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950 border border-stone-800">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono">{accentColor}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-400">
                <p className="font-semibold text-stone-200 mb-1">Rəng Uyğunluğu:</p>
                Bu şablonu seçən bütün dəvətnamələr təyin olunmuş əsas və vurğu rəng tonları ilə nümayiş olunacaq.
              </div>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs text-stone-400 mb-1 flex items-center justify-between">
                  <span>Xüsusi CSS Kodları (Custom CSS Injection)</span>
                  <span className="text-[10px] text-amber-400 font-mono">Dizayner Rejimi</span>
                </label>
                <textarea
                  rows={8}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder={`/* Məsələn: */\n.wedding-header { letter-spacing: 0.2em; }\n.gold-border { border-color: ${primaryColor}; }`}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-stone-950 border border-stone-800 text-amber-300 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Burada yazdığınız xüsusi CSS qaydaları dəvətnamə açılanda birbaşa DOM-a tətbiq olunur.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-800 text-stone-400 text-xs font-semibold hover:bg-stone-800 hover:text-white"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSaving ? 'Saxlanılır...' : 'Tənzimləmələri Saxla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
