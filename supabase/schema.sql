-- ========================================================
-- CareerX Supabase Database Schema & Initial Seed Script
-- Focused on Tamil Nadu & Bangalore (Bengaluru) Regions
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'admin')),
  grade TEXT,
  location TEXT,
  budget_range JSONB DEFAULT '{"min": 50000, "max": 500000}'::jsonb,
  career_uncertainty INT DEFAULT 3,
  linked_student_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ASSESSMENT RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  aptitude_scores JSONB NOT NULL,
  interest_profile JSONB NOT NULL,
  personality_traits JSONB NOT NULL,
  work_values JSONB NOT NULL,
  gemini_interpretation TEXT NOT NULL,
  recommended_careers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SKILL GAPS TABLE
CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  current_skills JSONB NOT NULL,
  required_skills JSONB NOT NULL,
  gap_score NUMERIC(5,2) NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_career TEXT NOT NULL,
  milestones JSONB NOT NULL,
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. EXAM RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.exam_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_name TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  preparation_months INT NOT NULL,
  description TEXT NOT NULL,
  official_url TEXT,
  relevance_score NUMERIC(5,2) DEFAULT 90.0
);

-- 6. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude NUMERIC(10,6) NOT NULL,
  longitude NUMERIC(10,6) NOT NULL,
  tuition_min NUMERIC(12,2) NOT NULL,
  tuition_max NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Government', 'Private', 'Deemed')),
  accreditation TEXT NOT NULL,
  ranking INT NOT NULL,
  hostel_available BOOLEAN DEFAULT true,
  programs_offered JSONB NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. MENTOR SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.mentor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context_summary TEXT,
  escalation_flagged BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. JOB MARKET DATA TABLE
CREATE TABLE IF NOT EXISTS public.job_market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_path TEXT UNIQUE NOT NULL,
  demand_trend TEXT NOT NULL,
  growth_percentage NUMERIC(5,2) NOT NULL,
  salary_min NUMERIC(12,2) NOT NULL,
  salary_max NUMERIC(12,2) NOT NULL,
  top_skills JSONB NOT NULL,
  key_industries JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public access assessment_results" ON public.assessment_results FOR ALL USING (true);
CREATE POLICY "Allow public access skill_gaps" ON public.skill_gaps FOR ALL USING (true);
CREATE POLICY "Allow public access roadmaps" ON public.roadmaps FOR ALL USING (true);
CREATE POLICY "Allow public access exam_recommendations" ON public.exam_recommendations FOR ALL USING (true);
CREATE POLICY "Allow public access colleges" ON public.colleges FOR ALL USING (true);
CREATE POLICY "Allow public access mentor_sessions" ON public.mentor_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access job_market_data" ON public.job_market_data FOR ALL USING (true);

-- ========================================================
-- SEED DATA (TAMIL NADU & BANGALORE COLLEGES + EXAMS)
-- ========================================================

