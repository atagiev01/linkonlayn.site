import React, { useEffect, useState, Suspense } from 'react';
import { Invitation, Template } from '../../types';
import {
  getInvitationBySlugOrId,
  incrementInvitationViews,
  fetchTemplates,
} from '../../firebase/firestore';
import { DEFAULT_TEMPLATES } from '../../data/initialData';
import { getTemplateSampleInvitation } from '../../data/templateSampleData';
import { getTemplateComponent } from '../../templates/registry';
import { attachWindowAntiTheftGuards } from '../../utils/antiTheftProtection';
import { Heart, AlertCircle, Home } from 'lucide-react';

interface PublicInvitationViewProps {
  slugOrId?: string;
  previewTemplateId?: string | null;
  isPreview?: boolean;
  previewSource?: 'admin' | 'customer';
  onNavigateHome?: () => void;
  onNavigateToCatalog?: () => void;
  contactWhatsAppNumber?: string;
}

function TemplateLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#fbf6ec]">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
    </div>
  );
}

export const PublicInvitationView: React.FC<PublicInvitationViewProps> = ({
  slugOrId = '',
  previewTemplateId = null,
  isPreview = false,
  previewSource = 'admin',
  onNavigateHome,
  onNavigateToCatalog,
  contactWhatsAppNumber = '994501234567',
}) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Activate window-level anti-theft and right-click protection for public invitation views
  useEffect(() => {
    return attachWindowAntiTheftGuards();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const allTemplates = await fetchTemplates();
        if (!isMounted) return;

        // MODE 1: TEMPLATE SHOWCASE / PREVIEW MODE (Always purely demo data, separate from real customers)
        if (previewTemplateId) {
          const targetTemplate =
            allTemplates.find((t) => t.id === previewTemplateId) ||
            DEFAULT_TEMPLATES.find((t) => t.id === previewTemplateId);

          if (!targetTemplate) {
            setError(`"${previewTemplateId}" ID-li şablon tapılmadı.`);
            setIsLoading(false);
            return;
          }

          // Dedicated clean template sample data - NEVER uses or modifies real customer invitations!
          const sampleInv = getTemplateSampleInvitation(targetTemplate);

          setTemplate(targetTemplate);
          setInvitation(sampleInv);
          setIsLoading(false);
          return;
        }

        // MODE 2: REAL CUSTOMER INVITATION (e.g. /invite/:slug)
        if (!slugOrId) {
          setError('Dəvətnamə linki qeyd olunmayıb.');
          setIsLoading(false);
          return;
        }

        const inv = await getInvitationBySlugOrId(slugOrId);
        if (!isMounted) return;

        if (!inv) {
          setError(`"${slugOrId}" ünvanlı dəvətnamə tapılmadı.`);
          setIsLoading(false);
          return;
        }

        if (!inv.active && !isPreview) {
          setError('Bu dəvətnamə hazırda qeyri-aktivdir.');
          setIsLoading(false);
          return;
        }

        setInvitation(inv);

        // Fetch matched template for this real customer invitation
        const foundTemplate =
          allTemplates.find((t) => t.id === inv.templateId) ||
          DEFAULT_TEMPLATES.find((t) => t.id === inv.templateId) ||
          allTemplates[0] ||
          DEFAULT_TEMPLATES[0];

        setTemplate(foundTemplate);

        // Increment views counter if not admin preview
        if (!isPreview) {
          const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
          let device: 'mobile' | 'desktop' | 'tablet' = 'desktop';
          if (/iPad|Tablet/i.test(ua)) {
            device = 'tablet';
          } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
            device = 'mobile';
          }

          let browser = 'Chrome';
          if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari (iPhone/Mac)';
          else if (/Firefox/i.test(ua)) browser = 'Firefox';
          else if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
          else if (/Chrome/i.test(ua)) browser = 'Google Chrome';

          incrementInvitationViews(inv.id, inv.slug, { device, browser });
        }

        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error loading public invitation:', err);
        setError('Dəvətnamə yüklənərkən xəta baş verdi.');
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slugOrId, previewTemplateId, isPreview]);

  if (isLoading) {
    return (
      <div id="invitation-loading-view" className="min-h-screen bg-[#0f0e0c] flex flex-col items-center justify-center text-center p-4 text-[#f7f2e7]">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-serif text-amber-200 mb-1">Dəvətnamə Yüklənir...</h2>
        <p className="text-xs text-stone-400">Zəhmət olmasa bir an gözləyin</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div id="invitation-error-view" className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-center p-6 text-stone-100">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-100 mb-2">Dəvətnamə Tapılmadı</h2>
        <p className="text-sm text-stone-400 max-w-md mb-6">{error || 'Göstərilən link düzgün deyil və ya dəvətnamə silinib.'}</p>
        
        {onNavigateHome && (
          <button
            id="go-back-home-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Ana Səhifəyə Qayıt</span>
          </button>
        )}
      </div>
    );
  }

  const activeTpl = template || {
    id: invitation.templateId,
    name: 'Template',
    description: '',
    previewImage: '',
    templatePath: '',
    category: 'classic',
    active: true,
    createdAt: '',
    updatedAt: '',
  };

  const TemplateComponent = getTemplateComponent(activeTpl.id, activeTpl);

  return (
    <div className="relative min-h-screen bg-stone-950">
      {/* Injected custom CSS if template has custom styles */}
      {activeTpl.themeConfig?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: activeTpl.themeConfig.customCss }} />
      )}

      {/* Guest-facing render — no preview toolbar or back button, ever */}
      <Suspense fallback={<TemplateLoadingFallback />}>
        <TemplateComponent
          invitation={invitation}
          template={activeTpl}
          isGuestMode={!isPreview}
        />
      </Suspense>
    </div>
  );
};
