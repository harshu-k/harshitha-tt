import React, { useState, useEffect } from 'react';
import { skillsApi } from '../../services/api';
import {
  Code,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  Filter,
  Sparkles,
  X,
  Edit2
} from 'lucide-react';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'TECHNICAL',
    proficiency: 'INTERMEDIATE',
    yearsOfExperience: 1,
  });

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'TECHNICAL', label: 'Technical' },
    { id: 'FRAMEWORK_TOOL', label: 'Frameworks & Tools' },
    { id: 'DATABASE', label: 'Database' },
    { id: 'CLOUD_DEVOPS', label: 'Cloud & DevOps' },
    { id: 'SOFT_SKILL', label: 'Soft Skills' },
  ];

  const proficiencies = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await skillsApi.getMySkills();
      setSkills(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'TECHNICAL',
      proficiency: 'INTERMEDIATE',
      yearsOfExperience: 1,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience || 1,
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSkill) {
        await skillsApi.updateSkill(editingSkill.id, formData);
        setMessage('Skill updated successfully!');
      } else {
        await skillsApi.addSkill(formData);
        setMessage('Skill added successfully!');
      }
      setShowAddModal(false);
      fetchSkills();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;
    try {
      await skillsApi.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setMessage('Skill removed');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filteredSkills = activeCategory === 'ALL'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const getProficiencyBadge = (level) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ADVANCED':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-600" /> Technical & Soft Skills Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build your skills repertoire. Verified skills receive priority recommendation matching.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Skill
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {c.label} {c.id !== 'ALL' && `(${skills.filter((s) => s.category === c.id).length})`}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <Code className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No skills found in this category.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
            >
              Add your first skill
            </button>
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{skill.name}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getProficiencyBadge(skill.proficiency)}`}>
                    {skill.proficiency}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {skill.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {skill.yearsOfExperience || 1} yr{skill.yearsOfExperience > 1 ? 's' : ''} exp
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {skill.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Endorsed by {skill.verifiedBy || 'Coordinator'}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Pending Endorsement
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, Spring Boot, Docker, SQL"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="TECHNICAL">Technical (Programming / CS)</option>
                  <option value="FRAMEWORK_TOOL">Frameworks & Tools</option>
                  <option value="DATABASE">Database & Storage</option>
                  <option value="CLOUD_DEVOPS">Cloud & DevOps</option>
                  <option value="SOFT_SKILL">Soft Skills & Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proficiency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {proficiencies.map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setFormData({ ...formData, proficiency: lvl })}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                        formData.proficiency === lvl
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement;

