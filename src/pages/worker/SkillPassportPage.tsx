import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { SkillRecord } from '../../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  Star,
  BookOpen
} from 'lucide-react';
import { Button, Card, Modal, EmptyState } from '../../components/common/UIComponents';

export const SkillPassportPage: React.FC = () => {
  const { currentWorker, language, t, showToast } = useApp();

  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Safety & Compliance');
  const [confidenceLevel, setConfidenceLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [certificationName, setCertificationName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [taskCompetency, setTaskCompetency] = useState('');

  const loadSkills = () => {
    setSkills(StorageService.getSkills(currentWorker.id));
  };

  useEffect(() => {
    loadSkills();
  }, [currentWorker.id]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !taskCompetency.trim()) {
      showToast('Please provide a skill title and task competency', 'error');
      return;
    }

    try {
      StorageService.addSkill({
        workerId: currentWorker.id,
        skillName: skillName.trim(),
        category,
        confidenceLevel,
        certificationName: certificationName.trim() || undefined,
        expiryDate: expiryDate || undefined,
        isEmployerVerified: false, // self-reported by default
        taskCompetency: taskCompetency.trim()
      });

      setIsAddModalOpen(false);
      setSkillName('');
      setCertificationName('');
      setExpiryDate('');
      setTaskCompetency('');
      loadSkills();
      showToast('Skill record added to your worker passport', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add skill', 'error');
    }
  };

  const handleDeleteSkill = (id: string) => {
    if (confirm('Remove this skill from your passport?')) {
      StorageService.deleteSkill(id);
      loadSkills();
      showToast('Skill removed', 'info');
    }
  };

  const now = Date.now();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.skillPassportTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.skillPassportSubtitle}
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          {t.addSkill}
        </Button>
      </div>

      {/* Distinction Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900">Worker-Owned Competency Record</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Certifications marked <span className="font-semibold text-emerald-800">Employer Verified</span> have been confirmed with issuing accredited bodies (OSHA, NTC, NFPA). Self-reported entries reflect your trade experience and are labeled accordingly.
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const isExpiringSoon = skill.expiryDate
            ? (new Date(skill.expiryDate).getTime() - now) / 86400000 <= 30 &&
              new Date(skill.expiryDate).getTime() > now
            : false;

          return (
            <Card key={skill.id} className="flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                      {skill.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{skill.skillName}</h3>
                  </div>

                  {skill.isEmployerVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.employerVerified}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <span>{t.selfReported}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {skill.taskCompetency}
                </p>

                {skill.certificationName && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-700" />
                      <span>{skill.certificationName}</span>
                    </p>
                    {skill.expiryDate && (
                      <p
                        className={`text-[11px] mt-1 flex items-center gap-1 ${
                          isExpiringSoon ? 'text-amber-800 font-bold' : 'text-slate-500'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Valid until: {skill.expiryDate}</span>
                        {isExpiringSoon && <span>(Renewal recommended!)</span>}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confidence Rating & Delete */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Confidence:</span>
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= skill.confidenceLevel ? 'fill-current text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete skill entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Trade Skill or Certification"
      >
        <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Skill or Competency Title
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. High-Pressure Boiler Maintenance / Heavy Crane Rigger"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
              >
                <option value="Safety & Compliance">Safety & Compliance</option>
                <option value="Masonry & Concrete">Masonry & Concrete</option>
                <option value="Electrical Utilities">Electrical Utilities</option>
                <option value="Mechanical & HVAC">Mechanical & HVAC</option>
                <option value="Equipment Operation">Equipment Operation</option>
                <option value="Technical Planning">Technical Planning</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Self-Reported Confidence (1 - 5)
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(Number(e.target.value) as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 bg-white"
              >
                <option value={1}>1 - Beginner (Requires supervision)</option>
                <option value={2}>2 - Developing competence</option>
                <option value={3}>3 - Proficient under general instructions</option>
                <option value={4}>4 - Highly competent (Independent)</option>
                <option value={5}>5 - Master / Lead trainer level</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Certificate Name (Optional)
              </label>
              <input
                type="text"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
                placeholder="e.g. OSHA 30 / Wireman License"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expiry Date (If applicable)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Task Competency Scope
            </label>
            <textarea
              rows={3}
              value={taskCompetency}
              onChange={(e) => setTaskCompetency(e.target.value)}
              placeholder="Describe tasks you can safely execute (e.g. Authorized to rig suspended scaffolding above 15 meters)."
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save to Passport
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
