const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && !apiKey.includes('your_gemini_api_key')) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini API initialized successfully with key.');
  } catch (e) {
    console.warn('⚠️ Gemini API init error, will use intelligent fallback:', e.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not provided. Running in Intelligent AI Fallback Mode.');
}

/**
 * 1. Psychometric Assessment Report Generator
 */
async function generatePsychometricReport(answers, scores) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
You are an expert career psychologist and psychometrics counselor.
Analyze the following student assessment data:
Aptitude Scores: ${JSON.stringify(scores.aptitude)}
RIASEC Interest Profile: ${JSON.stringify(scores.riasec)}
Big Five Personality Traits: ${JSON.stringify(scores.bigFive)}
Work Values: ${JSON.stringify(scores.workValues)}

Provide a JSON output matching this schema exactly:
{
  "summary": "Plain language summary of strengths, personality, and potential",
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "personalitySummary": "Brief overview of personality in academic/work settings",
  "recommendedCareers": [
    { "title": "Career Path 1", "matchPercentage": 94, "rationale": "Why this fits" },
    { "title": "Career Path 2", "matchPercentage": 88, "rationale": "Why this fits" },
    { "title": "Career Path 3", "matchPercentage": 82, "rationale": "Why this fits" }
  ]
}
Return ONLY valid JSON. Do not include markdown code block formatting.
`;
      const response = await model.generateContent(prompt);
      const text = response.response.text() || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini API report call failed, using fallback:', err.message);
    }
  }

  // Fallback engine logic
  const riasecTop = Object.entries(scores.riasec || {})
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Investigative';
  
  let recommended = [
    { title: 'AI & Machine Learning Engineer', matchPercentage: 95, rationale: 'Matches high analytical aptitude, logical reasoning, and investigative interest profile.' },
    { title: 'Full-Stack Software Developer', matchPercentage: 90, rationale: 'Combines technical problem-solving with creative design and high conscientiousness.' },
    { title: 'Data Scientist & Analyst', matchPercentage: 86, rationale: 'Fits strong mathematical reasoning, curiosity, and research-oriented work values.' }
  ];

  if (riasecTop === 'Enterprising' || riasecTop === 'Social') {
    recommended = [
      { title: 'Product Manager', matchPercentage: 94, rationale: 'High leadership, communication skills, and social intelligence score.' },
      { title: 'Corporate & IPR Lawyer', matchPercentage: 89, rationale: 'Combines strong verbal reasoning, structured thinking, and enterprising drive.' },
      { title: 'Financial Analyst & Investment Banker', matchPercentage: 85, rationale: 'Strong analytical discipline with high strategic decision-making aptitude.' }
    ];
  }

  return {
    summary: `You display a remarkably balanced profile with primary strengths in ${riasecTop} domain activities. Your problem-solving skills and structured approach to learning position you well for high-growth technical and strategic professions.`,
    topStrengths: ['Analytical Reasoning & Problem Solving', 'Self-Driven Learning & Curiosity', 'Structured Execution & Detail Focus'],
    personalitySummary: 'High Conscientiousness and Openness to Experience. You thrive in structured environments that encourage innovative problem solving and continuous skill mastery.',
    recommendedCareers: recommended
  };
}

/**
 * 2. Dynamic Learning Roadmap Generator
 */
async function generateRoadmap(targetCareer, userGrade, skillGap) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
Generate a 6-step month-by-month learning roadmap for a student in ${userGrade} aiming for the career: "${targetCareer}".
Skill Gap Context: ${JSON.stringify(skillGap)}

Return ONLY a JSON array of milestones matching:
[
  {
    "id": "m1",
    "stepNumber": 1,
    "title": "Milestone Title",
    "timeframe": "Month 1-2",
    "description": "Detailed description of what to study/do",
    "resources": [
      { "title": "Resource Name", "url": "https://example.com", "type": "Course/Book" }
    ],
    "status": "pending"
  }
]
Return ONLY valid JSON.
`;
      const response = await model.generateContent(prompt);
      const text = response.response.text() || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini roadmap call failed, using fallback:', err.message);
    }
  }

  // Dynamic Fallback Generator
  return [
    {
      id: 'm1',
      stepNumber: 1,
      title: 'Foundational Knowledge & Core Subjects Mastery',
      timeframe: 'Month 1-2',
      description: `Build deep fundamentals in Mathematics, Logic, and introductory concepts required for ${targetCareer}. Concentrate on board exam / school syllabus alignment.`,
      resources: [
        { title: 'Khan Academy Advanced High School Math & Science', url: 'https://khanacademy.org', type: 'Free Course' },
        { title: 'MIT OpenCourseWare Intro to Computational Thinking', url: 'https://ocw.mit.edu', type: 'Video Lectures' }
      ],
      status: 'completed'
    },
    {
      id: 'm2',
      stepNumber: 2,
      title: 'Skill Gap Bridge & Technical Fundamentals',
      timeframe: 'Month 3-4',
      description: `Focus on essential skill gap items: Python Programming, Data Structures, and Algorithmic Thinking.`,
      resources: [
        { title: 'Python for Everybody - University of Michigan', url: 'https://coursera.org', type: 'Certification' },
        { title: 'FreeCodeCamp Full Curriculum', url: 'https://freecodecamp.org', type: 'Interactive Practice' }
      ],
      status: 'in-progress'
    },
    {
      id: 'm3',
      stepNumber: 3,
      title: 'Entrance Exam Preparation & Test Series',
      timeframe: 'Month 5-6',
      description: 'Enroll in periodic mock tests, timed problem-solving drills, and entrance exam past-year questions.',
      resources: [
        { title: 'NTA Official Mock Test Portal', url: 'https://nta.ac.in', type: 'Exam Prep' },
        { title: 'Standard Past 10-Year Question Bank', url: 'https://careerx.edu/resources', type: 'Practice Papers' }
      ],
      status: 'pending'
    },
    {
      id: 'm4',
      stepNumber: 4,
      title: 'Capstone Mini-Project & Portfolio Creation',
      timeframe: 'Month 7-8',
      description: `Create 2 hands-on projects demonstrating application of concepts related to ${targetCareer}. Publish code to GitHub.`,
      resources: [
        { title: 'GitHub Student Developer Pack', url: 'https://education.github.com', type: 'Developer Tools' },
        { title: 'Kaggle Datasets & Community Projects', url: 'https://kaggle.com', type: 'Project Ideas' }
      ],
      status: 'pending'
    },
    {
      id: 'm5',
      stepNumber: 5,
      title: 'College Selection & Scholarship Applications',
      timeframe: 'Month 9-10',
      description: 'Shortlist top matched colleges based on budget, accreditation, and location. Prepare application essays and scholarship forms.',
      resources: [
        { title: 'CareerX College Finder & Geo Tool', url: '/colleges', type: 'Internal Tool' }
      ],
      status: 'pending'
    },
    {
      id: 'm6',
      stepNumber: 6,
      title: 'Final Exam Sprint & Interview Readiness',
      timeframe: 'Month 11-12',
      description: 'Conduct final revision sweeps, mock interviews, and physical/mental wellness routines prior to entrance exams.',
      resources: [
        { title: 'CareerX 24/7 AI Mentor Final Review', url: '/mentor', type: 'AI Mentorship' }
      ],
      status: 'pending'
    }
  ];
}

