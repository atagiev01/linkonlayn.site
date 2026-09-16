import React, { useState } from 'react';
import {
  getIsLiveFirebase,
  getConfigError,
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  clearStoredFirebaseConfig,
  validateFirebaseConfig,
  FirebaseConfigType,
} from '../../firebase/config';
import { resetAllDataToDefault } from '../../firebase/firestore';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Key,
  Flame,
} from 'lucide-react';

export const FirebaseSettingsView: React.FC = () => {
  const isLive = getIsLiveFirebase();
  const configError = getConfigError();
  const storedConfig = getStoredFirebaseConfig();

  const [apiKey, setApiKey] = useState(storedConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(storedConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(storedConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(storedConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(storedConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(storedConfig?.appId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rulesCopied, setRulesCopied] = useState(false);

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const configToSave: FirebaseConfigType = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    const validation = validateFirebaseConfig(configToSave);
    if (!validation.isValid) {
      alert(validation.error || 'Firebase konfiqurasiyası natamamdır.');
      return;
    }

    saveStoredFirebaseConfig(configToSave);
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleClearCustomConfig = () => {
    if (confirm('Fərdi Firebase konfiqurasiyasını silmək və yerli rejimə qayıtmaq istəyirsiniz?')) {
      clearStoredFirebaseConfig();
      window.location.reload();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Bütün şablon və dəvətnamələri ilkin başlanğıc vəziyyətinə qaytarmaq istəyirsiniz?')) {
      resetAllDataToDefault();
      alert('Bütün məlumatlar ilkin nümunə vəziyyətinə sıfırlandı.');
      window.location.reload();
    }
  };

  const securityRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    // 1. Templates: Public can read active, Admin can write
    match /templates/{templateId} {
      allow read: if resource.data.active == true || isAuthenticated();
      allow write: if isAuthenticated();
    }

    // 2. Invitations: Public can read active, views increment allowed
    match /invitations/{invitationId} {
      allow read: if resource.data.active == true || isAuthenticated();
      allow create, delete: if isAuthenticated();
      allow update: if isAuthenticated() || (
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views', 'updatedAt']) &&
        request.resource.data.views == resource.data.views + 1
      );
    }

    // 3. RSVPs: Public can submit, only Admin can read all
    match /rsvps/{rsvpId} {
      allow create: if request.resource.data.guestName is string &&
                       request.resource.data.guestName.size() > 0 &&
                       request.resource.data.invitationId is string;
      allow read, update, delete: if isAuthenticated();
    }
  }
}`;

  const copySecurityRules = () => {
    navigator.clipboard.writeText(securityRulesCode);
    setRulesCopied(true);
    setTimeout(() => setRulesCopied(false), 2500);
  };

  return (
    <div id="firebase-settings-container" className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
          <Flame className="w-6 h-6 text-amber-500" />
          <span>Firebase & Firestore Parametrləri</span>
        </h2>
        <p className="text-xs text-stone-400">
          Firebase Firestore, Authentication və Təhlükəsizlik qaydalarının (Security Rules) idarə olunması.
        </p>
      </div>

      {/* Status Card */}
      <div
        className={`p-6 rounded-3xl border flex items-start gap-4 ${
          isLive
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}
      >
        <div className="p-3 rounded-2xl bg-black/20 flex-shrink-0">
          {isLive ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Database className="w-6 h-6 text-amber-400" />}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold">
            {isLive ? 'Firebase Firestore Canlı Bağlantı Aktivdir' : 'Yerli / Hazır Standalone Rejim Aktivdir'}
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            {isLive
              ? 'Şablonlar, dəvətnamələr, baxış sayı və RSVP cavabları birbaşa Google Firebase bulud verilənlər bazasına yazılır və real-vaxtda sinxronlaşır.'
              : 'Tətbiq dərhal tam funksional işləyir. Bütün şablonlar, dəvətnamə linkləri, RSVP qeydləri və statistika brauzerdə təhlükəsiz saxlanılır və anında işləyir.'}
          </p>
          {configError && <p className="text-[11px] opacity-80 pt-1 font-mono">{configError}</p>}
        </div>
      </div>

      {/* Security Rules Preview */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Firestore Təhlükəsizlik Qaydaları (firestore.rules)</h3>
          </div>
          <button
            onClick={copySecurityRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition-colors"
          >
            {rulesCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{rulesCopied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          Bu qaydalar qonaqlara yalnız öz dəvətnamələrini oxumağa, baxış sayını artırmağa və RSVP göndərməyə icazə verir; digər məlumatlar qorunur.
        </p>

        <pre className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
          {securityRulesCode}
        </pre>
      </div>

      {/* Custom Firebase Credentials Form */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-stone-100">Öz Firebase Layihə Açarlarınızı Daxil Edin</h3>
        </div>
        <p className="text-xs text-stone-400">
          İstəyə bağlı olaraq, Firebase Console-dan aldığınız web credentials məlumatlarını bura əlavə edib tətbiqi öz layihənizə qoşa bilərsiniz.
        </p>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
            Konfiqurasiya yadda saxlanıldı! Səhifə yenilənir...
          </div>
        )}

        <form onSubmit={handleSaveCustomConfig} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Project ID</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="toy-devetnamesi-123"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Auth Domain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="toy-devetnamesi-123.firebaseapp.com"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer"
            >
              Yadda Saxla & Qoşul
            </button>

            {storedConfig && (
              <button
                type="button"
                onClick={handleClearCustomConfig}
                className="px-4 py-2.5 rounded-xl border border-stone-800 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
              >
                Açarları Sıfırla
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danger Zone / Reset Seed Data */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-rose-500/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-400">Nümunə Məlumatları Bərpa Et</h3>
        <p className="text-xs text-stone-400">
          Əgər test məlumatlarını sıfırlamaq və 4 əsas şablon ilə hazır dəvətnamələri bərpa etmək istəyirsinizsə, aşağıdakı düymədən istifadə edin.
        </p>
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>İlkin Nümunə Məlumatları Sıfırla</span>
        </button>
      </div>
    </div>
  );
};
