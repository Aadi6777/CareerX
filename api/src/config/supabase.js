const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isMock = true;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isMock = false;
    console.log('✅ Supabase client initialized connected to:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed. Falling back to Mock DB Store.', err.message);
  }
} else {
  console.log('ℹ️ SUPABASE_URL / SUPABASE_ANON_KEY not configured. Running with in-memory Mock Supabase DB.');
}

// In-Memory Database Store for Mock Mode
const mockDB = {
  users: [
    {
      id: 'usr_demo_101',
      email: 'student@example.com',
      password_hash: '$2a$10$w8T0M44M5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O',
      name: 'Aarav Sharma',
      role: 'student',
      grade: 'Grade 11 (Science)',
      location: 'Mumbai, Maharashtra',
      budget_range: { min: 100000, max: 400000 },
      career_uncertainty: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_parent_202',
      email: 'parent@example.com',
      password_hash: '$2a$10$w8T0M44M5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O',
      name: 'Rajesh Sharma',
      role: 'parent',
      grade: 'N/A',
      location: 'Mumbai, Maharashtra',
      linked_student_id: 'usr_demo_101',
      created_at: new Date().toISOString()
    }
  ],
  assessment_results: [],
  skill_gaps: [],
  roadmaps: [],
  exam_recommendations: [
    { id: 'ex_1', exam_name: 'JEE Advanced / Main', category: 'Engineering', eligibility: '10+2 with Physics, Chemistry, Math', exam_date: 'April 2027', preparation_months: 12, description: 'National entrance for premier IITs & NITs.', official_url: 'https://jeemain.nta.ac.in', relevance_score: 96 },
    { id: 'ex_2', exam_name: 'NEET UG', category: 'Medical', eligibility: '10+2 with Biology, Physics, Chemistry', exam_date: 'May 2027', preparation_months: 12, description: 'Single national entrance exam for MBBS and allied medical streams.', official_url: 'https://neet.nta.nic.in', relevance_score: 94 },
    { id: 'ex_3', exam_name: 'CLAT', category: 'Law', eligibility: '10+2 in any stream with min 45%', exam_date: 'December 2026', preparation_months: 8, description: 'Common Law Admission Test for premier National Law Universities (NLUs).', official_url: 'https://consortiumofnlus.ac.in', relevance_score: 90 },
    { id: 'ex_4', exam_name: 'CUET UG', category: 'General Arts & Science', eligibility: '10+2 in relevant subjects', exam_date: 'May 2027', preparation_months: 6, description: 'Central Universities Entrance Test for DU, BHU, JNU undergraduate programs.', official_url: 'https://cuet.samarth.ac.in', relevance_score: 92 },
    { id: 'ex_5', exam_name: 'IPMAT', category: 'Management', eligibility: '10+2 with min 60%', exam_date: 'May 2027', preparation_months: 8, description: 'Integrated Program in Management Aptitude Test for 5-year BBA+MBA at IIM Indore / Rohtak.', official_url: 'https://iimidr.ac.in', relevance_score: 88 },
    { id: 'ex_6', exam_name: 'SAT Reasoning Test', category: 'Global / International', eligibility: 'High school student (Grades 10-12)', exam_date: 'Multiple Dates Yearly', preparation_months: 6, description: 'Standardized test for university admissions in the US, Canada, and global campuses.', official_url: 'https://satsuite.collegeboard.org', relevance_score: 89 }
  ],
  colleges: [
    { id: 'clg_1', name: 'Indian Institute of Technology (IIT) Bombay', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, tuition_min: 200000, tuition_max: 250000, type: 'Government', accreditation: 'NAAC A++', ranking: 1, hostel_available: true, programs_offered: ['Computer Science', 'Electrical Engineering', 'Data Science & AI', 'Mechanical Engineering'], website: 'https://iitb.ac.in' },
    { id: 'clg_2', name: 'Birla Institute of Technology and Science (BITS)', city: 'Pilani', state: 'Rajasthan', latitude: 28.3639, longitude: 75.5869, tuition_min: 450000, tuition_max: 550000, type: 'Private', accreditation: 'NAAC A++', ranking: 5, hostel_available: true, programs_offered: ['Computer Science', 'Electronics', 'Chemical Engineering', 'Biotechnology'], website: 'https://bits-pilani.ac.in' },
    { id: 'clg_3', name: 'National Law School of India University (NLSIU)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, tuition_min: 300000, tuition_max: 350000, type: 'Government', accreditation: 'NAAC A++', ranking: 1, hostel_available: true, programs_offered: ['BA LLB (Hons)', 'LLM', 'Public Policy'], website: 'https://nls.ac.in' },
    { id: 'clg_4', name: "St. Xavier's College", city: 'Mumbai', state: 'Maharashtra', latitude: 18.9438, longitude: 72.8315, tuition_min: 30000, tuition_max: 80000, type: 'Private', accreditation: 'NAAC A+', ranking: 4, hostel_available: true, programs_offered: ['BSc Computer Science', 'BBA', 'Mass Media', 'Economics'], website: 'https://xaviers.edu' },
    { id: 'clg_5', name: 'All India Institute of Medical Sciences (AIIMS)', city: 'New Delhi', state: 'Delhi', latitude: 28.5672, longitude: 77.2100, tuition_min: 1500, tuition_max: 5000, type: 'Government', accreditation: 'Institute of National Importance', ranking: 1, hostel_available: true, programs_offered: ['MBBS', 'BSc Nursing', 'Paramedical Science'], website: 'https://aiims.edu' },
    { id: 'clg_6', name: 'SRM Institute of Science and Technology', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.8231, longitude: 80.0442, tuition_min: 250000, tuition_max: 400000, type: 'Private', accreditation: 'NAAC A++', ranking: 18, hostel_available: true, programs_offered: ['B.Tech CS', 'Artificial Intelligence', 'Bioinformatics', 'BBA'], website: 'https://srmist.edu.in' }
  ],
  mentor_sessions: [],
  job_market_data: [
    { id: 'jm_1', career_path: 'AI & Machine Learning Engineer', demand_trend: 'Explosive', growth_percentage: 34.5, salary_min: 800000, salary_max: 2800000, top_skills: ['Python', 'PyTorch/TensorFlow', 'Deep Learning', 'MLOps', 'Linear Algebra'], key_industries: ['Tech', 'Fintech', 'Healthcare', 'Automotive'] },
    { id: 'jm_2', career_path: 'Full-Stack Software Developer', demand_trend: 'Very High', growth_percentage: 22.0, salary_min: 600000, salary_max: 2200000, top_skills: ['React/Next.js', 'Node.js', 'PostgreSQL/Supabase', 'System Design', 'TypeScript'], key_industries: ['SaaS', 'E-commerce', 'Enterprise Software'] },
    { id: 'jm_3', career_path: 'Corporate & IPR Lawyer', demand_trend: 'High', growth_percentage: 16.5, salary_min: 700000, salary_max: 2500000, top_skills: ['Contract Law', 'Corporate Governance', 'M&A Drafting', 'Negotiation', 'IP Regulation'], key_industries: ['Law Firms', 'Corporate Legal Departments', 'Consulting'] },
    { id: 'jm_4', career_path: 'Data Scientist & Analyst', demand_trend: 'Explosive', growth_percentage: 28.0, salary_min: 650000, salary_max: 2400000, top_skills: ['SQL', 'Python/R', 'Statistical Modeling', 'PowerBI/Tableau', 'Machine Learning'], key_industries: ['Finance', 'Retail', 'Healthcare', 'Consulting'] },
    { id: 'jm_5', career_path: 'Product Manager', demand_trend: 'High', growth_percentage: 19.2, salary_min: 900000, salary_max: 3200000, top_skills: ['User Research', 'Agile/Scrum', 'Data Analytics', 'Product Strategy', 'UX Wireframing'], key_industries: ['Technology', 'Fintech', 'Consumer Internet'] },
    { id: 'jm_6', career_path: 'Financial Analyst & Investment Banker', demand_trend: 'High', growth_percentage: 15.0, salary_min: 800000, salary_max: 3000000, top_skills: ['Financial Modeling', 'Valuation', 'Excel/VBA', 'Equity Research', 'Risk Analysis'], key_industries: ['Investment Banking', 'Private Equity', 'Hedge Funds'] }
  ]
};

module.exports = {
  supabase,
  isMock,
  mockDB
};
