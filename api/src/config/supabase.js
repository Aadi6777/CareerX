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

const mockDB = {
  users: [
    {
      id: 'usr_demo_101',
      email: 'student@example.com',
      password_hash: '$2a$10$w8T0M44M5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O5O',
      name: 'Aarav Sharma',
      role: 'student',
      grade: 'Grade 11 (Science)',
      location: 'Bengaluru, Karnataka',
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
      location: 'Bengaluru, Karnataka',
      linked_student_id: 'usr_demo_101',
      created_at: new Date().toISOString()
    }
  ],
  assessment_results: [],
  skill_gaps: [],
  roadmaps: [],
  exam_recommendations: [
    { id: 'ex_1', exam_name: 'KCET / COMEDK', category: 'Engineering (Karnataka)', eligibility: '10+2 with Physics, Chemistry, Math', exam_date: 'May 2027', preparation_months: 10, description: 'Karnataka state & private engineering entrance test for RVCE, BMSCE, MSRIT, PES.', official_url: 'https://comedk.org', relevance_score: 95 },
    { id: 'ex_2', exam_name: 'TNEA / TNCET', category: 'Engineering (Tamil Nadu)', eligibility: '10+2 with Physics, Chemistry, Math', exam_date: 'June 2027', preparation_months: 8, description: 'Tamil Nadu Engineering Admissions counseling for Anna Univ, PSG Tech, SSN.', official_url: 'https://tneaonline.org', relevance_score: 94 },
    { id: 'ex_3', exam_name: 'JEE Advanced / Main', category: 'Engineering', eligibility: '10+2 with Physics, Chemistry, Math', exam_date: 'April 2027', preparation_months: 12, description: 'National entrance for premier IITs (IIT Madras) & NITs (NIT Trichy).', official_url: 'https://jeemain.nta.ac.in', relevance_score: 96 },
    { id: 'ex_4', exam_name: 'NEET UG', category: 'Medical', eligibility: '10+2 with Biology, Physics, Chemistry', exam_date: 'May 2027', preparation_months: 12, description: 'Single national entrance exam for MBBS at CMC Vellore, St. Johns, AIIMS.', official_url: 'https://neet.nta.nic.in', relevance_score: 94 },
    { id: 'ex_5', exam_name: 'CLAT', category: 'Law', eligibility: '10+2 in any stream with min 45%', exam_date: 'December 2026', preparation_months: 8, description: 'Common Law Admission Test for NLSIU Bengaluru and top National Law Universities.', official_url: 'https://consortiumofnlus.ac.in', relevance_score: 90 },
    { id: 'ex_6', exam_name: 'VITEEE / SRMJEEE', category: 'Private Engineering', eligibility: '10+2 with min 60% PCM', exam_date: 'April 2027', preparation_months: 8, description: 'University entrance for VIT Vellore and SRM Institute Kattankulathur.', official_url: 'https://vit.ac.in', relevance_score: 91 }
  ],
  colleges: [
    // BANGALORE (BENGALURU)
    { id: 'clg_blr_1', name: 'Indian Institute of Science (IISc)', city: 'Bengaluru', state: 'Karnataka', latitude: 13.0184, longitude: 77.5670, tuition_min: 30000, tuition_max: 80000, type: 'Government', accreditation: 'NIRF #1 Overall', ranking: 1, hostel_available: true, programs_offered: ['BS Research', 'Data Science', 'Computer Science', 'Physics'], website: 'https://iisc.ac.in' },
    { id: 'clg_blr_2', name: 'RV College of Engineering (RVCE)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9237, longitude: 77.4987, tuition_min: 220000, tuition_max: 380000, type: 'Private', accreditation: 'NAAC A+', ranking: 6, hostel_available: true, programs_offered: ['Computer Science', 'AI & Machine Learning', 'Electronics & Comm', 'Biotechnology'], website: 'https://rvce.edu.in' },
    { id: 'clg_blr_3', name: 'BMS College of Engineering (BMSCE)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9410, longitude: 77.5655, tuition_min: 180000, tuition_max: 320000, type: 'Private', accreditation: 'NAAC A++', ranking: 8, hostel_available: true, programs_offered: ['Computer Science', 'Information Science', 'Electrical Engineering'], website: 'https://bmsce.ac.in' },
    { id: 'clg_blr_4', name: 'Ramaiah Institute of Technology (MSRIT)', city: 'Bengaluru', state: 'Karnataka', latitude: 13.0311, longitude: 77.5647, tuition_min: 200000, tuition_max: 350000, type: 'Private', accreditation: 'NAAC A+', ranking: 12, hostel_available: true, programs_offered: ['Computer Science', 'Cyber Security', 'Robotics & Automation'], website: 'https://msrit.edu' },
    { id: 'clg_blr_5', name: 'National Law School of India University (NLSIU)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, tuition_min: 300000, tuition_max: 380000, type: 'Government', accreditation: 'NIRF #1 Law', ranking: 1, hostel_available: true, programs_offered: ['BA LLB (Hons)', 'LLM', 'Public Policy'], website: 'https://nls.ac.in' },
    { id: 'clg_blr_6', name: 'IIIT Bangalore (IIIT-B)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.8448, longitude: 77.6632, tuition_min: 360000, tuition_max: 480000, type: 'Private', accreditation: 'NAAC A+', ranking: 15, hostel_available: true, programs_offered: ['iMTech CS', 'Data Science', 'Software Engineering'], website: 'https://iiitb.ac.in' },
    { id: 'clg_blr_7', name: 'PES University (Ring Road Campus)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9344, longitude: 77.5345, tuition_min: 320000, tuition_max: 450000, type: 'Private', accreditation: 'NAAC A+', ranking: 19, hostel_available: true, programs_offered: ['B.Tech CSE', 'AI & Data Science', 'BBA'], website: 'https://pes.edu' },
    { id: 'clg_blr_8', name: 'Christ University (Main Campus)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9343, longitude: 77.6060, tuition_min: 120000, tuition_max: 250000, type: 'Private', accreditation: 'NAAC A+', ranking: 22, hostel_available: true, programs_offered: ['BCA', 'BBA Finance', 'BSc Psychology'], website: 'https://christuniversity.in' },

    // TAMIL NADU
    { id: 'clg_tn_1', name: 'Indian Institute of Technology (IIT) Madras', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.9915, longitude: 80.2337, tuition_min: 200000, tuition_max: 260000, type: 'Government', accreditation: 'NIRF #1 Engineering', ranking: 1, hostel_available: true, programs_offered: ['Computer Science', 'Data Science & AI', 'Electrical Engineering'], website: 'https://iitm.ac.in' },
    { id: 'clg_tn_2', name: 'National Institute of Technology (NIT) Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', latitude: 10.7600, longitude: 78.8147, tuition_min: 140000, tuition_max: 190000, type: 'Government', accreditation: 'NAAC A++', ranking: 9, hostel_available: true, programs_offered: ['Computer Science', 'Electronics & Comm', 'Mechanical'], website: 'https://nitt.edu' },
    { id: 'clg_tn_3', name: 'College of Engineering Guindy (Anna University)', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0102, longitude: 80.2354, tuition_min: 40000, tuition_max: 90000, type: 'Government', accreditation: 'NAAC A++', ranking: 13, hostel_available: true, programs_offered: ['Computer Science', 'Information Technology', 'Geo-Informatics'], website: 'https://annauniv.edu' },
    { id: 'clg_tn_4', name: 'Vellore Institute of Technology (VIT)', city: 'Vellore', state: 'Tamil Nadu', latitude: 12.9692, longitude: 79.1559, tuition_min: 280000, tuition_max: 420000, type: 'Private', accreditation: 'NAAC A++', ranking: 11, hostel_available: true, programs_offered: ['B.Tech CSE', 'AI & Machine Learning', 'Bioinformatics'], website: 'https://vit.ac.in' },
    { id: 'clg_tn_5', name: 'PSG College of Technology', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0247, longitude: 77.0027, tuition_min: 120000, tuition_max: 220000, type: 'Private', accreditation: 'NAAC A++', ranking: 16, hostel_available: true, programs_offered: ['Computer Science', 'Robotics & Automation', 'Textile Tech'], website: 'https://psgtech.edu' },
    { id: 'clg_tn_6', name: 'SRM Institute of Science and Technology', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.8231, longitude: 80.0442, tuition_min: 250000, tuition_max: 400000, type: 'Private', accreditation: 'NAAC A++', ranking: 18, hostel_available: true, programs_offered: ['B.Tech CS', 'Artificial Intelligence', 'Bioinformatics'], website: 'https://srmist.edu.in' },
    { id: 'clg_tn_7', name: 'SSN College of Engineering', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.7509, longitude: 80.1973, tuition_min: 150000, tuition_max: 260000, type: 'Private', accreditation: 'NAAC A++', ranking: 24, hostel_available: true, programs_offered: ['Computer Science', 'IT', 'Electrical & Electronics'], website: 'https://ssn.edu.in' },
    { id: 'clg_tn_8', name: 'Christian Medical College (CMC)', city: 'Vellore', state: 'Tamil Nadu', latitude: 12.9250, longitude: 79.1333, tuition_min: 50000, tuition_max: 120000, type: 'Private', accreditation: 'NIRF #3 Medical', ranking: 3, hostel_available: true, programs_offered: ['MBBS', 'BSc Nursing', 'Occupational Therapy'], website: 'https://cmch-vellore.edu' },
    { id: 'clg_tn_9', name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0624, longitude: 80.2341, tuition_min: 35000, tuition_max: 95000, type: 'Private', accreditation: 'NAAC A++', ranking: 4, hostel_available: true, programs_offered: ['BSc Visual Comm', 'BCom Honours', 'BSc Physics'], website: 'https://loyolacollege.edu' },
    { id: 'clg_tn_10', name: 'Amrita Vishwa Vidyapeetham', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 10.9007, longitude: 76.9027, tuition_min: 220000, tuition_max: 350000, type: 'Private', accreditation: 'NAAC A++', ranking: 7, hostel_available: true, programs_offered: ['Computer Science', 'Cyber Security', 'Robotics'], website: 'https://amrita.edu' },
    { id: 'clg_tn_11', name: 'SASTRA Deemed University', city: 'Thanjavur', state: 'Tamil Nadu', latitude: 10.7280, longitude: 79.0200, tuition_min: 140000, tuition_max: 240000, type: 'Private', accreditation: 'NAAC A++', ranking: 21, hostel_available: true, programs_offered: ['B.Tech CSE', 'Aerospace Engineering', 'Biotechnology'], website: 'https://sastra.edu' },

    // OTHER MAJOR NATIONAL INSTITUTES
    { id: 'clg_nat_1', name: 'Indian Institute of Technology (IIT) Bombay', city: 'Mumbai', state: 'Maharashtra', latitude: 19.1334, longitude: 72.9133, tuition_min: 210000, tuition_max: 270000, type: 'Government', accreditation: 'NIRF #2 Overall', ranking: 2, hostel_available: true, programs_offered: ['Computer Science', 'Electrical Engineering', 'Mechanical', 'Aerospace'], website: 'https://iitb.ac.in' },
    { id: 'clg_nat_2', name: 'Indian Institute of Technology (IIT) Delhi', city: 'New Delhi', state: 'Delhi NCR', latitude: 28.5450, longitude: 77.1926, tuition_min: 200000, tuition_max: 260000, type: 'Government', accreditation: 'NIRF #3 Overall', ranking: 3, hostel_available: true, programs_offered: ['Computer Science', 'AI & Data Engineering', 'Chemical Engg'], website: 'https://iitd.ac.in' },
    { id: 'clg_nat_3', name: 'BITS Pilani (Pilani Campus)', city: 'Pilani', state: 'Rajasthan', latitude: 28.3639, longitude: 75.5869, tuition_min: 450000, tuition_max: 580000, type: 'Private', accreditation: 'NAAC A', ranking: 5, hostel_available: true, programs_offered: ['B.E. Computer Science', 'Economics', 'Electronics'], website: 'https://bits-pilani.ac.in' },
    { id: 'clg_nat_4', name: 'NIT Karnataka (NITK Surathkal)', city: 'Mangaluru', state: 'Karnataka', latitude: 13.0108, longitude: 74.7943, tuition_min: 135000, tuition_max: 185000, type: 'Government', accreditation: 'NAAC A++', ranking: 10, hostel_available: true, programs_offered: ['Computer Science', 'Information Technology', 'Mining Engg'], website: 'https://nitk.ac.in' },
    { id: 'clg_nat_5', name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', latitude: 17.4451, longitude: 78.3489, tuition_min: 380000, tuition_max: 480000, type: 'Private', accreditation: 'NAAC A++', ranking: 14, hostel_available: true, programs_offered: ['Computer Science', 'Computational Linguistics', 'ECE'], website: 'https://iiit.ac.in' },
    { id: 'clg_nat_6', name: 'All India Institute of Medical Sciences (AIIMS)', city: 'New Delhi', state: 'Delhi NCR', latitude: 28.5672, longitude: 77.2100, tuition_min: 5000, tuition_max: 15000, type: 'Government', accreditation: 'NIRF #1 Medical', ranking: 1, hostel_available: true, programs_offered: ['MBBS', 'BSc Nursing', 'Paramedical'], website: 'https://aiims.edu' },
    { id: 'clg_nat_7', name: 'Manipal Institute of Technology (MAHE)', city: 'Manipal', state: 'Karnataka', latitude: 13.3525, longitude: 74.7928, tuition_min: 350000, tuition_max: 490000, type: 'Private', accreditation: 'NAAC A++', ranking: 17, hostel_available: true, programs_offered: ['B.Tech CSE', 'Cybersecurity', 'Data Science'], website: 'https://manipal.edu' }
  ],
  mentor_sessions: [],
  job_market_data: [
    { id: 'jm_1', career_path: 'AI & Machine Learning Engineer', demand_trend: 'Explosive', growth_percentage: 34.5, salary_min: 800000, salary_max: 2800000, top_skills: ['Python', 'PyTorch/TensorFlow', 'Deep Learning', 'MLOps', 'Linear Algebra'], key_industries: ['Tech (Blr)', 'Fintech', 'Healthcare', 'Automotive'] },
    { id: 'jm_2', career_path: 'Full-Stack Software Developer', demand_trend: 'Very High', growth_percentage: 22.0, salary_min: 600000, salary_max: 2200000, top_skills: ['React/Next.js', 'Node.js', 'PostgreSQL/Supabase', 'System Design', 'TypeScript'], key_industries: ['SaaS (Blr/Che)', 'E-commerce', 'Enterprise'] },
    { id: 'jm_3', career_path: 'Corporate & IPR Lawyer', demand_trend: 'High', growth_percentage: 16.5, salary_min: 700000, salary_max: 2500000, top_skills: ['Contract Law', 'Corporate Governance', 'M&A Drafting', 'Negotiation', 'IP Regulation'], key_industries: ['Law Firms (Blr)', 'Corporate Legal', 'Consulting'] },
    { id: 'jm_4', career_path: 'Data Scientist & Analyst', demand_trend: 'Explosive', growth_percentage: 28.0, salary_min: 650000, salary_max: 2400000, top_skills: ['SQL', 'Python/R', 'Statistical Modeling', 'PowerBI/Tableau', 'Machine Learning'], key_industries: ['Finance (Blr)', 'Retail', 'Healthcare', 'Analytics'] },
    { id: 'jm_5', career_path: 'Product Manager', demand_trend: 'High', growth_percentage: 19.2, salary_min: 900000, salary_max: 3200000, top_skills: ['User Research', 'Agile/Scrum', 'Data Analytics', 'Product Strategy', 'UX Wireframing'], key_industries: ['Technology', 'Fintech', 'Consumer Internet'] }
  ]
};

module.exports = {
  supabase,
  isMock,
  mockDB
};
