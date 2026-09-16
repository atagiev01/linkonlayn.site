import React, { useState } from 'react';
import { RSVP, Invitation } from '../../types';
import { Search, Download, Trash2, CheckCircle2, XCircle, Phone } from 'lucide-react';

interface RSVPManagerProps {
  rsvps: RSVP[];
  invitations: Invitation[];
  onDeleteRSVP: (id: string) => Promise<void>;
}

export const RSVPManager: React.FC<RSVPManagerProps> = ({
  rsvps,
  invitations,
  onDeleteRSVP,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [invitationFilter, setInvitationFilter] = useState<string>('all');

  const filteredRSVPs = rsvps.filter((r) => {
    const matchSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(search.toLowerCase())) ||
      (r.phone && r.phone.includes(search));

    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'attending'
        ? r.attending
        : !r.attending;

    const matchInv =
      invitationFilter === 'all' ? true : r.invitationId === invitationFilter || r.invitationSlug === invitationFilter;

    return matchSearch && matchStatus && matchInv;
  });

  const totalAttendingGuests = filteredRSVPs
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + (Number(r.guestCount) || 1), 0);

  const exportToCSV = () => {
    const headers = ['Qonaq Adı', 'Status', 'Qonaq Sayı', 'Telefon', 'Dəvətnamə', 'Təbrik Mesajı', 'Tarix'];
    const rows = filteredRSVPs.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attending ? 'İştirak edir' : 'İmtina edib',
      r.attending ? r.guestCount : 0,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.invitationSlug || r.invitationId).replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('az-AZ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `toy_qonaqlar_rsvp_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="rsvp-manager-container" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <span>RSVP Qonaq Qeydiyyatı</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              {rsvps.length} cavab
            </span>
          </h2>
          <p className="text-xs text-stone-400">
            Dəvətnamə linklərindən daxil olan real-time cavablar və iştirakçı sayı.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Excel / CSV Yüklə</span>
        </button>
      </div>

      {/* Summary Mini Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400 block mb-1">Cəmi Cavablar</span>
          <span className="text-xl font-bold text-stone-100">{filteredRSVPs.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 block mb-1">Gələcək Qonaqların Cəmi</span>
          <span className="text-xl font-bold text-emerald-400">{totalAttendingGuests} nəfər</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-rose-500/30">
          <span className="text-xs text-rose-400 block mb-1">İştirak Etməyənlər</span>
          <span className="text-xl font-bold text-rose-400">
            {filteredRSVPs.filter((r) => !r.attending).length} nəfər
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qonağın adı, mesaj və ya nömrə ilə axtar..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:border-amber-400 focus:outline-none"
        >
          <option value="all">Bütün Statuslar</option>
          <option value="attending">Yalnız İştirak Edənlər</option>
          <option value="declined">Yalnız İştirak Etməyənlər</option>
        </select>

        <select
          value={invitationFilter}
          onChange={(e) => setInvitationFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:border-amber-400 focus:outline-none"
        >
          <option value="all">Bütün Dəvətnamələr</option>
          {invitations.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.groomName} & {inv.brideName} ({inv.slug})
            </option>
          ))}
        </select>
      </div>

      {/* RSVP Table */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Qonaq</th>
                <th className="px-5 py-3.5">Status & Qonaq Sayı</th>
                <th className="px-5 py-3.5">Dəvətnamə</th>
                <th className="px-5 py-3.5">Təbrik Mesajı</th>
                <th className="px-5 py-3.5">Tarix</th>
                <th className="px-5 py-3.5 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {filteredRSVPs.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-stone-100">
                    <div>{rsvp.guestName}</div>
                    {rsvp.phone && (
                      <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>{rsvp.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                        rsvp.attending
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {rsvp.attending ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Gələcək ({rsvp.guestCount} nəfər)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Gələ bilmir</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-mono text-[11px] text-amber-300/80">
                    {rsvp.invitationSlug || rsvp.invitationId}
                  </td>

                  <td className="px-5 py-4 text-stone-300 max-w-xs">
                    {rsvp.message ? (
                      <span className="italic">"{rsvp.message}"</span>
                    ) : (
                      <span className="text-stone-500">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-stone-400 text-[11px] whitespace-nowrap">
                    {new Date(rsvp.createdAt).toLocaleDateString('az-AZ', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`"${rsvp.guestName}" qonağının RSVP qeydini silmək istəyirsiniz?`)) {
                          onDeleteRSVP(rsvp.id);
                        }
                      }}
                      className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRSVPs.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-xs">
            Axtarış meyarlarına uyğun RSVP qeydi tapılmadı.
          </div>
        )}
      </div>
    </div>
  );
};