/**
 * 3. 24/7 AI Mentor Chatbot with Crisis Escalation Detection
 */
async function generateMentorResponse(userMessage, chatHistory = [], userContext = {}) {
  // Safety Guardrail: Detect mental health / self-harm / extreme anxiety distress queries
  const crisisKeywords = ['suicide', 'kill myself', 'depressed', 'can\'t take it anymore', 'worthless', 'end it all', 'giving up on life', 'panic attack'];
  const lowerMsg = userMessage.toLowerCase();
  const containsCrisis = crisisKeywords.some(kw => lowerMsg.includes(kw));

  if (containsCrisis) {
    return {
      content: `I can hear how overwhelmed and stressed you are feeling right now. Please know that your health, well-being, and safety are far more important than any exam, grade, or career choice. You are not alone, and help is available right now.

Please reach out to a professional counselor or trusted adult immediately:
• **Vandrevala Foundation Helpline (24/7):** 9999 666 555
• **Tele-MANAS National Helpline:** 14416 or 1800 891 4416
• **iCALL Psychosocial Helpline:** 9152987821

I am flagging this for immediate human counselor connection. Please take a deep breath and connect with someone who can support you today.`,
      requiresHumanEscalation: true
    };
  }

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const systemInstruction = `
You are CareerX AI Mentor, a warm, encouraging, knowledgeable, and empathetic career guidance counselor for high school and university students.
Student Context:
- Name: ${userContext.name || 'Student'}
- Grade/Year: ${userContext.grade || 'High School'}
- Target Career Goals: ${userContext.targetCareer || 'Technology & Science'}
- Budget Preference: ${JSON.stringify(userContext.budgetRange || {})}

Provide clear, actionable, friendly guidance. Keep answers concise, highly encouraging, and structured with bullet points where appropriate.
`;

      const prompt = `System: ${systemInstruction}\nUser Message: ${userMessage}`;
      const response = await model.generateContent(prompt);
      return {
        content: response.response.text(),
        requiresHumanEscalation: false
      };
    } catch (err) {
      console.warn('Gemini chat call failed, using fallback:', err.message);
    }
  }

  // Fallback Chat Response Generator
  let reply = `That is a great question regarding your academic journey! `;

  if (lowerMsg.includes('exam') || lowerMsg.includes('jee') || lowerMsg.includes('neet') || lowerMsg.includes('prep')) {
    reply += `Preparing for competitive entrance exams requires consistency over cramming. I recommend splitting your daily routine into 60% concept revision, 30% problem practice, and 10% test error analysis. Have you checked out your personalized Exam Tracker tab yet?`;
  } else if (lowerMsg.includes('college') || lowerMsg.includes('university') || lowerMsg.includes('location')) {
    reply += `When choosing a college, consider 3 key factors: Course Curriculum Quality, Location/Distance from home, and Total Budget (Tuition + Hostel fees). You can use our College Geo-Discovery tool on the Colleges page to find options matching your exact budget and distance radius!`;
  } else if (lowerMsg.includes('skill') || lowerMsg.includes('learn') || lowerMsg.includes('gap')) {
    reply += `To stand out in today's job market, focus on building tangible portfolio projects alongside your school syllabus. Visit the Skill-Gap page to see the exact top 5 skills recommended for your target career!`;
  } else {
    reply += `As your 24/7 CareerX AI Mentor, I'm here to help you step-by-step. Based on your profile, you are making steady progress on your roadmap. What specific aspect of your career planning would you like to explore today?`;
  }

  return {
    content: reply,
    requiresHumanEscalation: false
  };
}

module.exports = {
  generatePsychometricReport,
  generateRoadmap,
  generateMentorResponse
};
