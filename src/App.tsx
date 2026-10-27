/**
 * FairShift 360 - Main Application Router
 * Aligned with UN SDG 8: Decent Work and Economic Growth
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PortalLayout } from './components/layout/PortalLayout';
import { LandingPage } from './pages/LandingPage';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { ShiftTrackerPage } from './pages/worker/ShiftTrackerPage';
import { ClearPayPage } from './pages/worker/ClearPayPage';
import { SafeVoicePage } from './pages/worker/SafeVoicePage';
import { SkillPassportPage } from './pages/worker/SkillPassportPage';
import { WellbeingCheckInPage } from './pages/worker/WellbeingCheckInPage';
import { ShiftSwapPage } from './pages/worker/ShiftSwapPage';
import { WorkdayTimelinePage } from './pages/worker/WorkdayTimelinePage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { WorkerManagementPage } from './pages/admin/WorkerManagementPage';
import { SafetyCommandCenterPage } from './pages/admin/SafetyCommandCenterPage';
import { FairnessActionCenterPage } from './pages/admin/FairnessActionCenterPage';
import { WorkforceInsightsPage } from './pages/admin/WorkforceInsightsPage';
import { AdminShiftSwapPage } from './pages/admin/AdminShiftSwapPage';
import { SettingsPage } from './pages/admin/SettingsPage';

function AppRoutes() {
  const { role } = useApp();

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Worker Portal Routes */}
      <Route path="/worker" element={<PortalLayout />}>
        <Route index element={<WorkerDashboard />} />
        <Route path="shifts" element={<ShiftTrackerPage />} />
        <Route path="clearpay" element={<ClearPayPage />} />
        <Route path="safevoice" element={<SafeVoicePage />} />
        <Route path="skills" element={<SkillPassportPage />} />
        <Route path="wellbeing" element={<WellbeingCheckInPage />} />
        <Route path="swap" element={<ShiftSwapPage />} />
        <Route path="timeline" element={<WorkdayTimelinePage />} />
      </Route>

      {/* Employer / Admin Portal Routes */}
      <Route path="/admin" element={<PortalLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="workers" element={<WorkerManagementPage />} />
        <Route path="attendance" element={<WorkerManagementPage />} />
        <Route path="safety" element={<SafetyCommandCenterPage />} />
        <Route path="fairness" element={<FairnessActionCenterPage />} />
        <Route path="insights" element={<WorkforceInsightsPage />} />
        <Route path="swaps" element={<AdminShiftSwapPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
