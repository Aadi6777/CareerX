import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, LayoutDashboard, Brain, BarChart2, MapPin, 
  BookOpen, MessageSquare, Briefcase, Users, ShieldAlert, 
  LogOut, UserCheck, Menu, X, Sparkles, LogIn 
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout, isSupabaseAuth } = useAuth();
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assessment', label: 'Psychometric AI', icon: Brain },
    { path: '/skill-gap', label: 'Skill Gap', icon: BarChart2 },
    { path: '/roadmap', label: 'Roadmap', icon: Compass },
    { path: '/exams', label: 'Exams', icon: BookOpen },
    { path: '/colleges', label: 'Colleges Geo', icon: MapPin },
    { path: '/mentor', label: '24/7 AI Mentor', icon: MessageSquare },
    { path: '/job-market', label: 'Job & Budget', icon: Briefcase },
  ];

  if (user?.role === 'parent') {
    navLinks.push({ path: '/parent', label: 'Parent View', icon: Users });
  }

  if (user?.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin Portal', icon: ShieldAlert });
  }

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                CareerX
              </span>
              <span className="block text-[10px] text-blue-400 font-semibold tracking-wider uppercase -mt-1 flex items-center gap-1">
                AI Companion
                {isSupabaseAuth && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Connected to Supabase Auth"></span>}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className="text-[10px] text-blue-400 uppercase font-medium">{user.grade || user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="btn-secondary text-xs px-3.5 py-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="btn-primary text-xs px-4 py-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && <AuthModal initialMode={authMode} onClose={() => setIsAuthOpen(false)} />}
    </>
  );
}
