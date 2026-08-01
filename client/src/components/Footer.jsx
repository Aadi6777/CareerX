import React from 'react';
import { Compass, Heart, ShieldCheck, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-white tracking-tight">CareerX</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-driven psychometric counseling, skill-gap analytics, dynamic learning roadmaps, and 24/7 student guidance.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Core Modules</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="/assessment" className="hover:text-blue-400">Psychometric Engine</a></li>
            <li><a href="/skill-gap" className="hover:text-blue-400">Skill Gap Radar</a></li>
            <li><a href="/roadmap" className="hover:text-blue-400">Personalized Roadmap</a></li>
            <li><a href="/colleges" className="hover:text-blue-400">College Geo Matching</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Decision Tools</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="/exams" className="hover:text-blue-400">Entrance Exam Recommender</a></li>
            <li><a href="/job-market" className="hover:text-blue-400">Job Market Trends</a></li>
            <li><a href="/job-market" className="hover:text-blue-400">Education Budget Planner</a></li>
            <li><a href="/mentor" className="hover:text-blue-400">24/7 AI Mentor</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Safety & Helplines</h4>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 24/7 Student Safety Flag
            </div>
            <p className="text-[11px] text-slate-400">
              If feeling overwhelmed, call Tele-MANAS helpline: <span className="text-white font-bold">14416</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© 2026 CareerX Platform. All Rights Reserved.</span>
        <span className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using Gemini AI & Supabase
        </span>
      </div>
    </footer>
  );
}
