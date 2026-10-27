import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  Calculator,
  ShieldAlert,
  Award,
  HeartPulse,
  ArrowLeftRight,
  ListOrdered,
  Users,
  AlertTriangle,
  Scale,
  BarChart3,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, t, currentWorker, language } = useApp();

  const isWorker = role === 'worker';

  const workerNavItems = [
    { to: '/worker', label: t.navDashboard, icon: LayoutDashboard, end: true },
    { to: '/worker/shifts', label: t.navShifts, icon: Clock },
    { to: '/worker/clearpay', label: t.navClearPay, icon: Calculator },
    { to: '/worker/safevoice', label: t.navSafeVoice, icon: ShieldAlert },
    { to: '/worker/skills', label: t.navSkillPassport, icon: Award },
    { to: '/worker/wellbeing', label: t.navWellbeing, icon: HeartPulse },
    { to: '/worker/swap', label: t.navShiftSwap, icon: ArrowLeftRight },
    { to: '/worker/timeline', label: t.navWorkdayTimeline, icon: ListOrdered }
  ];

  const adminNavItems = [
    { to: '/admin', label: t.navAdminOverview, icon: LayoutDashboard, end: true },
    { to: '/admin/workers', label: t.navWorkerDirectory, icon: Users },
    { to: '/admin/safety', label: t.navSafetyCenter, icon: AlertTriangle },
    { to: '/admin/fairness', label: t.navFairnessCenter, icon: Scale },
    { to: '/admin/insights', label: t.navWorkforceInsights, icon: BarChart3 },
    { to: '/admin/swaps', label: t.navAdminSwap, icon: ArrowLeftRight },
    { to: '/admin/settings', label: t.navSettings, icon: Sliders }
  ];

  const items = isWorker ? workerNavItems : adminNavItems;

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 select-none">
        {/* Worker Badge or Supervisor Title */}
        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {isWorker ? t.workerPortal : t.employerPortal}
          </p>
          <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">
            {isWorker ? (language === 'ta' ? currentWorker.nameTa : currentWorker.name) : 'Lead Works Coordinator'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {isWorker
              ? (language === 'ta' ? currentWorker.roleTa : currentWorker.role)
              : 'Safety & Attendance Admin'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1" aria-label="Portal Navigation">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </NavLink>
            );
          })}
        </nav>

        {/* UN SDG 8 Tag */}
        <div className="mt-auto pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col gap-1">
          <span className="font-semibold text-slate-700">UN SDG 8 Goal Aligned</span>
          <span>Decent Work & Equal Transparency</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation for Essential Worker Actions */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-md text-[11px] font-medium transition-colors ${
                  isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[64px] text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
