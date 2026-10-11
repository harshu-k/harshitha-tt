import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, GraduationCap, Briefcase, CheckCircle, Sparkles } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    department: 'Computer Science & Engineering',
    phone: '',
    rollNumber: '',
    course: 'B.Tech Computer Science',
    graduationYear: 2026,
    cgpa: 8.5,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (type) => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin(type);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-3 ring-1 ring-white/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {isRegister ? 'Join SSIMS Platform' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            Student Skill & Internship Management System
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-indigo-50/70 p-3 px-6 border-b border-indigo-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 1-Click Demo Login:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemo('student')}
              className="px-2.5 py-1 text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200 rounded-lg shadow-2xs hover:bg-indigo-50 transition-all"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleDemo('coordinator')}
              className="px-2.5 py-1 text-[11px] font-bold bg-white text-purple-700 border border-purple-200 rounded-lg shadow-2xs hover:bg-purple-50 transition-all"
            >
              Coordinator
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 text-sm font-semibold">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              !isRegister
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              isRegister
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Harshitha Rao"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ROLE_STUDENT' })}
                    className={`p-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      formData.role === 'ROLE_STUDENT'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ROLE_COORDINATOR' })}
                    className={`p-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      formData.role === 'ROLE_COORDINATOR'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Coordinator
                  </button>
                </div>
              </div>

              {formData.role === 'ROLE_STUDENT' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. 22CSE108"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      placeholder="e.g. 8.75"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

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
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@ssims.edu"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : (isRegister ? 'Complete Registration' : 'Sign In to Portal')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

