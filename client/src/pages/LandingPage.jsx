import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Brain, BarChart2, MapPin, BookOpen, 
  MessageSquare, Briefcase, ArrowRight, CheckCircle2, Sparkles, Shield, Play, Pause, Layers 
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const steps = [
    {
      title: '1. AI Diagnostic & Psychometric Quiz',
      subtitle: 'Identify Natural Strengths & Aptitude',
      description: 'Take an adaptive 20-question test evaluating quantitative aptitude, Holland RIASEC interest profiles, and Big Five traits interpreted by Gemini 2.5 AI.',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Step 1: Psychometrics',
      simulatedUI: (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question 14 of 20 • Quantitative & Analytical Aptitude</span>
            <span className="text-blue-400 font-bold">70% Complete</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[70%] transition-all duration-500"></div>
          </div>
          <p className="text-xs text-white font-medium">"Which work environment aligns best with your problem-solving style?"</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-[11px] font-semibold flex items-center justify-between">
              <span>Building AI models & algorithms</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 text-[11px]">Structuring strategic legal contracts</div>
          </div>
        </div>
      )
    },
    {
      title: '2. Skill-Gap Radar Analytics',
      subtitle: 'Compare Proficiency vs Industry Target',
      description: 'Chart.js Radar & Bar visualizations highlight your exact competency scores against top career benchmarks in AI, Software, Law, or Business.',
      color: 'from-indigo-600 to-purple-600',
      badge: 'Step 2: Skill Analytics',
      simulatedUI: (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">Benchmark Path: AI & Machine Learning Engineer</span>
            <span className="text-emerald-400 font-bold">Match Rating: 94%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block">Python / PyTorch</span>
              <span className="text-blue-400 font-black text-xs">88 / 100</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block">Linear Algebra</span>
              <span className="text-indigo-400 font-black text-xs">92 / 100</span>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block">System Architecture</span>
              <span className="text-purple-400 font-black text-xs">74 / 100</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '3. Dynamic Month-by-Month Roadmap',
      subtitle: 'Time-Bound Actionable Milestones',
      description: 'Follow an interactive month-by-month timeline with curated courses, practice resources, and milestone completion checkmarks.',
      color: 'from-purple-600 to-emerald-600',
      badge: 'Step 3: Execution Roadmap',
      simulatedUI: (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-400 font-bold">Month 1: Deep Learning Fundamentals</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">In Progress</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete Stanford CS229 Neural Networks Module
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px]">2</span> Build image classifier with PyTorch & HuggingFace
            </li>
          </ul>
        </div>
      )
    },
    {
      title: '4. College Geo-Discovery & 24/7 AI Mentor',
      subtitle: 'Locate Nearby Institutes & Chat Continuously',
      description: 'Explore nearby colleges across Bangalore and Tamil Nadu filtered by tuition budget, hostel status, and NAAC ratings with 24/7 Gemini chat guidance.',
      color: 'from-emerald-600 to-blue-600',
      badge: 'Step 4: Colleges & AI Mentor',
      simulatedUI: (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold">📍 25+ Top Colleges Loaded (TN & Blr)</span>
            <span className="text-blue-400 font-bold">🤖 Gemini AI Online</span>
          </div>
          <div className="p-2 rounded bg-slate-800/60 text-[11px] text-slate-300 flex items-center justify-between">
            <span><strong>RVCE Bengaluru</strong> (Tuition: ₹2.2L - ₹3.8L/yr)</span>
            <span className="text-xs text-blue-400 font-bold">NAAC A+</span>
          </div>
        </div>
      )
    }
  ];

  // Autoplay step timer effect
  React.useEffect(() => {
    if (!isPlayingDemo) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlayingDemo, steps.length]);

  const features = [
    { icon: Brain, title: 'AI Psychometric Engine', desc: 'Adaptive evaluation across RIASEC models, Big Five traits, and quantitative aptitude interpreted by Gemini 2.5.' },
    { icon: BarChart2, title: 'Skill-Gap Radar Analytics', desc: 'Interactive Chart.js visual breakdown matching current proficiency against top benchmark career paths.' },
    { icon: Compass, title: 'Dynamic Time-Bound Roadmap', desc: 'Step-by-step month-by-month learning milestones with curated resources and checkpoint tracking.' },
    { icon: MapPin, title: 'College Geo-Discovery (Pan-India)', desc: 'Interactive Leaflet map matching top government & private colleges by tuition budget, distance, and NAAC grade.' },
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
            Diagnose your strengths with AI psychometric analysis, close skill gaps, follow a personalized learning roadmap, and match colleges across India.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/assessment" className="btn-primary text-sm px-7 py-3.5 w-full sm:w-auto">
              Start Free AI Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="btn-secondary text-sm px-7 py-3.5 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-blue-400 fill-blue-400" /> Watch Platform Flow Video
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-blue-400">98.4%</span>
              <span className="block text-xs text-slate-400 mt-1">Clarity Score Increase</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl font-black text-purple-400">25+</span>
              <span className="block text-xs text-slate-400 mt-1">Top Indian Colleges</span>
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
              <span className="glass-pill text-blue-400 mb-1">Interactive Video Walkthrough</span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-400" /> Platform Flow & Student Journey
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlayingDemo(false);
                  }}
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
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl min-h-[360px] flex flex-col justify-between p-6 sm:p-8">
            
            {/* Top Bar Simulation */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-500 ml-2">careerx.app/flow/step-{activeStep + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {steps[activeStep].badge}
                </span>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" /> Full Video Tour
                </button>
              </div>
            </div>

            {/* Step Screen Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-center">
              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  {steps[activeStep].subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {steps[activeStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Dynamic UI Simulation Widget */}
              <div>
                {steps[activeStep].simulatedUI}
              </div>
            </div>

            {/* Bottom Video Progress Scrub & Controls */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 cursor-pointer"
                  >
                    {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-xs text-slate-400 font-medium">
                    {isPlayingDemo ? 'Autoplay Active (Cycling Steps)' : 'Step Preview Paused'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPlayingDemo(false);
                      setActiveStep(prev => (prev > 0 ? prev - 1 : steps.length - 1));
                    }}
                    className="btn-secondary text-xs py-1.5"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => {
                      setIsPlayingDemo(false);
                      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
                    }}
                    className="btn-primary text-xs py-1.5"
                  >
                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Full Screen Video Tour Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-card max-w-3xl w-full p-6 relative border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-400 fill-blue-400" />
                <h3 className="text-lg font-bold text-white">CareerX Full Platform Journey (Interactive Video Tour)</h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                Close ✕
              </button>
            </div>

            {/* Video Player Box */}
            <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-indigo-950/20 to-purple-950/40 pointer-events-none"></div>
              
              <div className="flex items-center justify-between text-xs z-10">
                <span className="glass-pill text-blue-400">4-Step Animated Product Walkthrough</span>
                <span className="text-emerald-400 font-mono font-bold">1080p HD Flow</span>
              </div>

              <div className="text-center space-y-3 z-10 max-w-md mx-auto my-auto">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/40 animate-pulse">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
                <h4 className="text-xl font-black text-white">CareerX AI Student & Parent Journey</h4>
                <p className="text-xs text-slate-300">
                  Demonstrating 20-Question Adaptive Quiz, Skill-Gap Chart.js Radar, Time-Bound Roadmap Checkpoints, and Leaflet College Geo-Search with Gemini AI Mentorship.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 z-10">
                <span>Step {activeStep + 1} of 4: {steps[activeStep].title}</span>
                <Link 
                  to="/assessment" 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  Try AI Assessment Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
