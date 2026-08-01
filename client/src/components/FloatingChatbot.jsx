import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShieldAlert } from 'lucide-react';
import API from '../services/api';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'mentor',
      content: 'Hi! I am your 24/7 CareerX AI Mentor. Ask me anything about career choices, entrance exams, or recommended colleges!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
          content: 'Sorry, I hit a temporary network hiccup. Please try asking again!',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Which entrance exam should I prepare for?',
    'What skills are needed for AI Engineering?',
    'Top colleges for computer science near me?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary rounded-full p-4 shadow-2xl shadow-blue-600/40 hover:scale-110 transition-transform cursor-pointer flex items-center gap-2"
        >
          <Bot className="w-6 h-6 text-white animate-bounce" />
          <span className="text-xs font-bold hidden sm:inline">24/7 AI Mentor</span>
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
        </button>
      )}

      {isOpen && (
        <div className="glass-card w-[360px] sm:w-[400px] h-[520px] flex flex-col shadow-2xl border-slate-700/90 relative overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  CareerX AI Mentor
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Online
                  </span>
                </h4>
                <span className="text-[10px] text-slate-400">Contextual Gemini 2.5 Engine</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Crisis Banner */}
          {crisisAlert && (
            <div className="bg-rose-500/20 border-b border-rose-500/30 p-2.5 text-xs text-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Human counselor escalation flagged. Tele-MANAS: 14416</span>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'mentor' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/40 text-blue-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : m.requiresHumanEscalation
                      ? 'bg-rose-950/80 border border-rose-500/40 text-rose-100 rounded-bl-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-400" />
                CareerX AI is synthesizing response...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-950/50 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="btn-primary px-3 py-2 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
