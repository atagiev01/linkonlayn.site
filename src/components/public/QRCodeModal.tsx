import React from 'react';
import { X, QrCode, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface QRCodeModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);

  // High quality dynamic QR code image via standard secure QR API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    url
  )}&bgcolor=ffffff&color=1c1917&margin=10`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Sizi toy mərasimimizə dəvət edirik! 💍✨\n\nRəqəmsal dəvətnamə linki:\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      id="qr-code-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="qr-code-modal-content"
        className="relative w-full max-w-sm bg-stone-900 border border-amber-500/30 rounded-3xl p-6 text-stone-100 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="qr-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-serif font-bold text-amber-200 mb-1">{title}</h3>
        <p className="text-xs text-stone-400 mb-5">
          Qonaqlar kameranı QR koda yaxınlaşdıraraq dəvətnaməni dərhal aça bilərlər.
        </p>

        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-5 border-4 border-amber-400/30">
          <img
            src={qrApiUrl}
            alt="Wedding Invitation QR Code"
            className="w-52 h-52 object-contain mx-auto"
          />
        </div>

        {/* Link Input & Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-1.5 bg-stone-950 border border-stone-800 rounded-xl">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-transparent px-2 text-xs text-stone-300 focus:outline-none truncate"
            />
            <button
              id="qr-copy-link-btn"
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 text-xs font-semibold hover:bg-amber-400 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              id="qr-whatsapp-share-btn"
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp-la Paylaş</span>
            </button>
            <a
              id="qr-open-new-tab-btn"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Linki Aç</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
