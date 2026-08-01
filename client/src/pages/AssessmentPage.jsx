import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../services/api';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [questionsData, setQuestionsData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await API.get('/assessment/questions');
        setQuestionsData(res.data.parts);
      } catch (err) {
        console.error('Failed to load questions:', err);
      }
    }
    loadQuestions();
  }, []);

  const handleSelectAnswer = (qId, optionVal) => {
    setAnswers(prev => ({ ...prev, [qId]: optionVal }));
  };

  const handleNextStep = () => {
    if (currentStep < (questionsData?.length || 1) - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    try {
      const res = await API.post('/assessment/submit', { answers });
      const { interpretation, recommendedCareers } = res.data.result;
      setReport({ interpretation, recommendedCareers });
    } catch (err) {
      console.error('Assessment submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!questionsData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-blue-400" />
        Initializing AI Psychometric Assessment Engine...
      </div>
    );
  }

  const activePart = questionsData[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / questionsData.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Gemini 2.5 AI Psychometric Diagnostic</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Career Strengths Diagnostic</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Evaluates quantitative aptitude, Holland RIASEC interests, and Big Five personality traits to recommend your best career path.
        </p>
      </div>

      {!report ? (
        <div className="glass-card p-6 sm:p-8 space-y-6">
          
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Part {currentStep + 1} of {questionsData.length}: {activePart.title}</span>
              <span className="text-blue-400">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {activePart.title}
            </h3>
            <p className="text-xs text-slate-400">{activePart.description}</p>

            {activePart.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <span className="text-xs font-bold text-blue-400">Q{idx + 1}. {q.text}</span>
                
                {q.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`p-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-[11px] text-slate-400">Dislike</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={answers[q.id] || 3}
                      onChange={(e) => handleSelectAnswer(q.id, Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400">Strongly Like</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="btn-secondary text-xs disabled:opacity-40 cursor-pointer"
            >
              Previous Part
            </button>

            {currentStep < questionsData.length - 1 ? (
              <button onClick={handleNextStep} className="btn-primary text-xs cursor-pointer">
                Next Part <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                disabled={submitting}
                className="btn-primary text-xs bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer"
              >
                {submitting ? 'Synthesizing with Gemini AI...' : 'Generate AI Career Report'}
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Gemini Psychometric Report Display */
        <div className="glass-card p-6 sm:p-8 space-y-8 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="glass-pill text-emerald-400 mb-1">Assessment Complete</span>
              <h2 className="text-2xl font-extrabold text-white">Your AI Career Profile Report</h2>
            </div>
            <button
              onClick={() => setReport(null)}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
          </div>

          {/* AI Plain Language Summary */}
          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" /> Gemini AI Interpretation Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.interpretation?.summary}
            </p>
          </div>

          {/* Top Strengths */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Identified Core Strengths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.interpretation?.topStrengths?.map((str, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Recommended Career Paths */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white">Top 3 Recommended Career Matches</h3>
            <div className="space-y-3">
              {report.recommendedCareers?.map((car, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{car.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {car.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{car.rationale}</p>
                  </div>

                  <button
                    onClick={() => navigate('/skill-gap')}
                    className="btn-secondary text-xs shrink-0 cursor-pointer"
                  >
                    Analyze Skill Gap
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
