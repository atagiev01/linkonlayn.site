import React, { useState } from 'react';
import { loginAdmin } from '../../firebase/auth';
import { getIsLiveFirebase } from '../../firebase/config';
import { Sparkles, Lock, Mail, Key, ArrowRight } from 'lucide-react';

interface AdminAuthModalProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLive = getIsLiveFirebase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('E-poçt və şifrə daxil edin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginAdmin(email.trim(), password);
      setIsLoading(false);
      onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      setIsLoading(false);
      setError(err?.message || 'Giriş uğursuz oldu.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginAdmin('admin@wedding.az', 'admin123');
      setIsLoading(false);
      onSuccess();
    } catch (err) {
      setIsLoading(false);
      setError('Demo giriş uğursuz oldu.');
    }
  };

  return (
    <div
      id="admin-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        id="admin-auth-card"
        className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 font-bold">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-100">Admin Girişi</h2>
          <p className="text-xs text-stone-400 mt-1">
            Şablonlar, dəvətnamələr və RSVP məlumatlarını idarə etmək üçün daxil olun.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300 mb-1">
              E-poçt Ünvanı
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wedding.az"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300 mb-1">
              Şifrə
            </label>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 absolute left-3.5 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Yoxlanılır...</span>
            ) : (
              <>
                <span>Daxil Ol</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Access — only ever shown in standalone/demo mode (no live
              Firebase backend), so it can never grant access to real data. */}
          {!isLive && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1-Kliklə Demo Admin Girişi (Sürətli)</span>
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-end text-xs text-stone-400">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-stone-500 hover:text-stone-300"
            >
              Qonaq rejimində bax
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
