const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/all', async (req, res) => {
  try {
    let exams = [];
    if (!isMock && supabase) {
      const { data } = await supabase.from('exam_recommendations').select('*').order('relevance_score', { ascending: false });
      if (data && data.length > 0) {
        exams = data;
      } else {
        exams = mockDB.exam_recommendations;
      }
    } else {
      exams = mockDB.exam_recommendations;
    }
    res.json({ count: exams.length, exams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    let exams = [];
    if (!isMock && supabase) {
      const { data } = await supabase.from('exam_recommendations').select('*').order('relevance_score', { ascending: false });
      if (data && data.length > 0) {
        exams = data;
      } else {
        exams = mockDB.exam_recommendations;
      }
    } else {
      exams = mockDB.exam_recommendations;
    }

    const categoryFilter = req.query.category;
    if (categoryFilter && categoryFilter !== 'All') {
      exams = exams.filter(e => e.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    res.json({ userId: req.params.userId, recommendations: exams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
