import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Worker, RoleType, Language } from '../types';
import { StorageService } from '../services/storage';
import { translations } from '../i18n/translations';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  currentWorker: Worker;
  setCurrentWorkerId: (id: string) => void;
  workers: Worker[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  largeTouch: boolean;
  toggleLargeTouch: () => void;
  largeText: boolean;
  toggleLargeText: () => void;
  isOffline: boolean;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  refreshKey: number;
  triggerRefresh: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>(() => {
    return (localStorage.getItem('fairshift_role') as RoleType) || 'worker';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('fairshift_lang') as Language) || 'en';
  });

  const [currentWorkerId, setCurrentWorkerIdState] = useState<string>(() => {
    return localStorage.getItem('fairshift_worker_id') || 'w-101';
  });

  const [largeTouch, setLargeTouch] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const workers = useMemo(() => {
    return StorageService.getWorkers();
  }, [refreshKey]);

  const currentWorker = useMemo(() => {
    return workers.find((w) => w.id === currentWorkerId) || workers[0];
  }, [workers, currentWorkerId]);

  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener('fairshift_storage_update', handleStorageChange);
    return () => window.removeEventListener('fairshift_storage_update', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Connection restored: Online', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Offline Mode: Changes saved locally', 'info');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('text-size-large');
    } else {
      document.body.classList.remove('text-size-large');
    }
  }, [largeText]);

  useEffect(() => {
    if (largeTouch) {
      document.body.classList.add('large-touch-mode');
    } else {
      document.body.classList.remove('large-touch-mode');
    }
  }, [largeTouch]);

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    localStorage.setItem('fairshift_role', newRole);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('fairshift_lang', newLang);
  };

  const setCurrentWorkerId = (id: string) => {
    setCurrentWorkerIdState(id);
    localStorage.setItem('fairshift_worker_id', id);
    setRefreshKey((k) => k + 1);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const resetDemoData = () => {
    StorageService.resetToDefaults();
    setCurrentWorkerIdState('w-101');
    localStorage.setItem('fairshift_worker_id', 'w-101');
    setRefreshKey((k) => k + 1);
    showToast('Demo data reset to initial showcase state', 'success');
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentWorker,
        setCurrentWorkerId,
        workers,
        language,
        setLanguage,
        t,
        largeTouch,
        toggleLargeTouch: () => setLargeTouch((v) => !v),
        largeText,
        toggleLargeText: () => setLargeText((v) => !v),
        isOffline,
        toast,
        showToast,
        refreshKey,
        triggerRefresh,
        resetDemoData
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : 'bg-teal-400'
            }`}
          />
          <p className="text-sm font-medium pr-2">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
