import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import {
  GraduationCap,
  Briefcase,
  Award,
  Code,
  FileText,
  BarChart3,
  Bell,
  LogOut,
  UserCheck,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isAuthenticated, isCoordinator, logout, quickDemoLogin } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Resume', icon: GraduationCap },
    { id: 'skills', label: 'Skills Matrix', icon: Code },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'internships', label: 'Explore Internships', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
  ];

  const coordinatorNavItems = [
    { id: 'coordinator-dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'manage-internships', label: 'Manage Internships', icon: Briefcase },
    { id: 'applicant-review', label: 'Applicant Review', icon: UserCheck },
    { id: 'student-directory', label: 'Students & Verification', icon: GraduationCap },
  ];

  const navItems = isCoordinator ? coordinatorNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab(isCoordinator ? 'coordinator-dashboard' : 'dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-50 dark:ring-indigo-950 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent">
                  SSIMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {isCoordinator ? 'Admin' : 'Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Skill & Internship Management</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-400/30 dark:shadow-none'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Header Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher if logged out */}
            {!isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => quickDemoLogin('student')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
                >
                  ⚡ Student Demo
                </button>
                <button
                  onClick={() => quickDemoLogin('coordinator')}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  ⚡ Admin Demo
                </button>
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg shadow-sm transition-all"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 transition-all"
              title={isDark ? "Switch to Light Mode" : "Switch to Black Theme (Dark Mode)"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Notification Bell Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (!n.readStatus) markAsRead(n.id);
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left ${
                              !n.readStatus ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</span>
                              {!n.readStatus && (
                                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile and Logout */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-800">
                  <img
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6366f1&color=fff`}
                    alt={user?.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-50 dark:ring-indigo-950"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                      {user?.fullName}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      {isCoordinator ? 'Placement Coordinator' : (user?.department || 'Student')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1.5 animate-in fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
