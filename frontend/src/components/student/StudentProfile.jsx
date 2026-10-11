import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi, filesApi } from '../../services/api';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Code,
  Globe,
  FileText,
  Upload,
  CheckCircle2,
  Printer,
  X,
  ExternalLink,
  Save,
  Sparkles
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    rollNumber: '',
    course: '',
    department: '',
    graduationYear: 2026,
    cgpa: 8.5,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    careerObjective: '',
    resumeUrl: '',
    resumeFileName: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getProfile();
      if (res.data) {
        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          rollNumber: res.data.rollNumber || '',
          course: res.data.course || '',
          department: res.data.department || '',
          graduationYear: res.data.graduationYear || 2026,
          cgpa: res.data.cgpa || 8.0,
          githubUrl: res.data.githubUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          portfolioUrl: res.data.portfolioUrl || '',
          careerObjective: res.data.careerObjective || '',
          resumeUrl: res.data.resumeUrl || '',
          resumeFileName: res.data.resumeFileName || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await studentApi.updateProfile(formData);
      setProfile(res.data);
      if (user) {
        setUser({ ...user, fullName: formData.fullName, department: formData.department });
      }
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await filesApi.uploadFile(file);
      const fileUrl = res.data?.fileUrl;
      const fileName = res.data?.originalName;

      setFormData((prev) => ({
        ...prev,
        resumeUrl: fileUrl,
        resumeFileName: fileName,
      }));

      // Automatically update profile
      await studentApi.updateProfile({
        ...formData,
        resumeUrl: fileUrl,
        resumeFileName: fileName,
      });

      setMessage('Resume uploaded successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Student')}&background=4f46e5&color=fff&size=128`}
              alt="Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm ring-4 ring-indigo-50"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{formData.fullName || user?.fullName}</h1>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {formData.course} • Roll No: {formData.rollNumber}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="font-semibold text-indigo-600">CGPA: {formData.cgpa} / 10</span>
              <span>•</span>
              <span>Graduation: {formData.graduationYear}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowResumeModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> ATS Resume Generator & Export
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Academic & Personal Details</h2>
          <p className="text-xs text-slate-500">Keep your academic and contact details up-to-date for internship coordinators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Registration Number</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science & Engineering"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cumulative CGPA (out of 10.0)</label>
            <input
              type="number"
              step="0.01"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold text-indigo-700"
            />
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-3">Online Profiles & Portfolios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
              <div className="relative">
                <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Personal Portfolio / Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Career Objective / Summary Statement (Rendered on ATS Resume)
          </label>
          <textarea
            name="careerObjective"
            rows="3"
            value={formData.careerObjective}
            onChange={handleChange}
            placeholder="Seeking an impactful internship in Full-Stack Software Development where I can apply Java, Spring Boot, React, and cloud architectures..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* Upload Resume Attachment */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">Resume PDF Document (Optional Attachment)</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>{uploadingResume ? 'Uploading...' : 'Upload PDF / DOCX'}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </label>

            {formData.resumeFileName && (
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-2 rounded-xl">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">{formData.resumeFileName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* ATS Resume Preview & Print Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full my-8 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-black text-sm text-slate-900">ATS-Optimized Resume Preview</h3>
                  <p className="text-[11px] text-slate-500">Standard single-page format ready for recruiters and applicant tracking systems</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Sheet Content */}
            <div className="p-8 sm:p-12 overflow-y-auto bg-white text-slate-900 font-sans resume-sheet">
              {/* Name & Contact */}
              <div className="text-center pb-4 border-b-2 border-slate-800">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900">
                  {formData.fullName || user?.fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs font-medium text-slate-700">
                  <span>{user?.email}</span>
                  {formData.phone && <span>• {formData.phone}</span>}
                  {formData.rollNumber && <span>• Roll: {formData.rollNumber}</span>}
                  {formData.githubUrl && <span>• {formData.githubUrl.replace('https://', '')}</span>}
                  {formData.linkedinUrl && <span>• {formData.linkedinUrl.replace('https://', '')}</span>}
                </div>
              </div>

              {/* Career Objective */}
              {formData.careerObjective && (
                <div className="mt-5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {formData.careerObjective}
                  </p>
                </div>
              )}

              {/* Education */}
              <div className="mt-5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Education
                </h2>
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{formData.course || 'B.Tech in Computer Science'}</span>
                    <p className="text-slate-600">{formData.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-700">CGPA: {formData.cgpa} / 10.0</span>
                    <p className="text-slate-500">Graduation: {formData.graduationYear}</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Technical Skills & Proficiencies
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Core Technologies: </span>
                      <span className="text-slate-700">
                        {profile.skills.map((s) => `${s.name}${s.verified ? ' [Verified]' : ''}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {profile?.projects && profile.projects.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Key Projects
                  </h2>
                  <div className="space-y-3">
                    {profile.projects.map((proj) => (
                      <div key={proj.id} className="text-xs">
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-slate-900">{proj.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">{proj.status}</span>
                        </div>
                        <p className="text-[11px] text-indigo-700 font-mono font-medium">Stack: {proj.techStack}</p>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile?.certifications && profile.certifications.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Certifications & Credentials
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    {profile.certifications.map((c) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">
                          <strong>{c.title}</strong> — {c.issuingOrganization}
                          {c.credentialId && <span className="text-slate-500"> (ID: {c.credentialId})</span>}
                        </span>
                        <span className={`text-[10px] font-bold ${c.verificationStatus === 'VERIFIED' ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {c.verificationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
