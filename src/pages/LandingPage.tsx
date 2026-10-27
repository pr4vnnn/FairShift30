import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Calculator,
  Clock,
  ShieldAlert,
  HeartPulse,
  HardHat,
  Building2,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
  Sparkles,
  Users
} from 'lucide-react';
import { Button, Card } from '../components/common/UIComponents';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, t } = useApp();

  const handleOpenWorker = () => {
    setRole('worker');
    navigate('/worker');
  };

  const handleOpenEmployer = () => {
    setRole('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-md bg-teal-900/80 text-teal-300 border border-teal-700/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UN SDG 8 · Decent Work & Economic Growth</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white text-balance">
                Fair Work. Clear Pay. <br className="hidden sm:inline" />
                <span className="text-teal-400">Safer Workplaces.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Empowering construction workers and campus facilities teams with verifiable shift tracking, transparent overtime wage estimation, rapid anonymous hazard reporting, and supervisor accountability.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  onClick={handleOpenWorker}
                  icon={HardHat}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                >
                  Explore Worker Portal
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleOpenEmployer}
                  icon={ShieldAlert}
                  className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
                >
                  Explore Employer Portal
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Transparent INR ₹ Wage Formulas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Closed-Loop Safety Actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Bilingual: English & தமிழ்</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-16/10 bg-slate-800">
                <img
                  src="/src/assets/images/hero_workforce_banner_1793082694884.jpg"
                  alt="Construction and university facilities teams utilizing digital safety and shift tablets"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200">
                  <p className="font-semibold text-white">Live Field Demonstration</p>
                  <p className="text-slate-300">Apex High-Rise Tower & University Science Complex</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">End-to-End Transparency</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Built for Dignity, Safety & Fair Compensation
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Eliminating wage ambiguity, manual timesheet errors, and safety reporting delays through interconnected workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:border-teal-300">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">ClearPay Calculator</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Real-time wage formula showing base pay, overtime multipliers, incentives, and deductions with actual timesheet comparison.
            </p>
          </Card>

          <Card className="hover:border-teal-300">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Smart Shift Tracker</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Accurate clock-in/out timestamps, break tracking, duplicate prevention, and peer shift swap board.
            </p>
          </Card>

          <Card className="hover:border-teal-300">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">SafeVoice Reporting</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Transparent hazard submission with anonymous display option, supervisor action notes, and mandatory resolution verification.
            </p>
          </Card>

          <Card className="hover:border-teal-300">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Fatigue & Wellbeing</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Pre-shift fatigue checks and Skill Passport tracking upcoming certificate renewals to protect worker health.
            </p>
          </Card>
        </div>
      </section>

      {/* Industry Use Cases: Construction & College Facilities */}
      <section className="py-12 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tailored to Real Industrial Frontlines</h2>
            <p className="text-xs text-slate-600 mt-1">Pre-configured with industry workflows, safety hazards, and trade roles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Construction Sites</h3>
                    <p className="text-xs text-slate-500">High-Rise Civil Works & Infrastructure</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Fall protection, scaffolding anchor inspections, and crane rigging checks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Concrete pour overtime calculations with 1.5× hourly multipliers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Shift correction appeals for gate biometric scanner network lags.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Demo Role: Muthu Raman (Ironworker)</span>
                <button
                  onClick={handleOpenWorker}
                  className="font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                >
                  <span>Open Construction View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">College Facilities & Housekeeping</h3>
                    <p className="text-xs text-slate-500">Campus Labs, Substation Utilities & Dorms</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Lab fume hood ventilation, chemical solvent handling, and electrical breaker monitoring.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Peer shift swaps for university events and convocation coverage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Skill passports tracking NFPA fire codes and electrical grade certifications.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Demo Role: Priya Sharma (Electrical Lead)</span>
                <button
                  onClick={() => {
                    setRole('worker');
                    navigate('/worker');
                  }}
                  className="font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                >
                  <span>Open Facilities View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closed-Loop Safety Incident Lifecycle */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">End-to-End Safety Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            How a Worker Report Becomes Verified Action
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A real, closed-loop workflow ensuring incidents never disappear into bureaucratic black holes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-mono font-bold text-teal-600">STEP 01</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Worker Reports Hazard</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Selects category, severity, and work area. Optional anonymous display masks identity in admin views.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-mono font-bold text-teal-600">STEP 02</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Instant Priority Triage</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generates reference ID (e.g. FS-SAF-2026-089). Incident appears instantly in Safety Command Center.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-mono font-bold text-teal-600">STEP 03</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Supervisor Action Note</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Officer tags the section, assigns repair contractor, and logs notes. Worker sees live timeline update.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-xs font-mono font-bold text-teal-600">STEP 04</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Verified Resolution</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              A written explanation is mandatory before closing. Incident marked resolved with immutable timestamps.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={handleOpenWorker} icon={ShieldAlert}>
            Try Live Safety Workflow in SafeVoice
          </Button>
        </div>
      </section>

      {/* UN SDG 8 Impact Section */}
      <section className="py-12 bg-slate-900 text-white rounded-2xl max-w-7xl mx-auto px-6 sm:px-10 my-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-2.5 py-1 rounded bg-teal-800/80 text-teal-300">
              <Scale className="w-3.5 h-3.5" />
              <span>Sustainable Development Goal 8</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Target 8.8: Protect Labour Rights and Promote Safe Working Environments
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              By giving informal and frontline trades direct digital custody over their shift records, clear calculations of their take-home wages, and an unhindered voice for physical safety, FairShift 360 fosters sustainable economic growth through dignified, safe employment.
            </p>
          </div>

          <div className="lg:col-span-4 bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-700">
              <span className="text-slate-400">Shift Wage Transparency</span>
              <span className="font-bold text-teal-400">100% Calculated</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-700">
              <span className="text-slate-400">Hazard Accountability</span>
              <span className="font-bold text-teal-400">Mandatory Resolution</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Data Accessibility</span>
              <span className="font-bold text-teal-400">English + தமிழ்</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-slate-700">FairShift 360</span>
          <span>·</span>
          <span>Student Innovation Showcase Edition</span>
        </div>
        <p className="text-center md:text-right max-w-xl text-slate-400">
          Prototype demonstration mode with local browser persistence. SafeVoice and ClearPay represent simulated workforce workflows and do not constitute legal payroll or statutory emergency response.
        </p>
      </footer>
    </div>
  );
};
