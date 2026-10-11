import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../../services/api';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Building,
  GraduationCap,
  MessageSquare,
  X,
  ExternalLink
} from 'lucide-react';

const ApplicantReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [actionForm, setActionForm] = useState({
    status: 'SHORTLISTED',
    coordinatorFeedback: '',
    interviewSchedule: '',
  });

  const statuses = [
    'ALL',
    'APPLIED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'ACCEPTED',
    'REJECTED',
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getAllApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (app) => {
    setSelectedApp(app);
    setActionForm({
      status: app.status || 'SHORTLISTED',
      coordinatorFeedback: app.coordinatorFeedback || '',
      interviewSchedule: app.interviewSchedule ? app.interviewSchedule.substring(0, 16) : '',
    });
    setShowActionModal(true);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSubmitting(true);
    try {
      await applicationsApi.updateStatus(
        selectedApp.id,
        actionForm.status,
        actionForm.coordinatorFeedback,
        actionForm.interviewSchedule ? actionForm.interviewSchedule + ':00' : null
      );
      setMessage(`Application for ${selectedApp.studentName} updated to ${actionForm.status.replace('_', ' ')}!`);
      setShowActionModal(false);
      fetchApplications();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Error updating application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (app.studentName && app.studentName.toLowerCase().includes(term)) ||
      (app.internshipTitle && app.internshipTitle.toLowerCase().includes(term)) ||
      (app.companyName && app.companyName.toLowerCase().includes(term)) ||
      (app.studentRollNumber && app.studentRollNumber.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
      case 'OFFERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Applicant Evaluation & Review Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate candidate credentials, schedule interviews, and deliver official feedback.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, roll no, or role..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {status.replace('_', ' ')} {status !== 'ALL' && `(${applications.filter((a) => a.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Applications Cards */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No applications found matching criteria.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-base shrink-0">
                    {app.studentName ? app.studentName.charAt(0) : 'S'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{app.studentName}</h3>
                      {app.studentRollNumber && (
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {app.studentRollNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.studentDepartment || 'Computer Science'} • CGPA: <strong>{app.studentCgpa || '8.5'}</strong>/10 • {app.studentEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusBadge(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleOpenAction(app)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    Take Decision
                  </button>
                </div>
              </div>

              {/* Applied Role Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Position:</span>{' '}
                  <strong className="text-slate-900">{app.internshipTitle}</strong> at{' '}
                  <span className="font-bold text-indigo-700">{app.companyName}</span>
                </div>
                <div className="text-slate-500">
                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                </div>
              </div>

              {/* Cover Letter excerpt */}
              {app.coverLetter && (
                <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-800">Candidate Statement:</span>
                  <p className="mt-1 italic leading-relaxed text-slate-700">"{app.coverLetter}"</p>
                </div>
              )}

              {/* Active Feedback or Interview details */}
              {(app.coordinatorFeedback || app.interviewSchedule) && (
                <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
                  {app.coordinatorFeedback && (
                    <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" /> Note: {app.coordinatorFeedback}
                    </div>
                  )}
                  {app.interviewSchedule && (
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                      <Calendar className="w-3.5 h-3.5" /> Interview: {new Date(app.interviewSchedule).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Decision / Action Modal */}
      {showActionModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Update Application Status
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.studentName} for {selectedApp.internshipTitle}
                </p>
              </div>
              <button onClick={() => setShowActionModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Next Pipeline Stage</label>
                <select
                  value={actionForm.status}
                  onChange={(e) => setActionForm({ ...actionForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted for Rounds</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="OFFERED">Offer Extended</option>
                  <option value="ACCEPTED">Offer Accepted / Selected</option>
                  <option value="REJECTED">Application Rejected</option>
                </select>
              </div>

              {actionForm.status === 'INTERVIEW_SCHEDULED' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={actionForm.interviewSchedule}
                    onChange={(e) => setActionForm({ ...actionForm, interviewSchedule: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coordinator Remarks & Feedback (Will notify student)
                </label>
                <textarea
                  rows="3"
                  value={actionForm.coordinatorFeedback}
                  onChange={(e) => setActionForm({ ...actionForm, coordinatorFeedback: e.target.value })}
                  placeholder="e.g. Excellent project portfolio. Technical Round 1 Google Meet link dispatched..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Save & Dispatch Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantReview;

