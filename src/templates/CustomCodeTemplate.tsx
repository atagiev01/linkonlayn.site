import React, { useEffect, useState, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TemplateRenderProps } from './types';
import { MusicPlayer } from '../components/public/MusicPlayer';
import { QRCodeModal } from '../components/public/QRCodeModal';
import { QrCode } from 'lucide-react';
import { buildStandaloneHtmlDocument } from '../utils/htmlTemplateParser';
import { attachWindowAntiTheftGuards } from '../utils/antiTheftProtection';
import { CUSTOM_TEMPLATE_STARTERS } from '../data/customTemplateStarters';

export const CustomCodeTemplate: React.FC<TemplateRenderProps> = ({
  invitation,
  template,
  isGuestMode = true,
}) => {
  const [showQR, setShowQR] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper to sanitize phone for WhatsApp
  const getCleanPhone = (phone?: string): string => {
    if (!phone) return '994501234567';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.startsWith('994')) return digitsOnly;
    if (digitsOnly.startsWith('0')) return '994' + digitsOnly.slice(1);
    if (digitsOnly.length === 9) return '994' + digitsOnly;
    return digitsOnly || '994501234567';
  };

  const phoneToUse = getCleanPhone(invitation.contactPhone);

  const handleSendAttending = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#eab308', '#ec4899'],
    });

    const msg = `Salam! ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər və xoşbəxtliklər arzulayıram! 🎉`;
    window.open(`https://wa.me/${phoneToUse}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSendDeclined = () => {
    const msg = `Salam! Təəssüf ki, ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində iştirak edə bilməyəcəyəm. Sizə bir ömür boyu səadət və xoşbəxtlik arzulayıram! 💐`;
    window.open(`https://wa.me/${phoneToUse}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Format date helper
  const formattedDate = useMemo(() => {
    try {
      const d = new Date(invitation.weddingDate);
      return d.toLocaleDateString('az-AZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return invitation.weddingDate;
    }
  }, [invitation.weddingDate]);

  // Google Map URL
  const mapUrl =
    invitation.mapCoordinates?.mapUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${invitation.venue}, ${invitation.address || ''} ${invitation.city || ''}`)}`;

  // Build full standalone HTML document for the isolated iframe
  const standaloneHtml = useMemo(() => {
    // Find starter fallback if template's customHtml is blank
    const fallbackStarter =
      template.id === 'custom-modern-gold'
        ? CUSTOM_TEMPLATE_STARTERS[1] || CUSTOM_TEMPLATE_STARTERS[0]
        : CUSTOM_TEMPLATE_STARTERS[0];

    const rawHtml = template.customHtml?.trim() || fallbackStarter.html;
    const rawCss = template.customCss || fallbackStarter.css;
    const rawJs = template.customJs || fallbackStarter.js;

    return buildStandaloneHtmlDocument({
      html: rawHtml,
      css: rawCss,
      js: rawJs,
      invitation,
      formattedDate,
      mapUrl,
      templateMedia: {
        closedEnvelopeImage: template.closedEnvelopeImage,
        openingVideo: template.openingVideo,
        openingVideoSpeed: template.openingVideoSpeed,
        openingVideoTrimSeconds: template.openingVideoTrimSeconds,
        backgroundMediaType: template.backgroundMediaType,
        backgroundImage: template.backgroundImage,
        backgroundVideo: template.backgroundVideo,
      },
      templateColors: template.customColors,
    });
  }, [
    template.id,
    template.customHtml,
    template.customCss,
    template.customJs,
    template.closedEnvelopeImage,
    template.openingVideo,
    template.openingVideoSpeed,
    template.openingVideoTrimSeconds,
    template.backgroundMediaType,
    template.backgroundImage,
    template.backgroundVideo,
    template.customColors,
    invitation,
    formattedDate,
    mapUrl,
  ]);

  // Attach Anti-Theft guards on window level
  useEffect(() => {
    return attachWindowAntiTheftGuards();
  }, []);

  // Listen for actions sent from inside the iframe (e.g. window.InvitationApp.openRSVP())
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OPEN_RSVP') {
        handleSendAttending();
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [phoneToUse, invitation.groomName, invitation.brideName]);

  return (
    <div id="custom-code-template-root" className="w-full h-screen relative overflow-hidden bg-stone-950 font-sans">
      {/* Floating Music Player if available and specified (excluding templates with built-in custom audio controls like custom-video-envelope) */}
    

      {/* Render isolated iframe for full HTML/CSS/JS fidelity */}
      <iframe
        ref={iframeRef}
        title={template.name || 'Dəvətnamə'}
        srcDoc={standaloneHtml}
        className="w-full h-full border-0 block bg-transparent"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
        allow="autoplay; fullscreen; accelerometer; gyroscope"
      />

      {/* Floating Bottom Quick Actions (discreet QR and WhatsApp share) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900/90 text-amber-400 hover:text-amber-300 border border-amber-500/40 shadow-xl backdrop-blur-md cursor-pointer text-xs font-semibold hover:scale-105 transition-all"
          title="QR Kod və Paylaş"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">QR Kod</span>
        </button>

 
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeModal
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={`${invitation.brideName} & ${invitation.groomName} Dəvətnaməsi`}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};
