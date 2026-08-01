import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, CheckCircle2, Clock, Circle, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import API from '../services/api';

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await API.get('/roadmap/me');
        setRoadmap(res.data);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  const handleToggleMilestone = async (milestoneId, currentStatus) => {
    setUpdatingId(milestoneId);
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const res = await API.patch(`/roadmap/me/milestone/${milestoneId}`, { status: nextStatus });
      setRoadmap(prev => ({
        ...prev,
        milestones: res.data.milestones,
        progressPercentage: res.data.progressPercentage
      }));
    } catch (err) {
      console.error('Failed to update milestone status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Step-by-Step Personalized Learning Roadmap</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Roadmap: {roadmap?.targetCareer || 'AI & Machine Learning Engineer'}
          </h1>
          <p className="text-xs text-slate-400">
            Time-bound, month-by-month checkpoints tailored to your current grade and career goals.
          </p>
        </div>

        {/* Progress Display */}
        <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-center shrink-0">
          <span className="text-2xl font-black text-blue-400">{roadmap?.progressPercentage || 0}%</span>
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Progress</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${roadmap?.progressPercentage || 0}%` }}
        ></div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading your learning roadmap...</div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {roadmap?.milestones?.map((m, idx) => {
            const isCompleted = m.status === 'completed';
            const isInProgress = m.status === 'in-progress';

            return (
              <div key={m.id || idx} className="relative pl-12">
                
                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleMilestone(m.id, m.status)}
                  disabled={updatingId === m.id}
                  className={`absolute left-0 top-1 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer z-10 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : isInProgress
                      ? 'bg-blue-600/30 border-blue-400 text-blue-300 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="text-xs font-bold">{m.stepNumber || idx + 1}</span>
                  )}
                </button>

                {/* Milestone Details */}
                <div className={`glass-card p-6 space-y-3 transition-all ${
                  isCompleted ? 'opacity-80 border-slate-800' : 'border-slate-700/80'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{m.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isInProgress
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.timeframe || `Step ${idx + 1}`}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Status: <strong className="capitalize text-slate-200">{m.status}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>

                  {/* Resource Links */}
                  {m.resources && m.resources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 block">Recommended Resources:</span>
                      <div className="flex flex-wrap gap-2">
                        {m.resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-blue-400 hover:text-blue-300 hover:border-slate-700 transition-colors"
                          >
                            <span>{res.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
