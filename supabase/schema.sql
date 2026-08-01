-- ========================================================
-- CareerX Supabase Database Schema & Initial Seed Script
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
  category TEXT NOT NULL, -- e.g. Engineering, Medical, Law, Commerce, Management
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
  demand_trend TEXT NOT NULL, -- High, Very High, Explosive, Stable
  growth_percentage NUMERIC(5,2) NOT NULL,
  salary_min NUMERIC(12,2) NOT NULL,
  salary_max NUMERIC(12,2) NOT NULL,
  top_skills JSONB NOT NULL,
  key_industries JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_market_data ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for API operations
CREATE POLICY "Allow public access for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public access for assessment_results" ON public.assessment_results FOR ALL USING (true);
CREATE POLICY "Allow public access for skill_gaps" ON public.skill_gaps FOR ALL USING (true);
CREATE POLICY "Allow public access for roadmaps" ON public.roadmaps FOR ALL USING (true);
CREATE POLICY "Allow public access for exam_recommendations" ON public.exam_recommendations FOR ALL USING (true);
CREATE POLICY "Allow public access for colleges" ON public.colleges FOR ALL USING (true);
CREATE POLICY "Allow public access for mentor_sessions" ON public.mentor_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access for job_market_data" ON public.job_market_data FOR ALL USING (true);

-- ========================================================
-- SEED DATA (EXAMS, COLLEGES, JOB MARKET)
-- ========================================================

INSERT INTO public.exam_recommendations (exam_name, category, eligibility, exam_date, preparation_months, description, official_url, relevance_score)
VALUES
('JEE Advanced / Main', 'Engineering', '10+2 with Physics, Chemistry, Math', 'April 2027', 12, 'National entrance for premiere Indian Institutes of Technology (IITs) & NITs.', 'https://jeemain.nta.ac.in', 96),
('NEET UG', 'Medical', '10+2 with Biology, Physics, Chemistry', 'May 2027', 12, 'Single national entrance exam for MBBS, BDS, and allied medical streams.', 'https://neet.nta.nic.in', 94),
('CLAT', 'Law', '10+2 in any stream with min 45%', 'December 2026', 8, 'Common Law Admission Test for premier National Law Universities (NLUs).', 'https://consortiumofnlus.ac.in', 90),
('CUET UG', 'General Arts & Science', '10+2 in relevant subjects', 'May 2027', 6, 'Central Universities Entrance Test for DU, BHU, JNU undergraduate programs.', 'https://cuet.samarth.ac.in', 92),
('IPMAT', 'Management', '10+2 with min 60%', 'May 2027', 8, 'Integrated Program in Management Aptitude Test for 5-year BBA+MBA at IIM Indore / Rohtak.', 'https://iimidr.ac.in', 88),
('SAT Reasoning Test', 'Global / International', 'High school student (Grades 10-12)', 'Multiple Dates Yearly', 6, 'Standardized test for university admissions in the US, Canada, and global campuses.', 'https://satsuite.collegeboard.org', 89)
ON CONFLICT DO NOTHING;

INSERT INTO public.colleges (name, city, state, latitude, longitude, tuition_min, tuition_max, type, accreditation, ranking, hostel_available, programs_offered, website)
VALUES
('Indian Institute of Technology (IIT) Bombay', 'Mumbai', 'Maharashtra', 19.0760, 72.8777, 200000, 250000, 'Government', 'NAAC A++', 1, true, '["Computer Science", "Electrical Engineering", "Data Science & AI", "Mechanical Engineering"]'::jsonb, 'https://iitb.ac.in'),
('Birla Institute of Technology and Science (BITS)', 'Pilani', 'Rajasthan', 28.3639, 75.5869, 450000, 550000, 'Private', 'NAAC A++', 5, true, '["Computer Science", "Electronics", "Chemical Engineering", "Biotechnology"]'::jsonb, 'https://bits-pilani.ac.in'),
('National Law School of India University (NLSIU)', 'Bengaluru', 'Karnataka', 12.9716, 77.5946, 300000, 350000, 'Government', 'NAAC A++', 1, true, '["BA LLB (Hons)", "LLM", "Public Policy"]'::jsonb, 'https://nls.ac.in'),
('St. Xavier''s College', 'Mumbai', 'Maharashtra', 18.9438, 72.8315, 30000, 80000, 'Private', 'NAAC A+', 4, true, '["BSc Computer Science", "BBA", "Mass Media", "Economics"]'::jsonb, 'https://xaviers.edu'),
('All India Institute of Medical Sciences (AIIMS)', 'New Delhi', 'Delhi', 28.5672, 77.2100, 1500, 5000, 'Government', 'Institute of National Importance', 1, true, '["MBBS", "BSc Nursing", "Paramedical Science"]'::jsonb, 'https://aiims.edu'),
('SRM Institute of Science and Technology', 'Chennai', 'Tamil Nadu', 12.8231, 80.0442, 250000, 400000, 'Private', 'NAAC A++', 18, true, '["B.Tech CS", "Artificial Intelligence", "Bioinformatics", "BBA"]'::jsonb, 'https://srmist.edu.in')
ON CONFLICT DO NOTHING;

INSERT INTO public.job_market_data (career_path, demand_trend, growth_percentage, salary_min, salary_max, top_skills, key_industries)
VALUES
('AI & Machine Learning Engineer', 'Explosive', 34.5, 800000, 2800000, '["Python", "PyTorch/TensorFlow", "Deep Learning", "MLOps", "Linear Algebra"]'::jsonb, '["Tech", "Fintech", "Healthcare", "Automotive"]'::jsonb),
('Full-Stack Software Developer', 'Very High', 22.0, 600000, 2200000, '["React/Next.js", "Node.js", "PostgreSQL/Supabase", "System Design", "TypeScript"]'::jsonb, '["SaaS", "E-commerce", "Enterprise Software"]'::jsonb),
('Corporate & IPR Lawyer', 'High', 16.5, 700000, 2500000, '["Contract Law", "Corporate Governance", "M&A Drafting", "Negotiation", "IP Regulation"]'::jsonb, '["Law Firms", "Corporate Legal Departments", "Consulting"]'::jsonb),
('Data Scientist & Analyst', 'Explosive', 28.0, 650000, 2400000, '["SQL", "Python/R", "Statistical Modeling", "PowerBI/Tableau", "Machine Learning"]'::jsonb, '["Finance", "Retail", "Healthcare", "Consulting"]'::jsonb),
('Product Manager', 'High', 19.2, 900000, 3200000, '["User Research", "Agile/Scrum", "Data Analytics", "Product Strategy", "UX Wireframing"]'::jsonb, '["Technology", "Fintech", "Consumer Internet"]'::jsonb),
('Financial Analyst & Investment Banker', 'High', 15.0, 800000, 3000000, '["Financial Modeling", "Valuation", "Excel/VBA", "Equity Research", "Risk Analysis"]'::jsonb, '["Investment Banking", "Private Equity", "Hedge Funds"]'::jsonb)
ON CONFLICT (career_path) DO NOTHING;
