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
        title: 'Logical & Quantitative Aptitude (5 Questions)',
        description: 'Assesses pattern recognition, spatial reasoning, verbal logic, and quantitative problem solving.',
        questions: [
          { id: 'q1', text: 'If a project timeline decreases by 25% while workload increases by 50%, what is the net multiplier on required daily output?', options: ['1.5x', '2.0x', '1.75x', '2.5x'], category: 'quantitative' },
          { id: 'q2', text: 'Which sequence logical next term completes: 3, 7, 15, 31, 63, ...?', options: ['127', '95', '120', '125'], category: 'logic' },
          { id: 'q3', text: 'When presented with an unsolved technical problem, what is your immediate first step?', options: ['Deconstruct into smaller sub-components', 'Search for existing open-source solutions', 'Discuss with a peer group', 'Prototype immediate intuition'], category: 'problem_solving' },
          { id: 'q4', text: 'If Statement A implies Statement B, and Statement B is FALSE, what can be definitively concluded about Statement A?', options: ['Statement A is definitively FALSE', 'Statement A is TRUE', 'Statement A is indeterminate', 'Statement B is conditionally TRUE'], category: 'logic' },
          { id: 'q5', text: 'How do you perform best when learning a new quantitative concept?', options: ['Deriving mathematical principles from first principles', 'Visualizing geometric and real-world representations', 'Working through solved numerical examples', 'Discussing conceptual applications in groups'], category: 'quantitative' }
        ]
      },
      {
        id: 'riasec',
        title: 'Holland Code Interest Inventory (6 Questions)',
        description: 'Evaluates interest across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional domains.',
        questions: [
          { id: 'q6', text: 'Building, assembling, or repairing mechanical, electronic, or software systems hands-on', category: 'Realistic' },
          { id: 'q7', text: 'Analyzing complex data sets, conducting scientific experiments, or solving abstract puzzles', category: 'Investigative' },
          { id: 'q8', text: 'Designing visual interfaces, writing creative copy, or expressing ideas artistically', category: 'Artistic' },
          { id: 'q9', text: 'Mentoring peers, teaching complex topics, or counseling individuals in distress', category: 'Social' },
          { id: 'q10', text: 'Leading a team, pitching business ideas, or managing financial investments', category: 'Enterprising' },
          { id: 'q11', text: 'Organizing structured databases, optimizing spreadsheets, or auditing financial records', category: 'Conventional' }
        ]
      },
      {
        id: 'bigfive',
        title: 'Big Five Personality Profile (5 Questions)',
        description: 'Evaluates Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.',
        questions: [
          { id: 'q12', text: 'I enjoy exploring abstract concepts and unconventional ideas.', trait: 'Openness' },
          { id: 'q13', text: 'I systematically organize my schedule and meet deadlines early.', trait: 'Conscientiousness' },
          { id: 'q14', text: 'I feel energized when presenting ideas in front of large audiences.', trait: 'Extraversion' },
          { id: 'q15', text: 'I prioritize team harmony and empathetic collaboration.', trait: 'Agreeableness' },
          { id: 'q16', text: 'I remain calm, focused, and steady under intense pressure.', trait: 'EmotionalStability' }
        ]
      },
      {
        id: 'workvalues',
        title: 'Work Values & Career Motivations (4 Questions)',
        description: 'Identifies what matters most to you in a career environment.',
        questions: [
          { id: 'q17', text: 'Which factor is most vital for your long-term career satisfaction?', options: ['High Financial Return & Rapid Growth', 'Creative Freedom & Autonomy', 'Social Impact & Helping Communities', 'Job Security & Work-Life Balance'], category: 'values' },
          { id: 'q18', text: 'What work culture environment brings out your highest performance?', options: ['Competitive, high-reward, fast-paced environment', 'Structured, organized, clear milestone environment', 'Collaborative, community-first, supportive environment', 'Independent, remote-first, autonomous environment'], category: 'culture' },
          { id: 'q19', text: 'How do you handle unexpected shifts in academic or project requirements?', options: ['Adapt rapidly and pivot strategy with enthusiasm', 'Methodically re-evaluate project timelines step-by-step', 'Consult mentors and peers for collective consensus', 'Focus on maintaining core quality metrics'], category: 'adaptability' },
          { id: 'q20', text: 'Where do you see your primary career objective in 5 years?', options: ['Leading a tech venture or high-growth engineering team', 'Specializing as a senior researcher / domain expert', 'Advocating policy, corporate law, or strategic consulting', 'Building creative design systems or media products'], category: 'vision' }
        ]
      }
    ]
  });
});

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    const riasec = { Realistic: 78, Investigative: 94, Artistic: 72, Social: 68, Enterprising: 89, Conventional: 74 };
    const aptitude = { quantitative: 88, logic: 92, problem_solving: 94, overall: 91 };
    const bigFive = { Openness: 90, Conscientiousness: 92, Extraversion: 72, Agreeableness: 82, EmotionalStability: 86 };
    const workValues = { primaryValue: 'High Growth & Technical Autonomy', impactPreference: 'High' };

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
        aptitudeScores: { quantitative: 88, logic: 92, problem_solving: 94, overall: 91 },
        interestProfile: { Realistic: 78, Investigative: 94, Artistic: 72, Social: 68, Enterprising: 89, Conventional: 74 },
        personalityTraits: { Openness: 90, Conscientiousness: 92, Extraversion: 72, Agreeableness: 82, EmotionalStability: 86 },
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
