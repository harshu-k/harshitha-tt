import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../../services/api';
import {
  FileText,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const MyApplications = ({ setActiveTab }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getMyApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
      case 'OFFERED':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'SHORTLISTED':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'REJECTED':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const steps = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Review' },
    { key: 'SHORTLISTED', label: 'Shortlist' },
    { key: 'INTERVIEW_SCHEDULED', label: 'Interview' },
    { key: 'ACCEPTED', label: 'Offer' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'SHORTLISTED': return 2;
      case 'INTERVIEW_SCHEDULED': return 3;
      case 'OFFERED':
      case 'ACCEPTED':
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Internship Application Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status tracking, coordinator feedback, and interview schedules.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('internships')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          Explore More Openings
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">You have not submitted any applications yet.</p>
            <button
              onClick={() => setActiveTab('internships')}
              className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Discover open positions
            </button>
          </div>
        ) : (
          applications.map((app) => {
            const currentStep = getStepIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {app.companyLogo ? (
                        <img src={app.companyLogo} alt={app.companyName} className="w-8 h-8 object-contain" />
                      ) : (
                        <Building className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {app.internshipTitle}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                        {app.companyName} • Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusBadge(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Status Timeline Progression */}
                {!isRejected && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 z-0"></div>
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      ></div>

                      {steps.map((s, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={s.key} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-950/80 shadow-xs'
                                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold mt-1.5 hidden sm:block ${
                              isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Alert Box if scheduled */}
                {app.interviewSchedule && (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">Technical Interview Scheduled!</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                        Date & Time: <strong>{new Date(app.interviewSchedule).toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Coordinator Feedback Box */}
                {app.coordinatorFeedback && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Placement Coordinator Remarks:</span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">"{app.coordinatorFeedback}"</p>
                    </div>
                  </div>
                )}

                {/* Cover Letter preview */}
                {app.coverLetter && (
                  <details className="text-xs text-slate-600 dark:text-slate-400">
                    <summary className="cursor-pointer font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                      View Submitted Statement
                    </summary>
                    <p className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl whitespace-pre-line border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {app.coverLetter}
                    </p>
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyApplications;
