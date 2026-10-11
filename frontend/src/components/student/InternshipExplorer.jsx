import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { internshipsApi, applicationsApi, studentApi } from '../../services/api';
import {
  Briefcase,
  Search,
  Filter,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

const InternshipExplorer = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState('ALL');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intRes, recRes, profRes] = await Promise.all([
        internshipsApi.getInternships(search),
        internshipsApi.getRecommendations().catch(() => ({ data: [] })),
        studentApi.getProfile().catch(() => ({ data: null })),
      ]);

      setInternships(intRes.data || []);

      // Build recommendations map by internship ID
      const recMap = {};
      (recRes.data || []).forEach((r) => {
        recMap[r.internship.id] = r;
      });
      setRecommendations(recMap);
      setStudentProfile(profRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = (internship) => {
    setSelectedInternship(internship);
    setCoverLetter(
      `Dear Hiring Team at ${internship.companyName},\n\nI am excited to apply for the ${internship.title} position. With my background in ${studentProfile?.department || 'Computer Science'} (CGPA: ${studentProfile?.cgpa || '8.5'}) and my practical skills in ${internship.requiredSkills}, I believe I can make an immediate contribution to your engineering team.\n\nThank you for considering my application.\n\nSincerely,\n${user?.fullName || 'Applicant'}`
    );
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedInternship) return;
    setApplying(true);
    try {
      await applicationsApi.apply({
        internshipId: selectedInternship.id,
        coverLetter: coverLetter,
        resumeUrl: studentProfile?.resumeUrl,
      });

      setMessage(`Application successfully submitted for ${selectedInternship.title} at ${selectedInternship.companyName}!`);
      setApplyModalOpen(false);
      // Update local status
      setInternships((prev) =>
        prev.map((i) => (i.id === selectedInternship.id ? { ...i, userApplied: true } : i))
      );
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      alert('Application failed: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  const filteredList = internships.filter((item) => {
    if (workplaceFilter === 'ALL') return true;
    return item.workplaceType === workplaceFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" /> Discover Internship Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified corporate internships with skill-compatibility match scoring.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or skill..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Workplace Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'REMOTE', 'HYBRID', 'ONSITE'].map((type) => (
          <button
            key={type}
            onClick={() => setWorkplaceFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              workplaceFilter === type
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {type === 'ALL' ? 'All Formats' : type}
          </button>
        ))}
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No internship openings match your search criteria.</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const rec = recommendations[item.id];
            const matchScore = rec ? rec.matchPercentage : 80;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0">
                        {item.companyLogo ? (
                          <img src={item.companyLogo} alt={item.companyName} className="w-8 h-8 object-contain" />
                        ) : (
                          <Building className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">{item.companyName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.location} • <span className="font-semibold text-indigo-700">{item.workplaceType}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> {matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.requiredSkills.split(',').map((skill, idx) => {
                      const clean = skill.trim();
                      const isMatched = rec?.matchedSkills?.some(
                        (ms) => ms.toLowerCase() === clean.toLowerCase()
                      );

                      return (
                        <span
                          key={idx}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {isMatched ? '✓ ' : ''}{clean}
                        </span>
                      );
                    })}
                  </div>

                  {/* Key metadata pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-900">💰 {item.stipend}</span>
                    <span>⏱ {item.duration}</span>
                    <span>🎓 Min CGPA: {item.minCgpa || 6.0}</span>
                    {item.openings && <span>👥 {item.openings} Openings</span>}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Deadline: {item.applicationDeadline || 'Rolling'}
                  </span>

                  {item.userApplied ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 cursor-default">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenApply(item)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Apply Modal */}
      {applyModalOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Apply for {selectedInternship.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedInternship.companyName} • {selectedInternship.stipend}</p>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Applying as: {user?.fullName}
                </div>
                <div className="text-[11px] text-slate-600">
                  {studentProfile?.course} • CGPA: {studentProfile?.cgpa || '8.5'} • Roll: {studentProfile?.rollNumber}
                </div>
                {studentProfile?.resumeFileName && (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Attached Resume: {studentProfile.resumeFileName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Letter / Statement of Purpose
                </label>
                <textarea
                  rows="5"
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipExplorer;

