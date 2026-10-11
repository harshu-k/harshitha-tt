import React, { useState, useEffect } from 'react';
import { studentApi, certificationsApi, skillsApi } from '../../services/api';
import {
  GraduationCap,
  Award,
  Code,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  UserCheck,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [pendingCertifications, setPendingCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'verifications'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, certRes] = await Promise.all([
        studentApi.getAllStudents(),
        certificationsApi.getAllCertifications(),
      ]);
      setStudents(stuRes.data || []);
      const allCerts = certRes.data || [];
      setPendingCertifications(allCerts.filter((c) => c.verificationStatus === 'PENDING'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCert = async (certId, status) => {
    const notes = status === 'VERIFIED' ? 'Verified by Placement Coordinator' : 'Documentation insufficient';
    try {
      await certificationsApi.updateStatus(certId, status, notes);
      setMessage(`Certification status updated to ${status}!`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error updating certification: ' + err.message);
    }
  };

  const handleEndorseSkill = async (skillId) => {
    try {
      await skillsApi.verifySkill(skillId);
      setMessage('Skill verified and endorsed!');
      fetchData();
      if (selectedStudent) {
        // Refresh selected student details
        const refreshed = await studentApi.getStudentById(selectedStudent.userId);
        setSelectedStudent(refreshed.data);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error endorsing skill: ' + err.message);
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.fullName && s.fullName.toLowerCase().includes(term)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(term)) ||
      (s.department && s.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Student Profiles & Credential Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse complete student records, endorse skills, and approve uploaded industry credentials.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Student Directory ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending Certs
            {pendingCertifications.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
                {pendingCertifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {message}
        </div>
      )}

      {/* VIEW 1: Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, roll no, department..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || 'Student')}&background=7c3aed&color=fff`}
                      alt={s.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-800 ring-2 ring-purple-50 dark:ring-purple-950"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{s.fullName}</h3>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Roll: {s.rollNumber}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{s.course || 'B.Tech CS'}</p>
                    <p className="text-slate-500 dark:text-slate-400">{s.department}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-purple-700 dark:text-purple-400">CGPA: {s.cgpa || 8.0} / 10</span>
                      <span className="text-slate-500 dark:text-slate-400">Grad: {s.graduationYear}</span>
                    </div>
                  </div>

                  {/* Skills count pill */}
                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-md">
                      {s.skills?.length || 0} Skills
                    </span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                      {s.skills?.filter((sk) => sk.verified)?.length || 0} Endorsed
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="w-full py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Full Profile & Skills <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Pending Certifications */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {pendingCertifications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All student certifications verified!</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">No credentials pending review at this time.</p>
            </div>
          ) : (
            pendingCertifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{cert.title}</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                      Issued by: <strong>{cert.issuingOrganization}</strong> • Student: <strong>{cert.student?.fullName}</strong> ({cert.student?.department})
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {cert.credentialId && <span>ID: <code className="font-bold">{cert.credentialId}</code></span>}
                      {cert.issueDate && <span>Issued: {cert.issueDate}</span>}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          Verify Credential Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleVerifyCert(cert.id, 'VERIFIED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                  </button>
                  <button
                    onClick={() => handleVerifyCert(cert.id, 'REJECTED')}
                    className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto p-6 sm:p-8 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.fullName)}&background=7c3aed&color=fff`}
                  alt={selectedStudent.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-800"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedStudent.course} • Roll: {selectedStudent.rollNumber} • CGPA: {selectedStudent.cgpa}/10
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Career Objective */}
              {selectedStudent.careerObjective && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Career Objective</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    "{selectedStudent.careerObjective}"
                  </p>
                </div>
              )}

              {/* Skills Matrix with Endorse buttons */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Skills & Endorsements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedStudent.skills?.map((skill) => (
                    <div key={skill.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white">{skill.name}</strong>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                          {skill.proficiency} • {skill.category}
                        </span>
                      </div>

                      {skill.verified ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          ✓ Endorsed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEndorseSkill(skill.id)}
                          className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors"
                        >
                          Endorse Skill
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Projects</h4>
                <div className="space-y-2">
                  {selectedStudent.projects?.map((proj) => (
                    <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{proj.title}</div>
                      <div className="text-[11px] font-mono text-purple-700 dark:text-purple-400 mt-0.5">{proj.techStack}</div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
