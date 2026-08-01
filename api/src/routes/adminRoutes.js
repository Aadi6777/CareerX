const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    let totalStudents = 1420;
    let completedAssessments = 1180;
    let activeRoadmaps = 940;
    let flaggedEscalations = 3;

    if (!isMock && supabase) {
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: assessmentCount } = await supabase.from('assessment_results').select('*', { count: 'exact', head: true });
      const { count: roadmapCount } = await supabase.from('roadmaps').select('*', { count: 'exact', head: true });
      totalStudents = userCount || 1420;
      completedAssessments = assessmentCount || 1180;
      activeRoadmaps = roadmapCount || 940;
    }

    res.json({
      metrics: {
        totalStudents,
        completedAssessments,
        assessmentCompletionRate: '83.1%',
        activeRoadmaps,
        flaggedEscalations
      },
      topCareerDistributions: [
        { career: 'AI & Machine Learning Engineer', percentage: 38 },
        { career: 'Full-Stack Software Developer', percentage: 24 },
        { career: 'Corporate & IPR Lawyer', percentage: 16 },
        { career: 'Data Scientist & Analyst', percentage: 12 },
        { career: 'Product Manager', percentage: 10 }
      ],
      monthlyActiveUsers: [
        { month: 'Jan', users: 320 },
        { month: 'Feb', users: 480 },
        { month: 'Mar', users: 690 },
        { month: 'Apr', users: 910 },
        { month: 'May', users: 1150 },
        { month: 'Jun', users: 1420 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/colleges', authenticateToken, async (req, res) => {
  try {
    const collegeData = req.body;
    if (!isMock && supabase) {
      const { data, error } = await supabase.from('colleges').insert([collegeData]).select().single();
      if (error) throw error;
      return res.status(201).json({ message: 'College added successfully', college: data });
    }
    const newCollege = { id: `clg_${Date.now()}`, ...collegeData };
    mockDB.colleges.unshift(newCollege);
    res.status(201).json({ message: 'College added to mock database', college: newCollege });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/exams', authenticateToken, async (req, res) => {
  try {
    const examData = req.body;
    if (!isMock && supabase) {
      const { data, error } = await supabase.from('exam_recommendations').insert([examData]).select().single();
      if (error) throw error;
      return res.status(201).json({ message: 'Exam added successfully', exam: data });
    }
    const newExam = { id: `ex_${Date.now()}`, ...examData };
    mockDB.exam_recommendations.unshift(newExam);
    res.status(201).json({ message: 'Exam added to mock database', exam: newExam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
