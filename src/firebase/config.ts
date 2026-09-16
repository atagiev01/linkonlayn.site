import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Local storage key for custom user-configured Firebase credentials if set via Admin panel
const FIREBASE_CONFIG_STORAGE_KEY = 'wedding_app_firebase_custom_config';

export function getStoredFirebaseConfig(): FirebaseConfigType | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read custom Firebase config:', e);
    return null;
  }
}

export function saveStoredFirebaseConfig(config: FirebaseConfigType): void {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
  }
}

export function clearStoredFirebaseConfig(): void {
  try {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear Firebase config:', e);
  }
}

/**
 * Validates whether a given Firebase configuration has required keys and valid format
 */
export function validateFirebaseConfig(config: Partial<FirebaseConfigType>): { isValid: boolean; error?: string } {
  if (!config) {
    return { isValid: false, error: 'Firebase konfiqurasiyası tapılmadı.' };
  }
  if (!config.apiKey || config.apiKey.trim().length < 10 || config.apiKey === 'AIzaSyDemoPlaceholderKey') {
    return { isValid: false, error: 'Firebase API Key boş və ya düzgün formatda deyil.' };
  }
  if (!config.projectId || config.projectId.trim().length < 3) {
    return { isValid: false, error: 'Firebase Project ID təyin edilməyib.' };
  }
  if (!config.appId || !config.appId.includes(':')) {
    return { isValid: false, error: 'Firebase App ID formatı natamamdır.' };
  }
  return { isValid: true };
}

// Default environment / fallback config
const metaEnv = (import.meta as any)?.env || {};
const envConfig: Partial<FirebaseConfigType> = {
  apiKey: 'AIzaSyCPXxBj0-TXFp01CINp7P2SipuHte36ODc',
  authDomain: 'linkonline-27247.firebaseapp.com',
  projectId: 'linkonline-27247',
  storageBucket: 'linkonline-27247.firebasestorage.app',
  messagingSenderId: '538909835170',
  appId: '1:538909835170:web:e92e9f39fdefcfd6e87cfb',
  measurementId: 'G-EFJBBJXG10',
};

let currentApp: FirebaseApp | null = null;
let currentDb: Firestore | null = null;
let currentAuth: Auth | null = null;
let isLiveFirebase = false;
let configErrorMessage: string | null = null;

export function initFirebase(): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  isLive: boolean;
  error: string | null;
} {
  const customConfig = getStoredFirebaseConfig();
const effectiveConfig = envConfig as FirebaseConfigType;

  if (effectiveConfig) {
    const validation = validateFirebaseConfig(effectiveConfig);
    if (validation.isValid) {
      try {
        if (!getApps().length) {
          currentApp = initializeApp(effectiveConfig);
        } else {
          currentApp = getApp();
        }
        currentDb = getFirestore(currentApp);
        currentAuth = getAuth(currentApp);
        isLiveFirebase = true;
        configErrorMessage = null;
        return { app: currentApp, db: currentDb, auth: currentAuth, isLive: true, error: null };
      } catch (err: any) {
        console.warn('Firebase initialization error, fallback activated:', err);
        configErrorMessage = err?.message || 'Firebase qoşulma xətası';
        isLiveFirebase = false;
      }
    } else {
      configErrorMessage = validation.error || null;
      isLiveFirebase = false;
    }
  } else {
    isLiveFirebase = false;
    configErrorMessage = 'Firebase canlı açarları təyin edilməyib. Rejim: Yerli / Standalone Aktivdir.';
  }

  return { app: currentApp, db: currentDb, auth: currentAuth, isLive: isLiveFirebase, error: configErrorMessage };
}

// Initial boot
export const { app, db, auth } = initFirebase();
export const getIsLiveFirebase = () => isLiveFirebase;
export const getConfigError = () => configErrorMessage;
