import React, { useState } from 'react';
import { Invitation, Template } from '../../types';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  QrCode,
  Eye,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Music,
} from 'lucide-react';
import { QRCodeModal } from '../public/QRCodeModal';
import { ViewLogsModal } from './ViewLogsModal';

interface InvitationsManagerProps {
  invitations: Invitation[];
  templates: Template[];
  onOpenCreate: () => void;
  onEditInvitation: (inv: Invitation) => void;
  onDeleteInvitation: (id: string) => Promise<void>;
  onToggleActive: (inv: Invitation) => Promise<void>;
  onPreviewInvitation: (inv: Invitation) => void;
}

export const InvitationsManager: React.FC<InvitationsManagerProps> = ({
  invitations,
  templates,
  onOpenCreate,
  onEditInvitation,
  onDeleteInvitation,
  onToggleActive,
  onPreviewInvitation,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalData, setQrModalData] = useState<{ url: string; title: string } | null>(null);
  const [selectedViewLogsInv, setSelectedViewLogsInv] = useState<Invitation | null>(null);
  const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const filtered = invitations.filter((inv) => {
    const matchSearch =
      inv.groomName.toLowerCase().includes(search.toLowerCase()) ||
      inv.brideName.toLowerCase().includes(search.toLowerCase()) ||
      inv.slug.toLowerCase().includes(search.toLowerCase()) ||
      inv.venue.toLowerCase().includes(search.toLowerCase());

    const matchTemplate =
      selectedTemplateFilter === 'all' || inv.templateId === selectedTemplateFilter;

    return matchSearch && matchTemplate;
  });

  const handleCopyLink = (inv: Invitation) => {
    const link = `${baseUrl}/invite/${inv.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenQR = (inv: Invitation) => {
    const link = `${baseUrl}/invite/${inv.slug}`;
    setQrModalData({
      url: link,
      title: `${inv.groomName} & ${inv.brideName} Dəvətnaməsi`,
    });
  };

  return (
    <div id="invitations-manager-container" className="space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <span>Dəvətnamələr</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              {invitations.length} ədəd
            </span>
          </h2>
          <p className="text-xs text-stone-400">
            Hər dəvətnamə unikal linkə və təyin edilmiş şablona malikdir.
          </p>
        </div>

        <button
          id="create-new-inv-btn"
          onClick={onOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Dəvətnamə Yarat</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bəy, gəlin, məkan və ya slag ilə axtar..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <select
          value={selectedTemplateFilter}
          onChange={(e) => setSelectedTemplateFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:border-amber-400 focus:outline-none"
        >
          <option value="all">Bütün Şablonlar</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Invitations Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inv) => {
          const matchedTemplate = templates.find((t) => t.id === inv.templateId);
          const isCopied = copiedId === inv.id;

          return (
            <div
              key={inv.id}
              className="rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 transition-all flex flex-col overflow-hidden shadow-xl"
            >
              {/* Cover Image & Status Badge */}
              <div className="relative aspect-[16/9] bg-stone-950 overflow-hidden">
                <img
                  src={inv.heroImage}
                  alt={inv.groomName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      inv.active
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-stone-800/80 text-stone-400'
                    }`}
                  >
                    {inv.active ? 'Aktiv' : 'Deaktiv'}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-amber-300 backdrop-blur-md border border-amber-400/20">
                    {matchedTemplate?.name || inv.templateId}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-stone-100">
                  <h3 className="text-base font-bold truncate">
                    {inv.groomName} & {inv.brideName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-mono mt-0.5">
                    <LinkIcon className="w-3 h-3" />
                    <span>/invite/{inv.slug}</span>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-4 flex-1 space-y-3 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{inv.weddingDate} (Saat {inv.weddingTime})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedViewLogsInv(inv)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all cursor-pointer group"
                    title="Real ziyarətçi tarixçəsinə və cihazlara baxın"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">{inv.views || 0} baxış</span>
                  </button>
                </div>

                <div className="flex items-start gap-1.5 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{inv.venue}, {inv.address}</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-400">
                  <Music className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">
                    {inv.music && inv.music !== 'none'
                      ? inv.musicTitle || 'Fon musiqisi aktivdir'
                      : 'Musiqisiz (səssiz)'}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-stone-950/80 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Copy Link */}
                  <button
                    onClick={() => handleCopyLink(inv)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    title="Linki kopyala"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => handleOpenQR(inv)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    title="QR Kod Yarat"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => onPreviewInvitation(inv)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    title="Önizləmə"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    onClick={() => onEditInvitation(inv)}
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                    title="Redaktə et"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setInvitationToDelete(inv)}
                    className="p-2 rounded-xl bg-stone-800/60 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
          <p className="text-sm text-stone-400">Axtarışa uyğun dəvətnamə tapılmadı.</p>
        </div>
      )}

      {/* Delete Invitation Confirmation Modal */}
      {invitationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Dəvətnaməni silmək istəyirsiniz?</h3>
            <p className="text-sm text-stone-400 text-center mb-6 leading-relaxed">
              <strong className="text-stone-200">"{invitationToDelete.groomName} & {invitationToDelete.brideName}"</strong> dəvətnaməsi sistemdən və bazadan silinəcək. Bu əməliyyat geri qaytarıla bilməz.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setInvitationToDelete(null)}
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
                    await onDeleteInvitation(invitationToDelete.id);
                  } finally {
                    setIsDeleting(false);
                    setInvitationToDelete(null);
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

      {/* QR Code Modal */}
      {qrModalData && (
        <QRCodeModal
          url={qrModalData.url}
          title={qrModalData.title}
          onClose={() => setQrModalData(null)}
        />
      )}

      {/* Real Visitor Tracking Modal */}
      {selectedViewLogsInv && (
        <ViewLogsModal
          invitation={selectedViewLogsInv}
          onClose={() => setSelectedViewLogsInv(null)}
        />
      )}
    </div>
  );
};
