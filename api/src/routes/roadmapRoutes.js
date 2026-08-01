const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { generateRoadmap } = require('../services/geminiService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    let roadmap = null;

    if (!isMock && supabase) {
      const { data } = await supabase.from('roadmaps').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(1).single();
      roadmap = data;
    } else {
      roadmap = mockDB.roadmaps.find(r => r.user_id === userId) || mockDB.roadmaps[0];
    }

    if (!roadmap) {
      const defaultMilestones = await generateRoadmap('AI & Machine Learning Engineer', req.user.grade || 'Grade 11', {});
      roadmap = {
        id: 'rm_default_demo',
        user_id: userId,
        target_career: 'AI & Machine Learning Engineer',
        milestones: defaultMilestones,
        progress_percentage: 16.6,
        updated_at: new Date().toISOString()
      };
    }

    let milestones = roadmap.milestones;
    if (typeof milestones === 'string') {
      try { milestones = JSON.parse(milestones); } catch (e) {}
    }

    res.json({
      id: roadmap.id,
      userId: roadmap.user_id,
      targetCareer: roadmap.target_career,
      milestones,
      progressPercentage: roadmap.progress_percentage,
      updatedAt: roadmap.updated_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:userId/milestone/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const milestoneId = req.params.id;
    const { status } = req.body;

    let roadmap = null;
    if (!isMock && supabase) {
      const { data } = await supabase.from('roadmaps').select('*').eq('user_id', userId).single();
      roadmap = data;
    } else {
      roadmap = mockDB.roadmaps.find(r => r.user_id === userId) || mockDB.roadmaps[0];
    }

    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found.' });

    let milestones = roadmap.milestones;
    if (typeof milestones === 'string') milestones = JSON.parse(milestones);

    milestones = milestones.map(m => {
      if (m.id === milestoneId) return { ...m, status };
      return m;
    });

    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const newProgress = parseFloat(((completedCount / milestones.length) * 100).toFixed(1));

    if (!isMock && supabase) {
      await supabase.from('roadmaps').update({ milestones: JSON.stringify(milestones), progress_percentage: newProgress, updated_at: new Date().toISOString() }).eq('id', roadmap.id);
    } else {
      roadmap.milestones = milestones;
      roadmap.progress_percentage = newProgress;
      roadmap.updated_at = new Date().toISOString();
    }

    res.json({ message: 'Milestone updated', progressPercentage: newProgress, milestones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetCareer } = req.body;
    const milestones = await generateRoadmap(targetCareer, req.user.grade || 'Grade 11', {});
    const roadmapRecord = { id: `rm_${Date.now()}`, user_id: userId, target_career: targetCareer, milestones, progress_percentage: 0, updated_at: new Date().toISOString() };

    if (!isMock && supabase) {
      await supabase.from('roadmaps').insert([roadmapRecord]);
    } else {
      mockDB.roadmaps.unshift(roadmapRecord);
    }

    res.status(201).json({ message: `Roadmap generated for ${targetCareer}`, roadmap: { id: roadmapRecord.id, targetCareer, milestones, progressPercentage: 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
