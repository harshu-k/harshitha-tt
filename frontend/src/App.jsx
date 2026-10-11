import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

// Student components
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import SkillsManagement from './components/student/SkillsManagement';
import CertificationsManagement from './components/student/CertificationsManagement';
import ProjectsManagement from './components/student/ProjectsManagement';
import InternshipExplorer from './components/student/InternshipExplorer';
import MyApplications from './components/student/MyApplications';

// Coordinator components
import CoordinatorDashboard from './components/coordinator/CoordinatorDashboard';
import ManageInternships from './components/coordinator/ManageInternships';
import ApplicantReview from './components/coordinator/ApplicantReview';
import StudentDirectory from './components/coordinator/StudentDirectory';

import {
  GraduationCap,
  Sparkles,
  Briefcase,
  Award,
  Code,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';

const MainLayout = () => {
  const { user, isAuthenticated, isCoordinator, quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Synchronize initial tab based on role
  React.useEffect(() => {
    if (isCoordinator && !activeTab.startsWith('coordinator') && activeTab !== 'manage-internships' && activeTab !== 'applicant-review' && activeTab !== 'student-directory') {
      setActiveTab('coordinator-dashboard');
    } else if (!isCoordinator && activeTab.startsWith('coordinator')) {
      setActiveTab('dashboard');
    }
  }, [isCoordinator]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          /* Public Hero Landing Page */
          <div className="space-y-16 animate-in fade-in pb-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-8 sm:p-16 overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Spring Boot 3 + React Vite Production Platform
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Student Skill & Internship Management System
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  An integrated, AI-ready web platform empowering students to maintain verified skill profiles, showcase projects & certifications, and match with premier internship opportunities through intelligent skill-compatibility algorithms.
                </p>

                {/* Quick 1-Click Launch Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => quickDemoLogin('student')}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 group"
                  >
                    <span>⚡ Launch Student Portal (Harshitha Rao)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => quickDemoLogin('coordinator')}
                    className="px-6 py-3.5 rounded-2xl bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-400/30 font-black text-xs backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    <span>⚡ Launch Coordinator Portal (Dr. Rajesh)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all"
                  >
                    Custom Sign In / Register
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Skill Matrix & Verification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Students log technical and soft skills with multi-tiered proficiencies. Coordinators endorse credentials to prevent resume inflation.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Skill-Based Recommendations</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Algorithms calculate real-time match percentages between student skill sets, academic criteria, and internship specifications.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Recruitment Analytics & ATS Resume</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Comprehensive coordinator pipeline analytics combined with instant single-click generation of ATS-optimized student resumes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Views */
          <div>
            {/* Student Navigation Views */}
            {!isCoordinator && (
              <>
                {activeTab === 'dashboard' && <StudentDashboard setActiveTab={setActiveTab} />}
                {activeTab === 'profile' && <StudentProfile />}
                {activeTab === 'skills' && <SkillsManagement />}
                {activeTab === 'certifications' && <CertificationsManagement />}
                {activeTab === 'projects' && <ProjectsManagement />}
                {activeTab === 'internships' && <InternshipExplorer />}
                {activeTab === 'applications' && <MyApplications setActiveTab={setActiveTab} />}
              </>
            )}

            {/* Coordinator Navigation Views */}
            {isCoordinator && (
              <>
                {activeTab === 'coordinator-dashboard' && <CoordinatorDashboard setActiveTab={setActiveTab} />}
                {activeTab === 'manage-internships' && <ManageInternships />}
                {activeTab === 'applicant-review' && <ApplicantReview />}
                {activeTab === 'student-directory' && <StudentDirectory />}
              </>
            )}
          </div>
        )}
      </main>

      {/* Production Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-black text-slate-900 dark:text-white">SSIMS</span>
            <span>•</span>
            <span>Student Skill & Internship Management System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span>Spring Boot 3 (Java 21)</span>
            <span>•</span>
            <span>React 19 + Vite</span>
            <span>•</span>
            <span>H2 / MySQL SQL Database</span>
            <span>•</span>
            <span>JWT Stateless Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
