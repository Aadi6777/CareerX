const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { authenticateToken } = require('../middleware/authMiddleware');

const CAREER_BENCHMARKS = {
  'AI & Machine Learning Engineer': [
    { skill: 'Python / Math Foundations', current: 75, required: 95, priority: 'High' },
    { skill: 'Data Structures & Algorithms', current: 70, required: 90, priority: 'High' },
    { skill: 'PyTorch / Machine Learning', current: 35, required: 85, priority: 'Critical' },
    { skill: 'Statistics & Probability', current: 80, required: 90, priority: 'Medium' },
    { skill: 'System Design & MLOps', current: 20, required: 80, priority: 'Critical' }
  ],
  'Full-Stack Software Developer': [
    { skill: 'HTML / CSS / JavaScript', current: 85, required: 95, priority: 'Low' },
    { skill: 'React / Frontend Frameworks', current: 70, required: 90, priority: 'Medium' },
    { skill: 'Node.js / Express Backend', current: 65, required: 85, priority: 'Medium' },
    { skill: 'Database Management (SQL)', current: 60, required: 85, priority: 'High' },
    { skill: 'Cloud & Vercel Deployment', current: 40, required: 80, priority: 'High' }
  ],
  'Corporate & IPR Lawyer': [
    { skill: 'Legal Reasoning & Analysis', current: 70, required: 95, priority: 'High' },
    { skill: 'Contract Drafting & Negotiation', current: 30, required: 90, priority: 'Critical' },
    { skill: 'Verbal Fluency & Advocacy', current: 85, required: 90, priority: 'Low' },
    { skill: 'Corporate Regulation Knowledge', current: 25, required: 85, priority: 'Critical' },
    { skill: 'Research & Case Law Briefing', current: 60, required: 85, priority: 'Medium' }
  ]
};

// GET /api/skillgap/:userId
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const targetCareer = req.query.targetCareer || 'AI & Machine Learning Engineer';

    const benchmarks = CAREER_BENCHMARKS[targetCareer] || CAREER_BENCHMARKS['AI & Machine Learning Engineer'];

    // Calculate overall gap score percentage
    const totalDiff = benchmarks.reduce((acc, curr) => acc + (curr.required - curr.current), 0);
    const maxDiff = benchmarks.reduce((acc, curr) => acc + curr.required, 0);
    const overallGapScore = parseFloat(((totalDiff / maxDiff) * 100).toFixed(1));

    const prioritizedActions = benchmarks
      .filter(b => b.required - b.current > 20)
      .sort((a, b) => (b.required - b.current) - (a.required - a.current))
      .map(b => ({
        skill: b.skill,
        gapPercentage: b.required - b.current,
        priority: b.priority,
        action: `Complete dedicated study modules & practical exercises for ${b.skill}.`
      }));

    res.json({
      userId,
      targetCareer,
      overallGapScore, // e.g., 34.2% gap remaining
      benchmarks,
      prioritizedActions,
      chartData: {
        labels: benchmarks.map(b => b.skill),
        datasets: [
          {
            label: 'Your Current Mastery',
            data: benchmarks.map(b => b.current),
            backgroundColor: 'rgba(59, 130, 246, 0.4)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          },
          {
            label: 'Industry Target Benchmark',
            data: benchmarks.map(b => b.required),
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
