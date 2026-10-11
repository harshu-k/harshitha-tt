import React, { useState, useEffect } from 'react';
import { projectsApi } from '../../services/api';
import {
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Code
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    projectUrl: '',
    repoUrl: '',
    status: 'COMPLETED',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getMyProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectsApi.addProject(formData);
      setShowAddModal(false);
      setMessage('Project added successfully!');
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
      setFormData({
        title: '',
        description: '',
        techStack: '',
        projectUrl: '',
        repoUrl: '',
        status: 'COMPLETED',
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setMessage('Project deleted');
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
            <Layers className="w-6 h-6 text-indigo-600" /> Academic & Portfolio Projects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase full-stack applications, machine learning models, and system designs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No projects added yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
            >
              Add your first project
            </button>
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{proj.title}</h3>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        proj.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {proj.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech stack badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {proj.techStack.split(',').map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5"
                  >
                    <GithubIcon className="w-3.5 h-3.5" /> Source Code
                  </a>
                )}

                {proj.projectUrl && (
                  <a
                    href={proj.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Live Demo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Add Project</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Orchestrator"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java, Spring Boot, React, Kafka, Docker"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Architecture</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the problem solved, architectural approach, and key achievements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://demo.app"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                </select>
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
                  {submitting ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
