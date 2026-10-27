import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { SafetyIncident, IncidentCategory, IncidentSeverity } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  EyeOff,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Camera,
  AlertCircle
} from 'lucide-react';
import { Button, Card, StatusBadge, EmptyState } from '../../components/common/UIComponents';

export const SafeVoicePage: React.FC = () => {
  const { currentWorker, language, t, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'report' | 'my_reports'>('report');
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);

  // Form state
  const [category, setCategory] = useState<IncidentCategory>('Working at Height');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [workArea, setWorkArea] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Follow-up note input
  const [followUpText, setFollowUpText] = useState('');

  const loadIncidents = () => {
    const all = StorageService.getSafetyIncidents();
    // Filter to reports submitted by this worker or anonymous
    const my = all.filter(
      (inc) => inc.reporterWorkerId === currentWorker.id || (inc.isAnonymous && inc.location === currentWorker.worksite)
    );
    setIncidents(my);
    if (selectedIncident) {
      const refreshed = all.find((i) => i.id === selectedIncident.id);
      if (refreshed) setSelectedIncident(refreshed);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [currentWorker.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a description of the safety hazard', 'error');
      return;
    }

    try {
      const newInc = StorageService.createSafetyIncident({
        reporterWorkerId: currentWorker.id,
        reporterName: currentWorker.name,
        isAnonymous,
        industry: currentWorker.industry,
        category,
        severity,
        location: currentWorker.worksite,
        workArea: workArea.trim() || undefined,
        description: description.trim(),
        photoPreviewUrl: photoPreview || undefined
      });

      setSubmittedRefId(newInc.refId);
      setDescription('');
      setWorkArea('');
      setPhotoPreview('');
      loadIncidents();
      showToast(`${t.reportSuccess} ${newInc.refId}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report', 'error');
    }
  };

  const handleSimulatePhoto = () => {
    // Local placeholder for simulated photo capture
    setPhotoPreview('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23334155"/><text x="50%" y="50%" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Field Photo Captured: Hazard Evidence #01</text></svg>');
    showToast('Simulated field snapshot attached', 'info');
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !followUpText.trim()) return;

    // Follow up can be added as an action note marked from worker
    StorageService.addActionNote(selectedIncident.id, `Worker Follow-up: ${followUpText.trim()}`, currentWorker.name);
    setFollowUpText('');
    loadIncidents();
    showToast('Follow-up details added to incident log', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.safeVoiceTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.safeVoiceSubtitle}
        </p>
      </div>

      {/* Emergency Guidance Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-rose-800">{t.emergencyNoticeTitle}</p>
          <p className="text-rose-700 mt-0.5 leading-relaxed">{t.emergencyNoticeDesc}</p>
        </div>
      </div>

      {/* Tab toggle: Report Hazard vs My Reports */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'report' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Submit Safety Report</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('my_reports');
            loadIncidents();
          }}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'my_reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.myReportsTitle} ({incidents.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBMIT REPORT */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card>
              {submittedRefId && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Report Logged Successfully!</span>
                  </div>
                  <p>
                    Reference ID: <strong className="font-mono">{submittedRefId}</strong>. It has been routed to the Safety Command Center.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedRefId(null);
                      setActiveTab('my_reports');
                    }}
                    className="text-teal-700 font-bold hover:underline pt-1 block"
                  >
                    View Status in My Reports →
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Category & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t.categoryLabel}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white font-medium text-slate-900"
                    >
                      <option value="Working at Height">Working at Height (Scaffolding, harness, ladder)</option>
                      <option value="Electrical">Electrical (Exposed wire, breaker heating, shocks)</option>
                      <option value="Equipment">Equipment / Machinery (Brakes, guards, cables)</option>
                      <option value="Chemicals">Chemicals & Hazardous Fumes (Solvents, leaks)</option>
                      <option value="Fire">Fire & Heat Hazards (Flammables, extinguishers)</option>
                      <option value="Harassment">Workplace Harassment / Hostility</option>
                      <option value="Fatigue">Excessive Fatigue / Overwork</option>
                      <option value="Other">Other Environmental Safety Concern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t.severityLabel}
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white font-semibold text-slate-900"
                    >
                      <option value="Low">Low (Minor hazard, preventative check)</option>
                      <option value="Medium">Medium (Potential injury risk if unaddressed)</option>
                      <option value="High">High (Serious injury potential / urgent)</option>
                      <option value="Critical">Critical (Immediate danger of severe harm/collapse)</option>
                    </select>
                  </div>
                </div>

                {/* Location & Work Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Worksite (Assigned)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={currentWorker.worksite}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Specific Work Area / Location
                    </label>
                    <input
                      type="text"
                      value={workArea}
                      onChange={(e) => setWorkArea(e.target.value)}
                      placeholder="e.g. Scaffolding Bay 3, Level 7 / Lab B-04"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.descriptionLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you observed, damaged parts, exposed danger, or who might be affected..."
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
                  />
                </div>

                {/* Simulated Photo Attachment */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Optional Photo / Visual Evidence</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSimulatePhoto}
                      className="text-teal-700 hover:text-teal-900 font-semibold"
                    >
                      Attach Field Snapshot
                    </button>
                  </div>
                  {photoPreview && (
                    <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                      <img src={photoPreview} alt="Evidence preview" className="w-full h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="text-rose-600 text-[11px] mt-1 hover:underline"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Anonymous Display Toggle */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-1 accent-teal-600"
                  />
                  <div>
                    <label htmlFor="anonCheck" className="font-semibold text-slate-900 cursor-pointer">
                      {t.anonymousToggle}
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.anonymousNote}</p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <Button type="submit" size="md" icon={Send} className="font-bold">
                    {t.submit} Safety Report
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            <Card className="bg-slate-900 text-white border-slate-800">
              <h4 className="font-bold text-sm text-teal-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Protected Worker Voice</span>
              </h4>
              <p className="text-slate-300 mt-2 leading-relaxed">
                Under workplace safety agreements, no worker may be penalised, transferred, or docked pay for identifying safety hazards or halting work in conditions of imminent danger.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Reports are permanently stamped with date & time to preserve supervisor response accountability.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MY REPORTS & CLOSED-LOOP PROGRESS TIMELINE */}
      {activeTab === 'my_reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incidents List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Submitted Reports</h3>
            {incidents.length === 0 ? (
              <EmptyState
                title="No reports submitted yet"
                description="You haven't logged any workplace safety hazards."
                actionText="Submit First Report"
                onAction={() => setActiveTab('report')}
              />
            ) : (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border transition-colors cursor-pointer text-xs space-y-2 ${
                    selectedIncident?.id === inc.id
                      ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-700">{inc.refId}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="font-semibold text-slate-900 line-clamp-1">{inc.category} — {inc.location}</p>
                  <p className="text-slate-600 line-clamp-2">{inc.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{new Date(inc.submittedAt).toLocaleDateString()}</span>
                    <span>{inc.actionNotes.length} Supervisor Notes</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Incident Detail & Closed-Loop Timeline */}
          <div className="lg:col-span-7">
            {selectedIncident ? (
              <Card className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-teal-800">{selectedIncident.refId}</span>
                      <StatusBadge status={selectedIncident.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted on {new Date(selectedIncident.submittedAt).toLocaleString()} · {selectedIncident.severity} Severity
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="text-xs space-y-2">
                  <p>
                    <strong className="text-slate-700">Category:</strong> {selectedIncident.category}
                  </p>
                  <p>
                    <strong className="text-slate-700">Location:</strong> {selectedIncident.location} {selectedIncident.workArea ? `(${selectedIncident.workArea})` : ''}
                  </p>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    <p className="font-semibold text-[11px] text-slate-600">Hazard Description:</p>
                    <p className="mt-1 leading-relaxed">{selectedIncident.description}</p>
                  </div>
                </div>

                {/* Closed Loop Timeline */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Response & Resolution Timeline</span>
                  </h4>

                  {/* Submission stage */}
                  <div className="border-l-2 border-teal-500 pl-4 py-1 text-xs space-y-0.5">
                    <p className="font-semibold text-slate-900">Incident Reported</p>
                    <p className="text-slate-500 text-[11px]">{new Date(selectedIncident.submittedAt).toLocaleString()}</p>
                  </div>

                  {/* Supervisor action notes */}
                  {selectedIncident.actionNotes.map((an) => (
                    <div key={an.id} className="border-l-2 border-teal-500 pl-4 py-1 text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{an.author}</span>
                        <span className="text-[11px] text-slate-400">· {new Date(an.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{an.note}</p>
                    </div>
                  ))}

                  {/* Final Resolution if resolved */}
                  {selectedIncident.status === 'Resolved' ? (
                    <div className="border-l-2 border-emerald-600 pl-4 py-1 text-xs space-y-1 bg-emerald-50/50 p-3 rounded-r-lg">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Incident Resolved & Inspected</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-mono">
                        Resolved at: {selectedIncident.resolvedAt ? new Date(selectedIncident.resolvedAt).toLocaleString() : 'Verified'}
                      </p>
                      <p className="text-slate-800 font-medium pt-1">{selectedIncident.resolutionNote}</p>
                    </div>
                  ) : (
                    <div className="border-l-2 border-amber-400 pl-4 py-1 text-xs text-amber-800">
                      <span>Currently active · In progress with safety response team</span>
                    </div>
                  )}
                </div>

                {/* Add Follow Up Note Form */}
                {selectedIncident.status !== 'Resolved' && (
                  <form onSubmit={handleAddFollowUp} className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <label className="block font-semibold text-slate-700">
                      Add Follow-Up Information / Update
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder="e.g. Scaffolding contractor arrived at 10 AM..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
                      />
                      <Button type="submit" size="sm" variant="secondary">
                        Post
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            ) : (
              <Card className="text-center py-12 text-slate-500 text-xs">
                Select a report from the list to view its complete timeline, supervisor notes, and resolution status.
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
