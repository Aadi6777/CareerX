import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, LogIn, UserPlus, Shield, UserCheck, AlertCircle } from 'lucide-react';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { login, signup, loginWithGoogle, isSupabaseAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [grade, setGrade] = useState('Grade 11 (Science)');
  const [location, setLocation] = useState('Bengaluru, KA');
  
  const [showGoogleMailPrompt, setShowGoogleMailPrompt] = useState(false);
  const [googleMailInput, setGoogleMailInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup({ name, email, password, role, grade, location });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (emailInput) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(emailInput || googleMailInput);
      onClose();
    } catch (err) {
      setError(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 relative space-y-6 border-blue-500/30 shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back to CareerX' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Sign in to access your assessment reports & roadmap' : 'Get personalized AI psychometric evaluation & college match'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              if (isSupabaseAuth) {
                handleGoogleAuth();
              } else {
                setShowGoogleMailPrompt(!showGoogleMailPrompt);
              }
            }}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google Mail</span>
          </button>

          {showGoogleMailPrompt && (
            <div className="p-3 bg-slate-900 border border-blue-500/30 rounded-xl space-y-2 animate-fade-in">
              <label className="text-[11px] text-slate-300 font-bold block">Enter Google Mail ID:</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  value={googleMailInput}
                  onChange={(e) => setGoogleMailInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(googleMailInput || 'student@gmail.com')}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-950 px-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">or email</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent / Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Grade / Stream</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Grade 9-10">Grade 9 - 10</option>
                    <option value="Grade 11 (Science)">Grade 11 (Science)</option>
                    <option value="Grade 11 (Commerce)">Grade 11 (Commerce)</option>
                    <option value="Grade 12">Grade 12 / Pre-Univ</option>
                    <option value="Undergraduate">College Student</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs justify-center font-bold"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}
          </button>
        </form>

        {/* Quick Demo Instant Logins */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider">
            Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student@example.com')}
              className="btn-secondary text-[11px] py-2 justify-center"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('parent@example.com')}
              className="btn-secondary text-[11px] py-2 justify-center"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Demo Parent
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
