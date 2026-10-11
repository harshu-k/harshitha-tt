import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import {
  BarChart3,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart
} from 'lucide-react';

const CoordinatorDashboard = ({ setActiveTab }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getDashboard();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    APPLIED: 'bg-amber-500',
    UNDER_REVIEW: 'bg-blue-500',
    SHORTLISTED: 'bg-indigo-500',
    INTERVIEW_SCHEDULED: 'bg-purple-500',
    OFFERED: 'bg-emerald-400',
    ACCEPTED: 'bg-emerald-600',
    REJECTED: 'bg-rose-500',
    COMPLETED: 'bg-slate-700',
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Career & Placement Cell Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Placement Analytics & Executive Dashboard
            </h1>
            <p className="text-indigo-200/90 text-xs sm:text-sm">
              Real-time oversight of student skills, company listings, and internship recruitment pipeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('manage-internships')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-purple-600" /> Post Internship
            </button>
            <button
              onClick={() => setActiveTab('applicant-review')}
              className="px-4 py-2.5 rounded-xl bg-purple-700/60 hover:bg-purple-700 text-white border border-purple-400/30 font-semibold text-xs backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-purple-200" /> Review Applications
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{analytics?.totalStudents || 0}</div>
            <p className="text-xs text-indigo-600 font-semibold mt-1">Enrolled candidates</p>
          </div>
        </div>

        {/* Card 2: Active Internships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Openings</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{analytics?.activeInternships || 0} Openings</div>
            <p className="text-xs text-purple-600 font-semibold mt-1">{analytics?.totalInternships || 0} Total Listings</p>
          </div>
        </div>

        {/* Card 3: Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{analytics?.totalApplications || 0}</div>
            <p className="text-xs text-blue-600 font-semibold mt-1">{analytics?.totalPending || 0} Pending decisions</p>
          </div>
        </div>

        {/* Card 4: Placement Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">
              {analytics?.placementRatePercentage || 0}%
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {analytics?.totalSelected || 0} Placed Students
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills In Demand */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Top Skills In Demand
              </h3>
              <p className="text-xs text-slate-500">Skills most frequently requested by hiring companies</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.topSkillsInDemand &&
              Object.entries(analytics.topSkillsInDemand).map(([skill, count]) => {
                const maxCount = Math.max(...Object.values(analytics.topSkillsInDemand));
                const percentage = Math.round((count / maxCount) * 100);
                return (
                  <div key={skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{skill}</span>
                      <span className="text-indigo-600">{count} opening{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Application Status Pipeline Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" /> Recruitment Funnel Status
            </h3>
            <p className="text-xs text-slate-500">Application volume by current pipeline phase</p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.applicationStatusCounts &&
              Object.entries(analytics.applicationStatusCounts).map(([status, count]) => {
                const total = analytics.totalApplications || 1;
                const percentage = Math.round((count / total) * 100);
                const colorClass = statusColors[status] || 'bg-slate-400';

                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{status.replace('_', ' ')}</span>
                      <span className="text-slate-500 font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Department Distribution & Credentials Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Enrollment */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Department Participation</h3>
            <p className="text-xs text-slate-500">Candidate distribution across academic departments</p>
          </div>

          <div className="space-y-2 pt-1">
            {analytics?.departmentStudentCounts &&
              Object.entries(analytics.departmentStudentCounts).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                  <span className="font-bold text-slate-800">{dept}</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {count} student{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Credentials Verification Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Credential Verification Summary</h3>
            <p className="text-xs text-slate-500">Student certifications pending coordinator review</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-700">Verified Credentials</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{analytics?.verifiedCertifications || 0}</div>
              <p className="text-[11px] text-emerald-600 mt-1">Validated by coordinator</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-xs font-bold text-amber-700">Pending Review</span>
              <div className="text-2xl font-black text-amber-900 mt-1">{analytics?.pendingCertifications || 0}</div>
              <button
                onClick={() => setActiveTab('student-directory')}
                className="text-[11px] font-bold text-amber-800 underline mt-1 block"
              >
                Review now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

