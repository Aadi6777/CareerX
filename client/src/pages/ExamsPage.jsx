import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, ExternalLink, CheckCircle, Search, Filter } from 'lucide-react';
import API from '../services/api';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await API.get('/exams/all');
        setExams(res.data.exams || []);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

  const categories = ['All', 'Engineering', 'Medical', 'Law', 'General Arts & Science', 'Management', 'Global / International'];

  const filteredExams = exams.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = ex.exam_name.toLowerCase().includes(searchQuery.toLowerCase()) || ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Entrance Exam Intelligence Database</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recommended Entrance Exams</h1>
          <p className="text-xs text-slate-400">
            Find target entrance exams mapped to your stream, eligibility criteria, and preparation lead time.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search exam name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading entrance exam database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((ex) => (
            <div key={ex.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/40">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {ex.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {ex.relevance_score}% Relevance
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{ex.exam_name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ex.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Exam Date:
                  </span>
                  <strong className="text-white">{ex.exam_date}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> Prep Lead Time:
                  </span>
                  <strong className="text-blue-300">{ex.preparation_months} Months</strong>
                </div>

                <div className="pt-1 text-[11px] text-slate-400">
                  <strong>Eligibility:</strong> {ex.eligibility}
                </div>
              </div>

              {ex.official_url && (
                <a
                  href={ex.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs w-full justify-center text-purple-300 hover:text-purple-200 mt-2"
                >
                  Visit Official Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
