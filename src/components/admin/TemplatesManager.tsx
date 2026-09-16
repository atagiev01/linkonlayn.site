import React, { useState } from 'react';
import { Template, Invitation } from '../../types';
import { Plus, Trash2, Eye, Sliders, Code2, Copy } from 'lucide-react';
import { TemplateCustomizerModal } from '../../templates/TemplateCustomizerModal';
import { CustomTemplateCodeEditorModal } from '../../templates/CustomTemplateCodeEditorModal';
import { CUSTOM_TEMPLATE_STARTERS } from '../../data/customTemplateStarters';

interface TemplatesManagerProps {
  templates: Template[];
  onSaveTemplate: (tpl: Template) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  onPreviewTemplate: (templateId: string) => void;
}

export const TemplatesManager: React.FC<TemplatesManagerProps> = ({
  templates,
  onSaveTemplate,
  onDeleteTemplate,
  onPreviewTemplate,
}) => {
  const [selectedStandardTemplate, setSelectedStandardTemplate] = useState<Template | null>(null);
  const [selectedCustomCodeTemplate, setSelectedCustomCodeTemplate] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async (tpl: Template) => {
    await onSaveTemplate({
      ...tpl,
      active: !tpl.active,
      updatedAt: new Date().toISOString(),
    });
  };

  // Create brand new Custom HTML/CSS/JS Template
  const handleCreateCustomCodeTemplate = () => {
    const starter = CUSTOM_TEMPLATE_STARTERS[0];
    const newCustomTpl: Template = {
      id: 'custom-code-' + Date.now().toString(36),
      name: 'Fərdi HTML/CSS/JS Şablonu',
      description: 'Fərdi HTML strukturu, CSS stilləri və JavaScript məntiqi ilə yaradılmış yeni şablon.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      templatePath: 'templates/custom-code',
      category: 'modern',
      active: true,
      isCustomCode: true,
      customHtml: starter.html,
      customCss: starter.css,
      customJs: starter.js,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themeConfig: {
        primaryColor: '#c89b3f',
        accentColor: '#1c1917',
        customCss: '',
      },
    };
    setSelectedCustomCodeTemplate(newCustomTpl);
  };

  // Create Standard Preset Template
  const handleCreateStandardTemplate = () => {
    const newTpl: Template = {
      id: 'template-' + Date.now().toString(36),
      name: 'Yeni Toy Şablonu',
      description: 'Fərdiləşdirilmiş yeni rəqəmsal toy dəvətnaməsi dizaynı.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      templatePath: 'templates/custom',
      category: 'floral',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themeConfig: {
        primaryColor: '#c89b3f',
        accentColor: '#1c1917',
        customCss: '',
      },
    };
    setSelectedStandardTemplate(newTpl);
  };

  // Duplicate template as custom code
  const handleDuplicateAsCustomCode = (tpl: Template) => {
    const starter = CUSTOM_TEMPLATE_STARTERS[0];
    const cloned: Template = {
      ...tpl,
      id: 'custom-' + Date.now().toString(36),
      name: `${tpl.name} (Fərdi Kod Kopiyası)`,
      isCustomCode: true,
      customHtml: tpl.customHtml || starter.html,
      customCss: tpl.customCss || tpl.themeConfig?.customCss || starter.css,
      customJs: tpl.customJs || starter.js,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedCustomCodeTemplate(cloned);
  };

  return (
    <div id="templates-manager-container" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <span>Şablon İdarəetməsi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              {templates.length} şablon
            </span>
          </h2>
          <p className="text-xs text-stone-400">
            Dəvətnamə şablonlarını idarə edin, sıfırdan <strong>Fərdi HTML/CSS/JS</strong> şablonları yaradın və ya mövcud şablonları fərdiləşdirin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="add-custom-code-template-btn"
            onClick={handleCreateCustomCodeTemplate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>+ Fərdi HTML / CSS / JS Şablon</span>
          </button>

          <button
            id="add-standard-template-btn"
            onClick={handleCreateStandardTemplate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Standart Şablon</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tpl) => {
          const isCustom = tpl.isCustomCode || !!tpl.customHtml || tpl.id.startsWith('custom');

          return (
            <div
              key={tpl.id}
              className={`rounded-3xl bg-stone-900/90 border transition-all flex flex-col overflow-hidden shadow-xl ${
                isCustom
                  ? 'border-blue-500/40 hover:border-blue-400'
                  : 'border-stone-800 hover:border-amber-500/30'
              }`}
            >
              {/* Template Preview Image */}
              <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden group">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>

                {/* Status & Code Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(tpl)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md transition-all ${
                      tpl.active
                        ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                        : 'bg-stone-800/90 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {tpl.active ? 'Aktiv' : 'Deaktiv'}
                  </button>

                  {isCustom && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-md flex items-center gap-1 font-mono shadow-md">
                      <Code2 className="w-3 h-3" />
                      <span>HTML/CSS/JS</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-stone-100">
                  <h3 className="text-base font-bold truncate">{tpl.name}</h3>
                  <span className="text-[10px] font-mono text-amber-300 capitalize">
                    {tpl.category} Theme
                  </span>
                </div>
              </div>

              {/* Description & Attributes */}
              <div className="p-4 flex-1 space-y-3 text-xs">
                <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Features & Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {isCustom ? (
                    <>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono">
                        Fərdi HTML
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                        Fərdi CSS
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                        JavaScript API
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-stone-500">Rənglər:</span>
                      <span
                        className="w-4 h-4 rounded-full border border-stone-700"
                        style={{ backgroundColor: tpl.themeConfig?.primaryColor || '#c89b3f' }}
                        title="Əsas rəng"
                      ></span>
                      <span
                        className="w-4 h-4 rounded-full border border-stone-700"
                        style={{ backgroundColor: tpl.themeConfig?.accentColor || '#1c1917' }}
                        title="Vurğu rəngi"
                      ></span>
                      {tpl.themeConfig?.customCss && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          CSS Var
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-stone-950/80 border-t border-stone-800/80 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onPreviewTemplate(tpl.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Önizlə</span>
                </button>

                {/* Edit Button: Custom code editor vs standard customizer */}
                {isCustom ? (
                  <button
                    onClick={() => setSelectedCustomCodeTemplate(tpl)}
                    className="flex items-center gap-1 py-2 px-3 rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
                    title="HTML/CSS/JS Kodunu Redaktə Et"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Kod</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedStandardTemplate(tpl)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                    title="Tənzimlə və Dizayn ver"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Duplicate as Custom Code Template */}
                <button
                  onClick={() => handleDuplicateAsCustomCode(tpl)}
                  className="p-2 rounded-xl bg-stone-800/60 text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
                  title="Fərdi Kod Şablonuna Çevir və Kopyala"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => setTemplateToDelete(tpl)}
                  className="p-2 rounded-xl bg-stone-800/60 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Şablonu silmək istəyirsiniz?</h3>
            <p className="text-sm text-stone-400 text-center mb-6 leading-relaxed">
              <strong className="text-stone-200">"{templateToDelete.name}"</strong> şablonu tamamilə silinəcək və siyahıdan çıxarılacaq. Bu əməliyyat geri qaytarıla bilməz.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setTemplateToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition-colors disabled:opacity-50"
              >
                İmtina
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await onDeleteTemplate(templateToDelete.id);
                  } finally {
                    setIsDeleting(false);
                    setTemplateToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Silinir...' : 'Bəli, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Template Customizer Modal */}
      {selectedStandardTemplate && (
        <TemplateCustomizerModal
          template={selectedStandardTemplate}
          isOpen={true}
          onSave={onSaveTemplate}
          onClose={() => setSelectedStandardTemplate(null)}
          onOpenCodeEditor={(tpl) => {
            setSelectedStandardTemplate(null);
            setSelectedCustomCodeTemplate(tpl);
          }}
        />
      )}

      {/* Full Custom HTML/CSS/JS Code Editor Modal */}
      {selectedCustomCodeTemplate && (
        <CustomTemplateCodeEditorModal
          template={selectedCustomCodeTemplate}
          isOpen={true}
          onSave={onSaveTemplate}
          onClose={() => setSelectedCustomCodeTemplate(null)}
        />
      )}
    </div>
  );
};
