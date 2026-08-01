const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { generateMentorResponse } = require('../services/geminiService');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/mentor/chat
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Retrieve previous session
    let session = null;
    if (!isMock && supabase) {
      const { data } = await supabase.from('mentor_sessions').select('*').eq('user_id', userId).single();
      session = data;
    } else {
      session = mockDB.mentor_sessions.find(s => s.user_id === userId);
    }

    let messages = session ? session.messages : [];
    if (typeof messages === 'string') {
      try { messages = JSON.parse(messages); } catch (e) {}
    }

    const userMessageObj = { sender: 'user', content: message, timestamp: new Date().toISOString() };
    messages.push(userMessageObj);

    // Call Gemini AI Mentor Engine
    const mentorReply = await generateMentorResponse(message, messages, {
      name: req.user.name,
      grade: req.user.grade,
      budgetRange: req.user.budget_range
    });

    const botMessageObj = {
      sender: 'mentor',
      content: mentorReply.content,
      requiresHumanEscalation: mentorReply.requiresHumanEscalation,
      timestamp: new Date().toISOString()
    };
    messages.push(botMessageObj);

    // Save session
    if (!isMock && supabase) {
      if (session) {
        await supabase
          .from('mentor_sessions')
          .update({
            messages: JSON.stringify(messages),
            escalation_flagged: mentorReply.requiresHumanEscalation,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.id);
      } else {
        await supabase.from('mentor_sessions').insert([{
          user_id: userId,
          messages: JSON.stringify(messages),
          escalation_flagged: mentorReply.requiresHumanEscalation
        }]);
      }
    } else {
      if (session) {
        session.messages = messages;
        session.escalation_flagged = mentorReply.requiresHumanEscalation;
      } else {
        mockDB.mentor_sessions.push({
          id: `ms_${Date.now()}`,
          user_id: userId,
          messages,
          escalation_flagged: mentorReply.requiresHumanEscalation
        });
      }
    }

    res.json({
      reply: botMessageObj.content,
      requiresHumanEscalation: botMessageObj.requiresHumanEscalation,
      messages
    });
  } catch (err) {
    console.error('Mentor chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/mentor/history/:userId
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    let session = null;

    if (!isMock && supabase) {
      const { data } = await supabase.from('mentor_sessions').select('*').eq('user_id', userId).single();
      session = data;
    } else {
      session = mockDB.mentor_sessions.find(s => s.user_id === userId);
    }

    let messages = session ? session.messages : [];
    if (typeof messages === 'string') {
      try { messages = JSON.parse(messages); } catch (e) {}
    }

    if (messages.length === 0) {
      messages = [
        {
          sender: 'mentor',
          content: `Hello ${req.user.name || 'there'}! I am your 24/7 CareerX AI Mentor. How can I assist with your career path, entrance exams, or college choices today?`,
          timestamp: new Date().toISOString()
        }
      ];
    }

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
