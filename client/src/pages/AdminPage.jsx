import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, BookOpen, Building, Plus, CheckCircle } from 'lucide-react';
import API from '../services/api';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // New College Form
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    city: '',
    state: '',
    latitude: 19.076,
    longitude: 72.877,
    tuition_min: 100000,
    tuition_max: 300000,
    type: 'Private',
    accreditation: 'NAAC A+',
    ranking: 15,
    hostel_available: true,
    programs_offered: 'Computer Science, Information Technology'
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await API.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const handleAddCollege = async (e) => {
    e.preventDefault();
    try {
      const programs = collegeForm.programs_offered.split(',').map(p => p.trim());
      await API.post('/admin/colleges', {
        ...collegeForm,
        latitude: Number(collegeForm.latitude),
        longitude: Number(collegeForm.longitude),
        tuition_min: Number(collegeForm.tuition_min),
        tuition_max: Number(collegeForm.tuition_max),
        ranking: Number(collegeForm.ranking),
        programs_offered: programs
      });
      setMessage('College added successfully to database!');
      setCollegeForm({ ...collegeForm, name: '' });
    } catch (err) {
      setMessage('Failed to add college');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>System Administration & Platform Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Admin Control Center</h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading system metrics...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Total Registered Students</span>
              <span className="text-2xl font-black text-white">{analytics?.metrics?.totalStudents}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Assessments Completed</span>
              <span className="text-2xl font-black text-blue-400">{analytics?.metrics?.completedAssessments}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Active Roadmaps</span>
              <span className="text-2xl font-black text-purple-400">{analytics?.metrics?.activeRoadmaps}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Safety Helpline Escalations</span>
              <span className="text-2xl font-black text-rose-400">{analytics?.metrics?.flaggedEscalations}</span>
            </div>
          </div>

          {/* Add College Content Manager Form */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" /> Content Manager: Add New College
            </h3>

            {message && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                {message}
              </div>
            )}

            <form onSubmit={handleAddCollege} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">College Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. John College"
                  value={collegeForm.name}
                  onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune"
                  value={collegeForm.city}
                  onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra"
                  value={collegeForm.state}
                  onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tuition Min (₹)</label>
                <input
                  type="number"
                  value={collegeForm.tuition_min}
                  onChange={(e) => setCollegeForm({ ...collegeForm, tuition_min: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tuition Max (₹)</label>
                <input
                  type="number"
                  value={collegeForm.tuition_max}
                  onChange={(e) => setCollegeForm({ ...collegeForm, tuition_max: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Type</label>
                <select
                  value={collegeForm.type}
                  onChange={(e) => setCollegeForm({ ...collegeForm, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button type="submit" className="btn-primary text-xs py-2.5">
                  Publish College Record
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
