import React, { useEffect, useState } from 'react';
import { Briefcase, TrendingUp, DollarSign, Calculator, ArrowUpRight, CheckCircle } from 'lucide-react';
import API from '../services/api';

export default function JobMarketPage() {
  const [jobMarket, setJobMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  // Budget Calculator Inputs
  const [annualTuition, setAnnualTuition] = useState(250000);
  const [livingCost, setLivingCost] = useState(100000);
  const [durationYears, setDurationYears] = useState(4);
  const [familySavings, setFamilySavings] = useState(300000);
  const [monthlyContribution, setMonthlyContribution] = useState(15000);
  const [startingSalary, setStartingSalary] = useState(1000000);

  const [budgetResult, setBudgetResult] = useState(null);

  useEffect(() => {
    async function fetchJobMarket() {
      try {
        const res = await API.get('/jobmarket/all');
        setJobMarket(res.data.jobMarket || []);
      } catch (err) {
        console.error('Failed to fetch job market data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobMarket();
  }, []);

  const handleCalculateBudget = async () => {
    try {
      const res = await API.post('/budget/estimate', {
        annualTuition: Number(annualTuition),
        hostelLivingPerYear: Number(livingCost),
        durationYears: Number(durationYears),
        familySavings: Number(familySavings),
        monthlyContribution: Number(monthlyContribution),
        projectedStartingSalary: Number(startingSalary)
      });
      setBudgetResult(res.data.summary);
    } catch (err) {
      console.error('Budget calculation error:', err);
    }
  };

  useEffect(() => {
    handleCalculateBudget();
  }, [annualTuition, livingCost, durationYears, familySavings, monthlyContribution, startingSalary]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Job Market Analytics & Education Financial Planning</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Job Market Trends & Budget Planner</h1>
        <p className="text-xs text-slate-400">
          Analyze real-time salary expectations, industry growth trends, and plan your college degree budget vs family savings.
        </p>
      </div>

      {/* 1. Job Market Trends Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" /> Industry Demand & Salary Scale
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading job market metrics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobMarket.map((jm) => (
              <div key={jm.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                      jm.demand_trend === 'Explosive'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {jm.demand_trend} Demand
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      +{jm.growth_percentage}% YoY
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{jm.career_path}</h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Salary Scale:</span>
                    <strong className="text-white">
                      ₹{(jm.salary_min / 100000).toFixed(1)}L - ₹{(jm.salary_max / 100000).toFixed(1)}L / yr
                    </strong>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">Top In-Demand Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(jm.top_skills) && jm.top_skills.slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="glass-pill text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Interactive Budget Calculator */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" /> College Education Budget & Loan Planner
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 4-year degree costs, family capital savings, loan requirements, and estimated payback period.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sliders Form */}
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Annual Tuition Fee:</span>
                <span className="text-blue-400">₹{annualTuition.toLocaleString()} / yr</span>
              </div>
              <input
                type="range"
                min="20000"
                max="600000"
                step="10000"
                value={annualTuition}
                onChange={(e) => setAnnualTuition(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Annual Hostel & Living Expense:</span>
                <span className="text-purple-400">₹{livingCost.toLocaleString()} / yr</span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="10000"
                value={livingCost}
                onChange={(e) => setLivingCost(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Duration (Years)</label>
                <select
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2"
                >
                  <option value={3}>3 Years (BSc/BBA)</option>
                  <option value={4}>4 Years (BTech/MBBS)</option>
                  <option value={5}>5 Years (Integrated)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Starting Salary Expectation</label>
                <select
                  value={startingSalary}
                  onChange={(e) => setStartingSalary(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2"
                >
                  <option value={600000}>₹6 Lakhs / yr</option>
                  <option value={1000000}>₹10 Lakhs / yr</option>
                  <option value={1800000}>₹18 Lakhs / yr</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          {budgetResult && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Estimated Financial Summary</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Gross Degree Cost:</span>
                    <strong className="text-lg font-black text-white">₹{(budgetResult.grossTotalCost / 100000).toFixed(2)} Lakhs</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Funding Shortfall:</span>
                    <strong className="text-lg font-black text-rose-400">₹{(budgetResult.netFundingShortfall / 100000).toFixed(2)} Lakhs</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-200">
                  <span>Estimated Loan EMI (7 Yrs @ 9.5%):</span>
                  <strong className="text-blue-300">₹{budgetResult.monthlyLoanEMI.toLocaleString()} / mo</strong>
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span>Estimated Education Payback Period:</span>
                  <strong className="text-emerald-400">{budgetResult.paybackPeriodYears} Years</strong>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
