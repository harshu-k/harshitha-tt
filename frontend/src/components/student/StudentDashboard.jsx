import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi, internshipsApi, applicationsApi } from '../../services/api';
import {
  Sparkles,
  TrendingUp,
  Award,
  Code,
  Briefcase,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Building,
  MapPin,
  Calendar,
  Download
} from 'lucide-react';

const StudentDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, recRes, appRes] = await Promise.all([
          studentApi.getProfile(),
          internshipsApi.getRecommendations(),
          applicationsApi.getMyApplications(),
        ]);
        setProfile(profRes.data);
        setRecommendations(recRes.data || []);
        setApplications(appRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const verifiedSkillsCount = profile?.skills?.filter((s) => s.verified)?.length || 0;
  const totalSkillsCount = profile?.skills?.length || 0;
  const verifiedCertsCount = profile?.certifications?.filter((c) => c.verificationStatus === 'VERIFIED')?.length || 0;
  const topMatch = recommendations[0];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Skill-Powered Internship Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Student'}! 👋
            </h1>
            <p className="text-indigo-200/90 text-xs sm:text-sm leading-relaxed">
              {profile?.department || 'Computer Science & Engineering'} • Roll: {profile?.rollNumber || '22CSE108'} • CGPA: {profile?.cgpa || '8.5'}/10
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('internships')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" /> Explore Internships
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-400/30 font-semibold text-xs backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-indigo-200" /> Export ATS Resume
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Skills & Endorsements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Matrix</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{totalSkillsCount} Skills</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {verifiedSkillsCount} Coordinator Endorsed
            </p>
          </div>
        </div>

        {/* Card 2: Certifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certifications</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{profile?.certifications?.length || 0} Creds</div>
            <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {verifiedCertsCount} Verified
            </p>
          </div>
        </div>

        {/* Card 3: Active Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{applications.length} Submissions</div>
            <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {applications.filter((a) => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length} In Progress
            </p>
          </div>
        </div>

        {/* Card 4: Top Skill Match */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Match Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">
              {topMatch ? `${topMatch.matchPercentage}%` : '95%'}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              {topMatch?.internship?.companyName || 'Google Cloud'} match
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Recommendations & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill-Based Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Skill-Matched Recommendations
              </h2>
              <p className="text-xs text-slate-500">Automated matching score based on your registered skills and CGPA</p>
            </div>
            <button
              onClick={() => setActiveTab('internships')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => {
              const item = rec.internship;
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {item.companyLogo ? (
                          <img src={item.companyLogo} alt={item.companyName} className="w-8 h-8 object-contain" />
                        ) : (
                          <Building className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.companyName} • {item.location} ({item.workplaceType})
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rec.matchPercentage}% Match
                      </span>
                      <div className="text-[11px] font-bold text-slate-700 mt-1">{item.stipend}</div>
                    </div>
                  </div>

                  {/* Matched skills pill preview */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Matched:</span>
                      {rec.matchedSkills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ✓ {s}
                        </span>
                      ))}
                      {rec.missingSkills.length > 0 && (
                        <span className="text-[10px] font-medium text-amber-700 px-1.5 py-0.5">
                          +{rec.missingSkills.length} learnable
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('internships')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Applications Status Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Application Activity
            </h2>
            <button
              onClick={() => setActiveTab('applications')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              All ({applications.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No internship applications yet.</p>
                <button
                  onClick={() => setActiveTab('internships')}
                  className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Browse open positions
                </button>
              </div>
            ) : (
              applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{app.internshipTitle}</h4>
                      <p className="text-[11px] text-slate-500">{app.companyName}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-100 text-purple-800' :
                      app.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  {app.coordinatorFeedback && (
                    <p className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg mt-2 border border-indigo-100/60 font-medium">
                      💬 "{app.coordinatorFeedback}"
                    </p>
                  )}

                  {app.interviewSchedule && (
                    <div className="mt-2 text-[11px] font-semibold text-purple-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Interview: {new Date(app.interviewSchedule).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

