import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, ShieldAlert, HeartHandshake } from 'lucide-react';
import API from '../services/api';

export default function MentorPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await API.get('/mentor/history/me');
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to load mentor history:', err);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim() || loading) return;

    const userMsg = { sender: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await API.post('/mentor/chat', { message: msg });
      const { reply, requiresHumanEscalation } = res.data;

      if (requiresHumanEscalation) {
        setCrisisAlert(true);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          content: reply,
          requiresHumanEscalation,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          content: 'I hit a network connection timeout. Please resend your message!',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I stay focused during JEE / NEET entrance preparation?',
    'What is the difference between AI Engineering and Data Science?',
    'Should I choose a government college far away or private college nearby?',
    'How can I build a student portfolio for software development?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Bot className="w-4 h-4 text-blue-400" />
          <span>24/7 Contextual Gemini AI Mentor</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Continuous AI Mentorship</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your persistent AI companion with real-time awareness of your psychometric assessment, roadmap, and career goals.
        </p>
      </div>

      {/* Safety Banner */}
      {crisisAlert && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs space-y-2 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-white text-sm">Human Support Escalation Flagged</strong>
            <p>
              We care deeply about your mental health and well-being. If you are experiencing distress, please connect with a qualified counselor immediately:
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-white">
              <span>• Tele-MANAS National Helpline: 14416</span>
              <span>• Vandrevala Helpline: 9999 666 555</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Console */}
      <div className="glass-card h-[540px] flex flex-col overflow-hidden border-slate-800 shadow-2xl">
        
        {/* Messages Scroll View */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'mentor' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                    : m.requiresHumanEscalation
                    ? 'bg-rose-950/80 border border-rose-500/40 text-rose-100 rounded-bl-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              CareerX AI Mentor is generating guidance...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Toolbar */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex gap-2 overflow-x-auto no-scrollbar">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            placeholder="Type your career or academic question here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="btn-primary px-5 py-3 text-xs"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
