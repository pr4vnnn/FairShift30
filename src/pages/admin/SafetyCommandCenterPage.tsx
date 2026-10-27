import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { SafetyIncident, IncidentSeverity, IncidentStatus, IncidentCategory } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  MessageSquare,
  ShieldCheck,
  Send,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { Button, Card, StatusBadge, Drawer, Modal, EmptyState } from '../../components/common/UIComponents';

export const SafetyCommandCenterPage: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | IncidentSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | IncidentCategory>('all');

  // Drawer / Action form state
  const [actionNoteText, setActionNoteText] = useState('');
  const [assignedOwnerInput, setAssignedOwnerInput] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');

  const loadIncidents = () => {
    const list = StorageService.getSafetyIncidents();
    setIncidents(list);
    if (selectedIncident) {
      const refreshed = list.find((i) => i.id === selectedIncident.id);
      if (refreshed) setSelectedIncident(refreshed);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleOpenIncident = (inc: SafetyIncident) => {
    setSelectedIncident(inc);
    setAssignedOwnerInput(inc.assignedOwner || 'Site Safety Officer K. Sundaram');
    setActionNoteText('');
  };

  const handleAddActionNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !actionNoteText.trim()) return;

    try {
      StorageService.addActionNote(
        selectedIncident.id,
        actionNoteText.trim(),
        assignedOwnerInput.trim() || 'Safety Supervisor'
      );
      setActionNoteText('');
      loadIncidents();
      showToast('Supervisor action note added to incident log', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error adding note', 'error');
    }
  };

  const handleUpdateStatus = (newStatus: IncidentStatus) => {
    if (!selectedIncident) return;
    if (newStatus === 'Resolved') {
      setIsResolveModalOpen(true);
      return;
    }

    try {
      StorageService.updateIncidentStatus(selectedIncident.id, newStatus, assignedOwnerInput);
      loadIncidents();
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolutionNoteInput.trim()) {
      showToast('Resolution explanation note is mandatory before closing an incident', 'error');
      return;
    }

    try {
      StorageService.resolveIncident(
        selectedIncident.id,
        resolutionNoteInput.trim(),
        assignedOwnerInput || 'Safety Lead'
      );
      setIsResolveModalOpen(false);
      setResolutionNoteInput('');
      loadIncidents();
      showToast('Incident verified and marked Resolved', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve incident', 'error');
    }
  };

  // Severity ranking for sorting
  const severityRank = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1
  };

  // Filter & sort
  const filteredIncidents = incidents
    .filter((inc) => {
      const matchesSearch =
        inc.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || inc.category === categoryFilter;
      return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
    })
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  const now = Date.now();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navSafetyCenter}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Priority hazard triage, owner assignment, real-time action logs, and verified resolutions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference ID, keyword, location..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-teal-600"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-teal-600"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted (Unprocessed)</option>
              <option value="Under Review">Under Review</option>
              <option value="Action in Progress">Action in Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ref ID & Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Worksite & Area</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Elapsed Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.map((inc) => {
                const elapsedHours = Math.round((now - new Date(inc.submittedAt).getTime()) / 3600000);
                const isUrgent = inc.status !== 'Resolved' && (inc.severity === 'Critical' || inc.severity === 'High');

                return (
                  <tr
                    key={inc.id}
                    onClick={() => handleOpenIncident(inc)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isUrgent ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-teal-800">{inc.refId}</div>
                      <div className="text-slate-600 text-[11px] font-medium">{inc.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                          inc.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : inc.severity === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{inc.location}</div>
                      <div className="text-slate-500 text-[11px]">{inc.workArea || 'General area'}</div>
                    </td>
                    <td className="py-3 px-4">
                      {inc.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 italic">
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Anonymous Reporter</span>
                        </span>
                      ) : (
                        <span className="font-medium text-slate-800">{inc.reporterName}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {elapsedHours}h elapsed
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-teal-700 hover:text-teal-900 font-semibold hover:underline">
                        Review & Act →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Incident Detail & Triage Drawer */}
      <Drawer
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident ? `${selectedIncident.refId} — ${selectedIncident.category}` : 'Incident Review'}
        subtitle={selectedIncident ? `${selectedIncident.location} · Submitted ${new Date(selectedIncident.submittedAt).toLocaleString()}` : ''}
      >
        {selectedIncident && (
          <div className="space-y-6 text-xs">
            {/* Severity and Status banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Severity:</span>
                <span className="font-bold text-rose-700 uppercase">{selectedIncident.severity}</span>
              </div>
              <StatusBadge status={selectedIncident.status} />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Detailed Hazard Description:</p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 leading-relaxed text-slate-900">
                {selectedIncident.description}
              </div>
            </div>

            {/* Reporter details */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Submitted By:</span>
                <span className="font-bold text-slate-900">
                  {selectedIncident.isAnonymous ? 'Anonymous Worker (Identity Protected)' : selectedIncident.reporterName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Worksite Assigned:</span>
                <span className="font-medium text-slate-800">{selectedIncident.location}</span>
              </div>
            </div>

            {/* Assignee / Response Owner */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Designated Safety Lead / Response Owner
              </label>
              <input
                type="text"
                value={assignedOwnerInput}
                onChange={(e) => setAssignedOwnerInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
                placeholder="e.g. Site Safety Officer K. Sundaram"
              />
            </div>

            {/* Action History & Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>Action Notes & Response Log</span>
              </h4>

              {selectedIncident.actionNotes.length === 0 ? (
                <p className="text-slate-500 italic">No supervisor notes added yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedIncident.actionNotes.map((an) => (
                    <div key={an.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{an.author}</span>
                        <span className="text-slate-400">{new Date(an.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700">{an.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddActionNote} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={actionNoteText}
                  onChange={(e) => setActionNoteText(e.target.value)}
                  placeholder="e.g. Scaffolding section red-tagged; maintenance crew dispatched."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 text-xs"
                />
                <Button type="submit" size="sm" variant="secondary" icon={Send}>
                  Add Note
                </Button>
              </form>
            </div>

            {/* Resolution Details if already resolved */}
            {selectedIncident.status === 'Resolved' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hazard Resolved & Cleared</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-mono">
                  Closed on: {selectedIncident.resolvedAt ? new Date(selectedIncident.resolvedAt).toLocaleString() : 'Verified'}
                </p>
                <p className="text-slate-800 pt-1 font-medium">{selectedIncident.resolutionNote}</p>
              </div>
            )}

            {/* Status Change Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <label className="block font-semibold text-slate-700">Update Incident Lifecycle:</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={selectedIncident.status === 'Under Review'}
                  onClick={() => handleUpdateStatus('Under Review')}
                >
                  Mark Under Review
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={selectedIncident.status === 'Action in Progress'}
                  onClick={() => handleUpdateStatus('Action in Progress')}
                >
                  Mark Action in Progress
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-emerald-700 hover:bg-emerald-800"
                  icon={CheckCircle2}
                  disabled={selectedIncident.status === 'Resolved'}
                  onClick={() => handleUpdateStatus('Resolved')}
                >
                  Resolve Incident...
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Mandatory Resolution Note Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve & Close Safety Incident"
      >
        <form onSubmit={handleConfirmResolution} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <p className="font-bold">Mandatory Resolution Verification</p>
            <p className="mt-0.5">
              To prevent unresolved hazards from being prematurely dismissed, you must document the physical inspection or repair actions taken before marking this incident resolved.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Resolution Note & Repair Details
            </label>
            <textarea
              rows={4}
              value={resolutionNoteInput}
              onChange={(e) => setResolutionNoteInput(e.target.value)}
              placeholder="e.g. Anchorage brackets fully replaced with certified galvanized anchors; secondary safety cable tested and approved by site engineer."
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Confirm Resolution & Notify Worker
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
