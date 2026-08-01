import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, User, Mail, Lock, GraduationCap, MapPin, DollarSign } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    grade: 'Grade 11 (Science)',
    location: 'Mumbai, MH',
    budgetMin: 50000,
    budgetMax: 400000,
    uncertainty: 4
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email || 'student@example.com', formData.password || 'password');
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          grade: formData.grade,
          location: formData.location,
          budgetRange: { min: Number(formData.budgetMin), max: Number(formData.budgetMax) },
          uncertainty: Number(formData.uncertainty)
        });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleType) => {
    setLoading(true);
    try {
      if (roleType === 'parent') {
        await login('parent@example.com', 'password');
      } else {
        await login('student@example.com', 'password');
      }
      onClose();
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-md p-6 relative shadow-2xl border-slate-700/80">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {isLogin ? 'Welcome Back to CareerX' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to access your assessment & roadmap' : 'Start your personalized AI career journey today'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Demo Pre-fill Bar */}
        <div className="mb-5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400 font-medium block mb-2">⚡ 1-Click Instant Demo Login</span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleQuickDemo('student')}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg cursor-pointer font-medium"
            >
              Student Demo
            </button>
            <button
              onClick={() => handleQuickDemo('parent')}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg cursor-pointer font-medium"
            >
              Parent Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grade / Stream</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Grade 9-10">Grade 9–10</option>
                  <option value="Grade 11 (Science)">Grade 11 (Science)</option>
                  <option value="Grade 12 (Commerce)">Grade 12 (Commerce)</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, MH"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs py-3 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Complete Setup & Enter')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-blue-400 hover:underline font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
