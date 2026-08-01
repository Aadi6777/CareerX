import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Brain, BarChart2, MapPin, BookOpen, 
  MessageSquare, Briefcase, ArrowRight, CheckCircle2, Sparkles, Shield 
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI Psychometric Assessment',
      desc: 'Adaptive evaluation across RIASEC interest models, Big Five personality traits, and quantitative aptitude interpreted by Gemini AI.'
    },
    {
      icon: BarChart2,
      title: 'Skill-Gap Radar Analytics',
      desc: 'Interactive Chart.js visual breakdown matching your current proficiency against top 3 benchmark career paths.'
    },
    {
      icon: Compass,
      title: 'Dynamic Time-Bound Roadmap',
      desc: 'Step-by-step month-by-month learning milestones with curated resources and checkpoint tracking.'
    },
    {
      icon: MapPin,
      title: 'College Geo-Discovery',
      desc: 'Interactive map matching nearby government & private colleges by tuition budget, distance radius, and accreditation.'
    },
    {
      icon: BookOpen,
      title: 'Entrance Exam Recommender',
      desc: 'Comprehensive mapping to JEE, NEET, CLAT, CUET, SAT & IPMAT with preparation lead times and eligibility rules.'
    },
    {
      icon: MessageSquare,
      title: '24/7 Contextual AI Mentor',
      desc: 'Persistent conversational guidance powered by Gemini API with built-in safety crisis escalation guardrails.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Next-Gen AI Career Counseling System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Turn Academic Uncertainty Into{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Data-Backed Success
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Diagnose your strengths with AI psychometric analysis, close skill gaps, follow a personalized learning roadmap, and match colleges nearby.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/assessment" className="btn-primary text-sm px-7 py-3.5 w-full sm:w-auto">
              Start Free AI Assessment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="btn-secondary text-sm px-7 py-3.5 w-full sm:w-auto">
              Explore Demo Dashboard
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-blue-400">98.4%</span>
              <span className="block text-xs text-slate-400 mt-1">Clarity Score Increase</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-purple-400">6+</span>
              <span className="block text-xs text-slate-400 mt-1">Core Modules Integrated</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-emerald-400">24/7</span>
              <span className="block text-xs text-slate-400 mt-1">AI Mentor Guidance</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-amber-400">100%</span>
              <span className="block text-xs text-slate-400 mt-1">Unbiased & Data-Backed</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Complete Counseling Ecosystem</h2>
          <p className="text-sm text-slate-400 mt-2">Everything a student and parent needs from grade 9 to college admission</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
