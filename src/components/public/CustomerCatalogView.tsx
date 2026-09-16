import React, { useState, useEffect, useRef } from 'react';
import { Template } from '../../types';
import {
  Sparkles,
  Eye,
  Check,
  MessageCircle,
  MapPin,
  Music,
  Calendar,
  Heart,
  Film,
  Compass,
  CheckCircle2,
  Lock,
  Star,
  Users,
} from 'lucide-react';
import { attachWindowAntiTheftGuards } from '../../utils/antiTheftProtection';

interface CustomerCatalogViewProps {
  templates: Template[];
  onPreviewTemplate: (templateId: string, deviceMode?: 'mobile' | 'desktop') => void;
  onNavigateToAdmin: () => void;
  contactWhatsAppNumber?: string;
}

export const CustomerCatalogView: React.FC<CustomerCatalogViewProps> = ({
  templates,
  onPreviewTemplate,
  onNavigateToAdmin,
  contactWhatsAppNumber = '994501234567',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Drives the mobile sticky CTA bar: hidden while the hero (with its own
  // big CTA) is on screen, revealed once the visitor has scrolled past it —
  // keeps a path to conversion visible at all times without cluttering the
  // hero itself.
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);

  // Same code/image/right-click protection used on invitation pages, applied
  // to the public marketing & catalog site too. Never active on /admin.
  useEffect(() => {
    return attachWindowAntiTheftGuards();
  }, []);

  useEffect(() => {
    const el = heroSentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeTemplates = templates.filter((t) => t.active);

  const categories = [
    { id: 'all', label: 'Bütün Şablonlar', count: activeTemplates.length },
    {
      id: 'video',
      label: 'Video Zərf & 3D',
      count: activeTemplates.filter(
        (t) =>
          t.id.includes('video') ||
          t.id.includes('envelope') ||
          t.category === 'luxury' ||
          t.name.toLowerCase().includes('video')
      ).length,
    },
    {
      id: 'luxury',
      label: 'Lüks & Qızılı',
      count: activeTemplates.filter((t) => t.category === 'luxury').length,
    },
    {
      id: 'floral',
      label: 'Floral & Təbii Gül',
      count: activeTemplates.filter((t) => t.category === 'floral').length,
    },
    {
      id: 'minimal',
      label: 'Minimalist & Zərif',
      count: activeTemplates.filter((t) => t.category === 'minimal').length,
    },
    {
      id: 'classic',
      label: 'Klassik & Romantik',
      count: activeTemplates.filter((t) => t.category === 'classic').length,
    },
  ];

  const filteredTemplates = activeTemplates.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'video') {
      return (
        tpl.id.includes('video') ||
        tpl.id.includes('envelope') ||
        tpl.name.toLowerCase().includes('video') ||
        tpl.description.toLowerCase().includes('video')
      );
    }
    return tpl.category === selectedCategory;
  });

  const handleOrderWhatsApp = (template: Template) => {
    const message = encodeURIComponent(
      `Salam! "${template.name}" şablonu ilə onlayn toy dəvətnaməsi sifariş etmək istəyirəm. Zəhmət olmasa qiymət və şərtləri bildirərdiniz.`
    );
    window.open(`https://wa.me/${contactWhatsAppNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white pb-16 md:pb-0">
      {/* Top Client Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-neutral-900 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-serif font-semibold text-neutral-900 tracking-tight block truncate">
              Dəvətnamə.az
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-[0.15em] uppercase block truncate">
              Müasir Onlayn Toy Dəvətnamələri
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] text-neutral-500 font-medium">
          <a href="#templates" className="hover:text-neutral-900 transition-colors">
            Şablonlar Kataloqu
          </a>
          <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">
            Necə Sifariş Edilir?
          </a>
          <a href="#features" className="hover:text-neutral-900 transition-colors">
            Üstünlüklər
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a
            href={`https://wa.me/${contactWhatsAppNumber}?text=${encodeURIComponent('Salam! Toy dəvətnaməsi sifarişi barədə məlumat almaq istəyirəm.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp ilə Əlaqə</span>
            <span className="sm:hidden">Sifariş</span>
          </a>

          <button
            onClick={onNavigateToAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 border border-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            title="İdarəetmə Panelinə Giriş (Admin)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Girişi</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-8 border-b border-neutral-200">
        <div className="max-w-3xl mx-auto text-center space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 text-neutral-500 text-[11px] font-medium tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 İnteraktiv Dəvətnamə Kolleksiyası</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-medium text-neutral-900 tracking-tight leading-[1.12] sm:leading-[1.08]">
            Qonaqlarınızı Heyran Edəcək
            <br />
            <span className="italic font-light text-neutral-400">Müasir Toy Dəvətnamələri</span>
          </h1>

          <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Açılan video zərf effekti, romantik fon musiqisi, onlayn RSVP qonaq təsdiqi və bir kliklə Waze / Google
            Xəritə naviqasiyası. Bəyəndiyiniz şablonu seçin, canlı yoxlayın və 1 saatda hazır linkinizi qonaqlara
            göndərin.
          </p>

          <div className="pt-2">
            <a
              href="#templates"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-medium tracking-wide transition-colors"
            >
              <span>Şablonlara Bax</span>
            </a>
          </div>

          {/* Social proof strip — leverages trust/social-proof bias right under the primary CTA */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-500 font-medium">
            <div className="flex -space-x-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-5 h-5 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[9px] text-neutral-500"
                >
                  ♥
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>500+ cütlük artıq bizi seçib</span>
            </span>
          </div>

          {/* Value Highlights */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs text-neutral-400 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Hərəkətli Video Zərf</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>RSVP Qonaq Təsdiqi</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Waze & Google Xəritə</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Romantik Fon Musiqisi</span>
            </span>
          </div>
        </div>
        {/* Invisible sentinel: once this scrolls out of view, the mobile sticky CTA bar appears */}
        <div ref={heroSentinelRef} className="h-px w-full" />
      </section>

      {/* Main Template Catalog Section */}
      <section id="templates" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1 space-y-10">
        {/* Section Header & Categories */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900 flex flex-wrap items-center gap-3">
              <span>Şablon Kataloqu</span>
              <span className="text-[11px] px-2.5 py-1 rounded-full border border-neutral-200 text-neutral-400 font-sans font-medium tracking-wide">
                {activeTemplates.length} Hazır Dizayn
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Bəyəndiyiniz şablonun üzərinə klikləyərək canlı mobil rejimdə sınaqdan keçirin.
            </p>
          </div>

          {/* Category Filter Pills — horizontally scrollable on small screens so
              chips never wrap into a cramped multi-row block on 320–414px phones */}
          <div className="w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 w-max md:w-auto md:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white hover:border-neutral-400 text-neutral-500 border-neutral-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count > 0 && (
                    <span
                      className={`ml-1.5 text-[10px] ${
                        selectedCategory === cat.id ? 'text-white/60' : 'text-neutral-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-neutral-200 rounded-2xl">
            <Sparkles className="w-6 h-6 text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-600">Bu kateqoriyada hələ şablon yoxdur</p>
            <p className="text-xs text-neutral-400 mt-1 mb-4">Başqa kateqoriyaya baxın və ya bütün şablonları görün.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-medium transition-colors active:scale-95"
            >
              Bütün Şablonlara Bax
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => {
            const isVideoTemplate =
              template.id.includes('video') ||
              template.id.includes('envelope') ||
              template.name.toLowerCase().includes('video');

            return (
              <div
                key={template.id}
                className="group relative bg-white border border-neutral-200 hover:border-neutral-900 hover:-translate-y-1 hover:shadow-xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
              >
                {/* Image Banner / Preview */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-neutral-100 cursor-pointer"
                  onClick={() => onPreviewTemplate(template.id)}
                >
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {isVideoTemplate && (
                      <span className="px-2.5 py-1 rounded-full bg-white text-neutral-900 font-medium text-[10px] flex items-center gap-1 tracking-wide">
                        <Film className="w-3 h-3" />
                        <span>Hərəkətli Video Zərf</span>
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase tracking-wide font-medium">
                      {template.category}
                    </span>
                  </div>

                  {/* Quick Preview Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate(template.id);
                      }}
                      className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-medium text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer tracking-wide"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Canlı Önizlə</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-base font-serif font-semibold text-neutral-900 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-neutral-500 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-neutral-400" />
                      <span>RSVP Təsdiq Formu</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>Google Xəritə</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Music className="w-3 h-3 text-neutral-400" />
                      <span>Musiqi Pleyeri</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>Geri Sayım Sayğacı</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex items-center gap-2 border-t border-neutral-100">
                    <button
                      onClick={() => onPreviewTemplate(template.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-900 text-neutral-700 text-xs font-medium transition-all active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Canlı Önizlə</span>
                    </button>

                    <button
                      onClick={() => handleOrderWhatsApp(template)}
                      className="flex-[1.3] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Sifariş Et</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.2em]">
              Sadə Və Sürətli Proses
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-medium text-neutral-900">
              3 Sadə Addımda Onlayn Dəvətnaməniz Hazırdır
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Kağız çapı üçün günlərlə gözləməyə ehtiyac yoxdur. Hər şey birbaşa smartfonunuzda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="p-7 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full border border-neutral-200 text-neutral-400 flex items-center justify-center font-serif font-medium text-base">
                1
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Şablonu Seçin və Canlı Baxın</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kataloqdan zövqünüzə uyğun dizaynı seçin, mobil görünüşdə zərfin açılışını və musiqini test edin.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full border border-neutral-200 text-neutral-400 flex items-center justify-center font-serif font-medium text-base">
                2
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Məlumatlarınızı Göndərin</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Bəy və gəlin adları, toy tarixi, saatı, restoran ünvanı və istədiyiniz musiqini WhatsApp vasitəsilə
                bizə göndərin.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full border border-neutral-200 text-neutral-400 flex items-center justify-center font-serif font-medium text-base">
                3
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Linkinizi Qonaqlara Paylaşın</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fərdi dəvətnamə linkinizi (məsələn: devetname.az/fuad-ve-ayten) WhatsApp, Instagram və ya SMS ilə
                limitsiz sayda qonağa göndərin!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-8 border-t border-neutral-200 max-w-5xl mx-auto w-full space-y-8 sm:space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
            Niyə Onlayn Dəvətnamə Seçməlisiniz?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">Müasir toyların ən rahat və qənaətcil trendi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-6 rounded-2xl border border-neutral-200 space-y-2">
            <div className="text-neutral-900 font-serif font-medium text-lg">70% Qənaət</div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              Yüzlərlə kağız zərf və bahalı çap xərclərini unudun, büdcənizə qənaət edin.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 space-y-2">
            <div className="text-neutral-900 font-serif font-medium text-lg">Bir Toxunuşla Naviqasiya</div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              Qonaqlar restoranı axtarmır, birbaşa Waze və ya Google Maps ilə ünvana çatır.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 space-y-2">
            <div className="text-neutral-900 font-serif font-medium text-lg">Real Vaxtda RSVP</div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              Kimlərin gələcəyini, kimlərin üzrlü olduğunu sistemdə dəqiq görün.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 space-y-2">
            <div className="text-neutral-900 font-serif font-medium text-lg">Musiqi & Animasiya</div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              Hissləri canlandıran musiqi və interaktiv zərf açılışı qonaqları heyran qoyacaq.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>© 2026 Dəvətnamə.az • Müasir Onlayn Toy Dəvətnamələri Platforması</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${contactWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Dəstək</span>
            </a>

            <button
              onClick={onNavigateToAdmin}
              className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>İdarəetmə Paneli (Admin)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA bar — appears once the hero (with its own large
          CTA) scrolls out of view, so a path to conversion ("Sifariş Et") is
          always one tap away instead of requiring a long scroll back up. */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center gap-3 transition-transform duration-300 ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-neutral-900 truncate">Bəyəndiyiniz şablonu seçdiniz?</p>
          <p className="text-[10px] text-neutral-400 truncate">1 saatda hazır linkinizi göndərək</p>
        </div>
        <a
          href={`https://wa.me/${contactWhatsAppNumber}?text=${encodeURIComponent('Salam! Toy dəvətnaməsi sifarişi barədə məlumat almaq istəyirəm.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-700 active:scale-95 text-white text-xs font-semibold transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Sifariş Et</span>
        </a>
      </div>
    </div>
  );
};