INSERT INTO public.colleges (name, city, state, latitude, longitude, tuition_min, tuition_max, type, accreditation, ranking, hostel_available, programs_offered, website)
VALUES
-- BANGALORE (BENGALURU)
('Indian Institute of Science (IISc)', 'Bengaluru', 'Karnataka', 13.0184, 77.5670, 30000, 80000, 'Government', 'NIRF #1 Overall', 1, true, '["BS Research", "Data Science", "Computer Science", "Physics", "Materials Engineering"]'::jsonb, 'https://iisc.ac.in'),
('RV College of Engineering (RVCE)', 'Bengaluru', 'Karnataka', 12.9237, 77.4987, 220000, 380000, 'Private', 'NAAC A+', 6, true, '["Computer Science & Engineering", "AI & Machine Learning", "Electronics & Comm", "Biotechnology"]'::jsonb, 'https://rvce.edu.in'),
('BMS College of Engineering (BMSCE)', 'Bengaluru', 'Karnataka', 12.9410, 77.5655, 180000, 320000, 'Private', 'NAAC A++', 8, true, '["Computer Science", "Information Science", "Electrical Engineering", "Civil Engineering"]'::jsonb, 'https://bmsce.ac.in'),
('Ramaiah Institute of Technology (MSRIT)', 'Bengaluru', 'Karnataka', 13.0311, 77.5647, 200000, 350000, 'Private', 'NAAC A+', 12, true, '["Computer Science", "Cyber Security", "Robotics & Automation", "Medical Electronics"]'::jsonb, 'https://msrit.edu'),
('National Law School of India University (NLSIU)', 'Bengaluru', 'Karnataka', 12.9716, 77.5946, 300000, 380000, 'Government', 'NIRF #1 Law', 1, true, '["BA LLB (Hons)", "LLM", "Public Policy", "IPR Law"]'::jsonb, 'https://nls.ac.in'),
('International Institute of Information Technology (IIIT-B)', 'Bengaluru', 'Karnataka', 12.8448, 77.6632, 360000, 480000, 'Private', 'NAAC A+', 15, true, '["iMTech CS", "Data Science", "Software Engineering", "AI & Robotics"]'::jsonb, 'https://iiitb.ac.in'),
('PES University (Ring Road Campus)', 'Bengaluru', 'Karnataka', 12.9344, 77.5345, 320000, 450000, 'Private', 'NAAC A+', 19, true, '["B.Tech CSE", "AI & Data Science", "BBA", "B.Des"]'::jsonb, 'https://pes.edu'),
('Christ University (Main Campus)', 'Bengaluru', 'Karnataka', 12.9343, 77.6060, 120000, 250000, 'Private', 'NAAC A+', 22, true, '["BCA", "BBA Finance", "BSc Psychology", "BA Economics"]'::jsonb, 'https://christuniversity.in'),
('St. John''s Medical College', 'Bengaluru', 'Karnataka', 12.9322, 77.6225, 450000, 650000, 'Private', 'NAAC A++', 14, true, '["MBBS", "BSc Nursing", "Allied Health Sciences"]'::jsonb, 'https://stjohns.in'),
('Mount Carmel College', 'Bengaluru', 'Karnataka', 12.9904, 77.5888, 60000, 150000, 'Private', 'NAAC A++', 25, true, '["BSc Computer Science", "BBA", "BCom Finance", "BA Journalism"]'::jsonb, 'https://mccblr.edu.in'),

-- TAMIL NADU
('Indian Institute of Technology (IIT) Madras', 'Chennai', 'Tamil Nadu', 12.9915, 80.2337, 200000, 260000, 'Government', 'NIRF #1 Engineering', 1, true, '["Computer Science", "Data Science & AI", "Electrical Engineering", "Aerospace"]'::jsonb, 'https://iitm.ac.in'),
('National Institute of Technology (NIT) Trichy', 'Tiruchirappalli', 'Tamil Nadu', 10.7600, 78.8147, 140000, 190000, 'Government', 'NAAC A++', 9, true, '["Computer Science", "Electronics & Comm", "Mechanical", "Metallurgy"]'::jsonb, 'https://nitt.edu'),
('College of Engineering, Guindy (Anna University)', 'Chennai', 'Tamil Nadu', 13.0102, 80.2354, 40000, 90000, 'Government', 'NAAC A++', 13, true, '["Computer Science", "Information Technology", "Geo-Informatics", "Printing Tech"]'::jsonb, 'https://annauniv.edu'),
('Vellore Institute of Technology (VIT)', 'Vellore', 'Tamil Nadu', 12.9692, 79.1559, 280000, 420000, 'Private', 'NAAC A++', 11, true, '["B.Tech CSE", "AI & Machine Learning", "Bioinformatics", "ECE"]'::jsonb, 'https://vit.ac.in'),
('PSG College of Technology', 'Coimbatore', 'Tamil Nadu', 11.0247, 77.0027, 120000, 220000, 'Private', 'NAAC A++', 16, true, '["Computer Science", "Robotics & Automation", "Textile Tech", "Production Eng"]'::jsonb, 'https://psgtech.edu'),
('SRM Institute of Science and Technology', 'Chennai', 'Tamil Nadu', 12.8231, 80.0442, 250000, 400000, 'Private', 'NAAC A++', 18, true, '["B.Tech CS", "Artificial Intelligence", "Bioinformatics", "BBA"]'::jsonb, 'https://srmist.edu.in'),
('SSN College of Engineering', 'Chennai', 'Tamil Nadu', 12.7509, 80.1973, 150000, 260000, 'Private', 'NAAC A++', 24, true, '["Computer Science", "IT", "Electrical & Electronics", "Biomedical"]'::jsonb, 'https://ssn.edu.in'),
('Christian Medical College (CMC)', 'Vellore', 'Tamil Nadu', 12.9250, 79.1333, 50000, 120000, 'Private', 'NIRF #3 Medical', 3, true, '["MBBS", "BSc Nursing", "Occupational Therapy"]'::jsonb, 'https://cmch-vellore.edu'),
('Amrita Vishwa Vidyapeetham', 'Coimbatore', 'Tamil Nadu', 10.9004, 76.9026, 260000, 380000, 'Private', 'NAAC A++', 7, true, '["Computer Science", "Cyber Security", "Data Science", "Chemical"]'::jsonb, 'https://amrita.edu'),
('Madras Christian College (MCC)', 'Chennai', 'Tamil Nadu', 12.9224, 80.1213, 35000, 85000, 'Private', 'NAAC A+', 27, true, '["BSc Computer Science", "BBA", "BCom", "BA English"]'::jsonb, 'https://mcc.edu.in')
ON CONFLICT DO NOTHING;

