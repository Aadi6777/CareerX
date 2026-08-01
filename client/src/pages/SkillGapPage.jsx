import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import API from '../services/api';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function SkillGapPage() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState('AI & Machine Learning Engineer');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkillGap() {
      setLoading(true);
      try {
        const res = await API.get(`/skillgap/me?targetCareer=${encodeURIComponent(selectedCareer)}`);
        setGapData(res.data);
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkillGap();
  }, [selectedCareer]);

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#94a3b8', font: { size: 11 } },
        ticks: { color: '#64748b', backdropColor: 'transparent' },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        labels: { color: '#f8fafc', font: { size: 12 } }
      }
    }
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#64748b' } }
    },
    plugins: {
      legend: { labels: { color: '#f8fafc' } }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>Interactive Chart.js Competency Visualizer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Skill-Gap Radar Analytics</h1>
          <p className="text-xs text-slate-400">
            Compare your current skill levels against industry benchmarks for target career paths.
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 block">Select Target Career Path</label>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
          >
            <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
            <option value="Full-Stack Software Developer">Full-Stack Software Developer</option>
            <option value="Corporate & IPR Lawyer">Corporate & IPR Lawyer</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading skill gap benchmarks...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Overview Score Card */}
          <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Competency Gap</span>
              <h2 className="text-2xl font-black text-white">{selectedCareer}</h2>
              <p className="text-xs text-slate-400">
                You have satisfied approximately <strong className="text-blue-400">{(100 - (gapData?.overallGapScore || 30)).toFixed(1)}%</strong> of target requirements.
              </p>
            </div>

            <div className="px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
              <span className="text-3xl font-black text-amber-400">{gapData?.overallGapScore}%</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Remaining Gap</span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Radar Chart */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Competency Profile Radar</h3>
              <div className="h-[320px] flex items-center justify-center">
                {gapData?.chartData && <Radar data={gapData.chartData} options={radarOptions} />}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Bar Benchmark Comparison</h3>
              <div className="h-[320px] flex items-center justify-center">
                {gapData?.chartData && <Bar data={gapData.chartData} options={barOptions} />}
              </div>
            </div>

          </div>

          {/* Prioritized Action Plan */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Prioritized Skills to Develop</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gapData?.prioritizedActions?.map((act, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{act.skill}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      act.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {act.priority} Priority ({act.gapPercentage}% Gap)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{act.action}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
