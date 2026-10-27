import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Globe, RefreshCw, UserCheck, ShieldAlert, Sparkles, Eye } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    currentWorker,
    setCurrentWorkerId,
    workers,
    language,
    setLanguage,
    t,
    largeTouch,
    toggleLargeTouch,
    largeText,
    toggleLargeText,
    isOffline,
    resetDemoData
  } = useApp();

  const location = useLocation();

  const handleSwitchToWorker = () => {
    setRole('worker');
    if (!location.pathname.startsWith('/worker')) {
      navigate('/worker');
    }
  };

  const handleSwitchToAdmin = () => {
    setRole('admin');
    if (!location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group focus:outline-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-500 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              FairShift <span className="text-teal-400">360</span>
            </span>
          </Link>
          
          {/* SDG Badge - Quiet text separator */}
          <span className="hidden xl:inline text-xs text-slate-400 pl-2 border-l border-slate-700">
            UN SDG 8 · Decent Work
          </span>
        </div>

        {/* Zone 2: Portal Mode Indicator & Worker Switcher */}
        <div className="flex items-center gap-3">
          {/* Active Worker Profile Selector (in Worker View) */}
          {role === 'worker' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400">{t.activeWorker}:</span>
              <select
                value={currentWorker.id}
                onChange={(e) => setCurrentWorkerId(e.target.value)}
                className="bg-transparent text-teal-300 font-semibold focus:outline-hidden cursor-pointer"
                aria-label="Select worker profile"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                    {language === 'ta' ? w.nameTa : w.name} ({w.industry === 'construction' ? 'Construction' : 'Facilities'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Offline status indicator if offline */}
          {isOffline && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
              Offline Storage
            </span>
          )}
        </div>

        {/* Zone 3: Primary Actions & Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dual Portal Switcher Toggle */}
          <div className="flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={handleSwitchToWorker}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                role === 'worker'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch to Worker Portal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.switchToWorker}</span>
            </button>
            <button
              onClick={handleSwitchToAdmin}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch to Employer/Admin Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.switchToEmployer}</span>
            </button>
          </div>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title="Switch Language: English / தமிழ்"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Accessibility Quick Toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={toggleLargeText}
              className={`px-2 py-1 text-xs font-mono font-bold rounded transition-colors ${
                largeText ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Large Text Mode"
            >
              A+
            </button>
            <button
              onClick={toggleLargeTouch}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                largeTouch ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Large Touch Target Mode"
            >
              Touch
            </button>
          </div>

          {/* Demo Reset */}
          <button
            onClick={resetDemoData}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Reset All Demo Data"
            aria-label="Reset All Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