INSERT INTO public.exam_recommendations (exam_name, category, eligibility, exam_date, preparation_months, description, official_url, relevance_score)
VALUES
('KCET / COMEDK', 'Engineering (Karnataka)', '10+2 with Physics, Chemistry, Math', 'May 2027', 10, 'Karnataka state & private engineering entrance test for RVCE, BMSCE, MSRIT, PES.', 'https://comedk.org', 95),
('TNEA / TNCET', 'Engineering (Tamil Nadu)', '10+2 with Physics, Chemistry, Math', 'June 2027', 8, 'Tamil Nadu Engineering Admissions counseling for Anna Univ, PSG Tech, SSN.', 'https://tneaonline.org', 94),
('JEE Advanced / Main', 'Engineering', '10+2 with Physics, Chemistry, Math', 'April 2027', 12, 'National entrance for premier IITs (IIT Madras) & NITs (NIT Trichy).', 'https://jeemain.nta.ac.in', 96),
('NEET UG', 'Medical', '10+2 with Biology, Physics, Chemistry', 'May 2027', 12, 'Single national entrance exam for MBBS at CMC Vellore, St. Johns, AIIMS.', 'https://neet.nta.nic.in', 94),
('CLAT', 'Law', '10+2 in any stream with min 45%', 'December 2026', 8, 'Common Law Admission Test for NLSIU Bengaluru and top National Law Universities.', 'https://consortiumofnlus.ac.in', 90),
('VITEEE / SRMJEEE', 'Private Engineering', '10+2 with min 60% PCM', 'April 2027', 8, 'University entrance for VIT Vellore and SRM Institute Kattankulathur.', 'https://vit.ac.in', 91)
ON CONFLICT DO NOTHING;

INSERT INTO public.job_market_data (career_path, demand_trend, growth_percentage, salary_min, salary_max, top_skills, key_industries)
VALUES
('AI & Machine Learning Engineer', 'Explosive', 34.5, 800000, 2800000, '["Python", "PyTorch/TensorFlow", "Deep Learning", "MLOps", "Linear Algebra"]'::jsonb, '["Tech (Blr)", "Fintech", "Healthcare", "Automotive"]'::jsonb),
('Full-Stack Software Developer', 'Very High', 22.0, 600000, 2200000, '["React/Next.js", "Node.js", "PostgreSQL/Supabase", "System Design", "TypeScript"]'::jsonb, '["SaaS (Blr/Che)", "E-commerce", "Enterprise"]'::jsonb),
('Corporate & IPR Lawyer', 'High', 16.5, 700000, 2500000, '["Contract Law", "Corporate Governance", "M&A Drafting", "Negotiation", "IP Regulation"]'::jsonb, '["Law Firms (Blr)", "Corporate Legal", "Consulting"]'::jsonb),
('Data Scientist & Analyst', 'Explosive', 28.0, 650000, 2400000, '["SQL", "Python/R", "Statistical Modeling", "PowerBI/Tableau", "Machine Learning"]'::jsonb, '["Finance (Blr)", "Retail", "Healthcare", "Analytics"]'::jsonb),
('Product Manager', 'High', 19.2, 900000, 3200000, '["User Research", "Agile/Scrum", "Data Analytics", "Product Strategy", "UX Wireframing"]'::jsonb, '["Technology", "Fintech", "Consumer Internet"]'::jsonb)
ON CONFLICT (career_path) DO NOTHING;
