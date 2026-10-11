import React, { useState, useEffect } from 'react';
import { internshipsApi } from '../../services/api';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Building,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyLogo: '',
    location: '',
    workplaceType: 'REMOTE',
    domain: 'Software Engineering',
    stipend: '₹50,000 / month',
    duration: '6 Months',
    description: '',
    requirements: '',
    requiredSkills: '',
    minCgpa: 7.0,
    eligibleDepartments: 'All Departments',
    applicationDeadline: '',
    openings: 5,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await internshipsApi.getManagementList();
      setInternships(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      companyName: '',
      companyLogo: '',
      location: 'Bengaluru, Karnataka',
      workplaceType: 'REMOTE',
      domain: 'Software Engineering',
      stipend: '₹50,000 / month',
      duration: '6 Months',
      description: '',
      requirements: 'Strong analytical skills, problem solving, and hands-on coding abilities.',
      requiredSkills: 'Java, Spring Boot, React, SQL',
      minCgpa: 7.0,
      eligibleDepartments: 'Computer Science, IT, AI & Data Science',
      applicationDeadline: '',
      openings: 5,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      companyName: item.companyName,
      companyLogo: item.companyLogo || '',
      location: item.location || '',
      workplaceType: item.workplaceType || 'REMOTE',
      domain: item.domain || 'Software Engineering',
      stipend: item.stipend || '',
      duration: item.duration || '',
      description: item.description || '',
      requirements: item.requirements || '',
      requiredSkills: item.requiredSkills || '',
      minCgpa: item.minCgpa || 6.0,
      eligibleDepartments: item.eligibleDepartments || 'All Departments',
      applicationDeadline: item.applicationDeadline || '',
      openings: item.openings || 5,
      status: item.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await internshipsApi.updateInternship(editingItem.id, formData);
        setMessage('Internship updated successfully!');
      } else {
        await internshipsApi.createInternship(formData);
        setMessage('New internship position published!');
      }
      setShowModal(false);
      fetchList();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship posting?')) return;
    try {
      await internshipsApi.deleteInternship(id);
      setInternships((prev) => prev.filter((i) => i.id !== id));
      setMessage('Internship removed');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await internshipsApi.updateInternship(item.id, { ...item, status: newStatus });
      setInternships((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      setMessage(`Status updated to ${newStatus}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" /> Internship Postings Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage and publish internship opportunities for students.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Post New Internship
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Internships Table / Cards */}
      <div className="space-y-4">
        {internships.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No internship postings found.</p>
          </div>
        ) : (
          internships.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {item.companyLogo ? (
                    <img src={item.companyLogo} alt={item.companyName} className="w-8 h-8 object-contain" />
                  ) : (
                    <Building className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {item.companyName} • {item.location} ({item.workplaceType})
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-indigo-700">💰 {item.stipend}</span>
                    <span>•</span>
                    <span>⏱ {item.duration}</span>
                    <span>•</span>
                    <span>Min CGPA: {item.minCgpa}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-600" /> {item.applicantCount} Applicant{item.applicantCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    item.status === 'ACTIVE'
                      ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.status === 'ACTIVE' ? 'Close Position' : 'Reactivate'}
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  title="Edit Posting"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Posting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingItem ? 'Edit Internship Position' : 'Create New Internship Opportunity'}
                </h3>
                <p className="text-xs text-slate-500">Provide complete specifications for student eligibility</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job / Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Java Engineer Intern"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hiring Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud, Microsoft, Amazon"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Workplace Type</label>
                  <select
                    value={formData.workplaceType}
                    onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹60,000 / month"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Eligible CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 6.0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Open Vacancies</label>
                  <input
                    type="number"
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Skills (comma separated - fuels matching recommendation engine)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java, Spring Boot, React, SQL, RESTful APIs"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Description & Responsibilities</label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail daily engineering tasks, project expectations, and team structure..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Save Changes' : 'Publish Opportunity')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInternships;

