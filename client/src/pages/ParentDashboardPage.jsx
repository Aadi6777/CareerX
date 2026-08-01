import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, ShieldCheck, Compass, DollarSign } from 'lucide-react';
import API from '../services/api';

export default function ParentDashboardPage() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParentOverview() {
      try {
        const [astRes, rmRes] = await Promise.all([
          API.get('/assessment/results/me'),
          API.get('/roadmap/me')
        ]);
        setStudentData({
          name: 'Aarav Sharma',
          grade: 'Grade 11 (Science)',
          assessment: astRes.data,
          roadmap: rmRes.data
        });
      } catch (err) {
        console.error('Failed to load parent overview:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchParentOverview();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-card p-6 sm:p-8 border-purple-500/30 space-y-2">
        <div className="flex items-center gap-2">
          <span className="glass-pill text-purple-400">Parent Portal (Linked Account)</span>
          <span className="text-xs text-slate-400">• View-Only Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Child Progress Overview: {studentData?.name || 'Aarav'}
        </h1>
        <p className="text-xs text-slate-300">
          Monitor your child's career clarity progress, roadmap milestones, and financial budget estimates.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading student progress overview...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Matches */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" /> Recommended Career Pathways
            </h3>
            <div className="space-y-3">
              {studentData?.assessment?.recommendedCareers?.map((car, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{car.title}</span>
                    <span className="text-[10px] text-slate-400">{car.rationale}</span>
                  </div>
                  <span className="font-extrabold text-emerald-400 shrink-0">{car.matchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Completion */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Roadmap Milestone Completion
              </h3>
              <span className="text-xs font-bold text-blue-400">{studentData?.roadmap?.progressPercentage || 16.6}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full"
                style={{ width: `${studentData?.roadmap?.progressPercentage || 16.6}%` }}
              ></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span>Completed Checkpoints:</span>
                <strong className="text-white">1 of 6 Milestones</strong>
              </div>
              <div className="flex justify-between">
                <span>Active Target Exam:</span>
                <strong className="text-purple-300">JEE Main / Advanced 2027</strong>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
