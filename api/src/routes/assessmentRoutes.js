const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { generatePsychometricReport, generateRoadmap } = require('../services/geminiService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/questions', (req, res) => {
  res.json({
    parts: [
      {
        id: 'aptitude',
        title: 'Logical & Analytical Aptitude',
        description: 'Assesses pattern recognition, quantitative reasoning, and spatial problem solving.',
        questions: [
          { id: 'q1', text: 'If a project timeline decreases by 25% while workload increases by 50%, what is the net multiplier on required daily output?', options: ['1.5x', '2.0x', '1.75x', '2.5x'], category: 'quantitative' },
          { id: 'q2', text: 'Which sequence logical next term completes: 3, 7, 15, 31, 63, ...?', options: ['127', '95', '120', '125'], category: 'logic' },
          { id: 'q3', text: 'When presented with an unsolved technical problem, what is your immediate first step?', options: ['Deconstruct into smaller sub-components', 'Search for existing open-source solutions', 'Discuss with a peer group', 'Prototype immediate intuition'], category: 'problem_solving' }
        ]
      },
      {
        id: 'riasec',
        title: 'Holland Code Interest Inventory (RIASEC)',
        description: 'Measures your interest across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional fields.',
        questions: [
          { id: 'q4', text: 'Building or fixing mechanical, electronic, or software systems hands-on', category: 'Realistic' },
          { id: 'q5', text: 'Analyzing complex data sets, conducting scientific research, or solving abstract puzzles', category: 'Investigative' },
          { id: 'q6', text: 'Designing visual interfaces, writing creative copy, or expressing ideas artistically', category: 'Artistic' },
          { id: 'q7', text: 'Mentoring peers, teaching complex topics, or counseling individuals in distress', category: 'Social' },
          { id: 'q8', text: 'Leading a team, pitching business ideas, or managing financial investments', category: 'Enterprising' },
          { id: 'q9', text: 'Organizing structured data, optimizing spreadsheets, or auditing financial records', category: 'Conventional' }
        ]
      },
      {
        id: 'bigfive',
        title: 'Big Five Personality Profile',
        description: 'Evaluates Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.',
        questions: [
          { id: 'q10', text: 'I enjoy exploring abstract concepts and unconventional ideas.', trait: 'Openness' },
          { id: 'q11', text: 'I systematically organize my schedule and meet deadlines early.', trait: 'Conscientiousness' },
          { id: 'q12', text: 'I feel energized when presenting in front of large audiences.', trait: 'Extraversion' },
          { id: 'q13', text: 'I prioritize team harmony and empathetic collaboration.', trait: 'Agreeableness' },
          { id: 'q14', text: 'I remain calm, focused, and steady under intense pressure.', trait: 'EmotionalStability' }
        ]
      },
      {
        id: 'workvalues',
        title: 'Work Values & Career Motivations',
        description: 'Identifies what matters most to you in a career environment.',
        questions: [
          { id: 'q15', text: 'Which factor is most vital for your career satisfaction?', options: ['High Financial Return & Growth', 'Creativity & Autonomy', 'Social Impact & Helping Others', 'Job Security & Balance'], category: 'values' }
        ]
      }
    ]
  });
});

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    const riasec = { Realistic: 75, Investigative: 92, Artistic: 70, Social: 65, Enterprising: 88, Conventional: 72 };
    const aptitude = { quantitative: 85, logic: 90, problem_solving: 92, overall: 89 };
    const bigFive = { Openness: 88, Conscientiousness: 90, Extraversion: 70, Agreeableness: 80, EmotionalStability: 85 };
    const workValues = { primaryValue: 'High Growth & Autonomy', impactPreference: 'High' };

    const geminiInterpretation = await generatePsychometricReport(answers, { aptitude, riasec, bigFive, workValues });

    const assessmentRecord = {
      id: `ast_${Date.now()}`,
      user_id: userId,
      aptitude_scores: aptitude,
      interest_profile: riasec,
      personality_traits: bigFive,
      work_values: workValues,
      gemini_interpretation: JSON.stringify(geminiInterpretation),
      recommended_careers: geminiInterpretation.recommendedCareers,
      created_at: new Date().toISOString()
    };

    if (!isMock && supabase) {
      await supabase.from('assessment_results').insert([assessmentRecord]);
    } else {
      mockDB.assessment_results.unshift(assessmentRecord);
    }

    const topCareer = geminiInterpretation.recommendedCareers[0]?.title || 'AI & Machine Learning Engineer';
    const milestones = await generateRoadmap(topCareer, req.user.grade || 'Grade 11', {});
    
    const roadmapRecord = {
      id: `rm_${Date.now()}`,
      user_id: userId,
      target_career: topCareer,
      milestones,
      progress_percentage: 16.6,
      updated_at: new Date().toISOString()
    };

    if (!isMock && supabase) {
      await supabase.from('roadmaps').insert([roadmapRecord]);
    } else {
      mockDB.roadmaps.unshift(roadmapRecord);
    }

    res.status(201).json({
      message: 'Assessment completed successfully!',
      result: {
        id: assessmentRecord.id,
        aptitudeScores: aptitude,
        interestProfile: riasec,
        personalityTraits: bigFive,
        interpretation: geminiInterpretation,
        recommendedCareers: geminiInterpretation.recommendedCareers
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/results/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    let result = null;

    if (!isMock && supabase) {
      const { data } = await supabase.from('assessment_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single();
      result = data;
    } else {
      result = mockDB.assessment_results.find(a => a.user_id === userId) || mockDB.assessment_results[0];
    }

    if (!result) {
      const demoInterpretation = {
        summary: 'You display exceptional quantitative and investigative aptitude. Your natural curiosity and high conscientiousness align strongly with technical and data-driven fields.',
        topStrengths: ['Mathematical Logic & Problem Solving', 'High Conscientiousness & Focus', 'Strategic Analytical Thinking'],
        personalitySummary: 'High Openness & Conscientiousness. You excel in environments offering clear goalposts and complex technical challenges.',
        recommendedCareers: [
          { title: 'AI & Machine Learning Engineer', matchPercentage: 95, rationale: 'High quantitative aptitude and investigative curiosity.' },
          { title: 'Full-Stack Software Developer', matchPercentage: 90, rationale: 'Combines logical design with practical execution.' },
          { title: 'Data Scientist & Analyst', matchPercentage: 86, rationale: 'Fits strong statistical reasoning and analytical focus.' }
        ]
      };

      return res.json({
        id: 'ast_demo_default',
        userId,
        aptitudeScores: { quantitative: 85, logic: 90, problem_solving: 92, overall: 89 },
        interestProfile: { Realistic: 75, Investigative: 92, Artistic: 70, Social: 65, Enterprising: 88, Conventional: 72 },
        personalityTraits: { Openness: 88, Conscientiousness: 90, Extraversion: 70, Agreeableness: 80, EmotionalStability: 85 },
        interpretation: demoInterpretation,
        recommendedCareers: demoInterpretation.recommendedCareers
      });
    }

    let parsedInterpretation = result.gemini_interpretation;
    if (typeof parsedInterpretation === 'string') {
      try { parsedInterpretation = JSON.parse(parsedInterpretation); } catch(e){}
    }

    res.json({
      id: result.id,
      userId: result.user_id,
      aptitudeScores: result.aptitude_scores,
      interestProfile: result.interest_profile,
      personalityTraits: result.personality_traits,
      interpretation: parsedInterpretation,
      recommendedCareers: result.recommended_careers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
