import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, Compass, BarChart2, BookOpen, MapPin, 
  MessageSquare, CheckCircle2, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';
import API from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [astRes, rmRes, exRes] = await Promise.all([
          API.get('/assessment/results/me'),
          API.get('/roadmap/me'),
          API.get('/exams/all')
        ]);
        setAssessment(astRes.data);
        setRoadmap(rmRes.data);
        setExams(exRes.data.exams || []);
      } catch (err) {
        console.warn('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const topCareer = assessment?.recommendedCareers?.[0] || {
    title: 'AI & Machine Learning Engineer',
    matchPercentage: 95,
    rationale: 'High quantitative aptitude and investigative curiosity.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="glass-pill text-blue-400">Welcome Back</span>
            <span className="text-xs text-slate-400">• {user?.grade || 'Grade 11 (Science)'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {user?.name || 'Aarav'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your primary career match is <strong className="text-blue-400">{topCareer.title}</strong> with a <span className="text-emerald-400 font-bold">{topCareer.matchPercentage}% fit score</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assessment" className="btn-primary text-xs">
            <Brain className="w-4 h-4" /> Retake Assessment
          </Link>
          <Link to="/mentor" className="btn-secondary text-xs">
            <MessageSquare className="w-4 h-4 text-blue-400" /> AI Mentor Chat
          </Link>
        </div>
      </div>

      {/* Main Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recommended Career Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Recommendation</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
              {topCareer.matchPercentage}% Match
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{topCareer.title}</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{topCareer.rationale}</p>
          </div>
          <Link to="/skill-gap" className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:underline pt-2">
            View Skill Gap Radar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Roadmap Progress Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Roadmap</span>
            <span className="text-xs font-bold text-blue-400">{roadmap?.progressPercentage || 16.6}% Completed</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${roadmap?.progressPercentage || 16.6}%` }}
            ></div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Month 1: Foundational Science & Math Mastery</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-4 h-4 rounded-full border border-blue-400/60 text-[10px] flex items-center justify-center font-bold text-blue-400">2</span>
              <span className="truncate">Month 2: Skill Gap Bridge & Python Basics</span>
            </div>
          </div>

          <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:underline pt-2">
            Open Full Milestone Timeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Entrance Exam Alerts */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Exams</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-3">
            {exams.slice(0, 2).map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{ex.exam_name}</span>
                  <span className="text-[10px] text-slate-400">{ex.exam_date}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {ex.preparation_months}m prep
                </span>
              </div>
            ))}
          </div>

          <Link to="/exams" className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold hover:underline pt-2">
            Explore All Recommended Exams <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/colleges" className="glass-card p-4 hover:border-blue-500/50 flex flex-col items-center text-center space-y-2 group">
          <MapPin className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white">College Geo Match</span>
          <span className="text-[10px] text-slate-400">Filter nearby colleges</span>
        </Link>

        <Link to="/job-market" className="glass-card p-4 hover:border-purple-500/50 flex flex-col items-center text-center space-y-2 group">
          <BarChart2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white">Job & Salary Trends</span>
          <span className="text-[10px] text-slate-400">Market growth data</span>
        </Link>

        <Link to="/job-market" className="glass-card p-4 hover:border-emerald-500/50 flex flex-col items-center text-center space-y-2 group">
          <Sparkles className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white">Budget Calculator</span>
          <span className="text-[10px] text-slate-400">Tuition & loan planner</span>
        </Link>

        <Link to="/mentor" className="glass-card p-4 hover:border-indigo-500/50 flex flex-col items-center text-center space-y-2 group">
          <MessageSquare className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white">24/7 AI Mentor</span>
          <span className="text-[10px] text-slate-400">Ask career questions</span>
        </Link>
      </div>

    </div>
  );
}
