import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Brain, BarChart2, MapPin, BookOpen, 
  MessageSquare, Briefcase, ArrowRight, CheckCircle2, Sparkles, Shield, Play, Pause, Layers 
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);

  const steps = [
    {
      title: '1. AI Diagnostic & Psychometric Quiz',
      subtitle: 'Identify Natural Strengths & Aptitude',
      description: 'Take an adaptive 20-question test evaluating quantitative aptitude, Holland RIASEC interest profiles, and Big Five traits interpreted by Gemini 2.5 AI.',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Step 1'
    },
    {
      title: '2. Skill-Gap Radar Analytics',
      subtitle: 'Compare Proficiency vs Industry Target',
      description: 'Chart.js Radar & Bar visualizations highlight your exact competency scores against top career benchmarks in AI, Software, Law, or Business.',
      color: 'from-indigo-600 to-purple-600',
      badge: 'Step 2'
    },
    {
      title: '3. Dynamic Month-by-Month Roadmap',
      subtitle: 'Time-Bound Actionable Milestones',
      description: 'Follow an interactive month-by-month timeline with curated courses, practice resources, and milestone completion checkmarks.',
      color: 'from-purple-600 to-emerald-600',
      badge: 'Step 3'
    },
    {
      title: '4. College Geo-Discovery & 24/7 AI Mentor',
      subtitle: 'Locate Nearby Institutes & Chat Continuously',
      description: 'Explore nearby colleges across Bangalore and Tamil Nadu filtered by tuition budget, hostel status, and NAAC ratings with 24/7 Gemini chat guidance.',
      color: 'from-emerald-600 to-blue-600',
      badge: 'Step 4'
    }
  ];

  const features = [
    { icon: Brain, title: 'AI Psychometric Engine', desc: 'Adaptive evaluation across RIASEC models, Big Five traits, and quantitative aptitude interpreted by Gemini 2.5.' },
    { icon: BarChart2, title: 'Skill-Gap Radar Analytics', desc: 'Interactive Chart.js visual breakdown matching current proficiency against top benchmark career paths.' },
    { icon: Compass, title: 'Dynamic Time-Bound Roadmap', desc: 'Step-by-step month-by-month learning milestones with curated resources and checkpoint tracking.' },
    { icon: MapPin, title: 'College Geo-Discovery (TN & Blr)', desc: 'Interactive Leaflet map matching nearby government & private colleges by tuition budget, distance, and NAAC grade.' },
    { icon: BookOpen, title: 'Entrance Exam Recommender', desc: 'Comprehensive mapping to KCET, COMEDK, TNEA, JEE, NEET, CLAT, CUET, SAT & IPMAT.' },
    { icon: MessageSquare, title: '24/7 Contextual AI Mentor', desc: 'Persistent conversational guidance powered by Gemini API with built-in safety crisis escalation guardrails.' }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI-Driven Career & Academic Counseling Companion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Turn Academic Uncertainty Into{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Data-Backed Success
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Diagnose your strengths with AI psychometric analysis, close skill gaps, follow a personalized learning roadmap, and match colleges across Bangalore & Tamil Nadu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/assessment" className="btn-primary text-sm px-7 py-3.5 w-full sm:w-auto">
              Start Free AI Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="btn-secondary text-sm px-7 py-3.5 w-full sm:w-auto">
              Explore Demo Dashboard
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-blue-400">98.4%</span>
              <span className="block text-xs text-slate-400 mt-1">Clarity Score Increase</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-purple-400">20+</span>
              <span className="block text-xs text-slate-400 mt-1">TN & Blr Top Colleges</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-emerald-400">24/7</span>
              <span className="block text-xs text-slate-400 mt-1">Gemini AI Mentorship</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-amber-400">100%</span>
              <span className="block text-xs text-slate-400 mt-1">Unbiased Guidance</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Platform Demo Flow Video Player & Carousel */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="glass-card p-6 sm:p-8 space-y-6 border-blue-500/30 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="glass-pill text-blue-400 mb-1">Interactive Product Walkthrough</span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-400" /> Platform Flow & Student Journey
              </h2>
            </div>
            <div className="flex gap-2">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Simulation Frame */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl min-h-[320px] flex flex-col justify-between p-6 sm:p-8">
            
            {/* Top Bar Simulation */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-500 ml-2">careerx.app/flow/step-{activeStep + 1}</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                {steps[activeStep].badge}
              </span>
            </div>

            {/* Step Screen Display */}
            <div className="space-y-4 my-auto">
              <div className="inline-block">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  {steps[activeStep].subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {steps[activeStep].title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 cursor-pointer"
                >
                  {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-400">
                  {isPlayingDemo ? 'Autoplay Active (4-Step Flow)' : 'Interactive Preview Paused'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="btn-secondary text-xs"
                >
                  Prev
                </button>
                <button
                  onClick={() => setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="btn-primary text-xs"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
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
