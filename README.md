# 🎓 CareerX — AI-Powered Student Guidance & Counseling Companion

> Helping high school and college students navigate academic choices, discover their natural strengths, build real-world skills, and plan for their future with confidence.

---

## 🌟 Why CareerX Exists

Every year, millions of students finish school feeling uncertain about what step to take next. Traditional career counseling is often expensive, generic, or out of reach, leaving students and parents overwhelmed by endless choices, conflicting advice, and hidden costs.

**CareerX** was built to change that. It’s an intelligent, unbiased, and continuous companion designed to guide students from grade 9 all the way through university admissions.

---

## 🚀 Key Features

- 🧠 **AI Psychometric Diagnostic**: A comprehensive assessment evaluating logical aptitude, Holland RIASEC interest profiles, Big Five personality traits, and personal values — producing plain-language insights powered by Google Gemini.
- 📊 **Skill-Gap Analytics**: Interactive radar and bar charts comparing a student's current proficiency against benchmark requirements for target careers.
- 🗺️ **Personalized Learning Roadmaps**: Time-bound, step-by-step monthly milestones complete with curated learning resources and progress tracking.
- 📚 **Entrance Exam Tracker**: A structured guide covering major competitive exams (JEE, NEET, CLAT, CUET, IPMAT, SAT) with timelines, eligibility criteria, and preparation lead times.
- 📍 **College Geo-Discovery**: Interactive Leaflet maps matching nearby colleges based on distance radius, tuition budgets, and NAAC accreditation.
- 🤖 **24/7 AI Career Mentor**: A persistent conversational assistant that understands your profile, goals, and progress — with built-in safety guardrails and direct helpline links for mental wellness support.
- 💰 **Job Market & Budget Calculator**: Real-world salary scales, industry growth trends, tuition & living cost estimation, monthly loan EMI calculations, and payback period forecasting.
- 👨‍👩‍👧 **Parent & Admin Views**: Dedicated view-only dashboards for parents to follow progress, alongside content management tools for administrators.

---

## 🛠️ Built With

- **Frontend**: React 18, Vite, Tailwind CSS, Chart.js, Leaflet Maps, Lucide Icons
- **Backend**: Node.js, Express.js (configured for Vercel Serverless Functions)
- **Database**: Supabase (PostgreSQL) + built-in offline mock store
- **AI Engine**: Google Gemini 2.5 API + intelligent fallback generator

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Aadi6777/CareerX.git
cd CareerX
npm run install:all
```

### 2. Run Locally
```bash
npm run dev
```
- **Frontend App**: http://localhost:3000
- **API Backend**: http://localhost:5001

### 3. Run Automated Tests
```bash
npm test
```

---

## ☁️ Deployment

### Vercel (Frontend & Serverless API)
1. Import this repository in [Vercel](https://vercel.com).
2. Set environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `SUPABASE_URL` (optional)
   - `SUPABASE_ANON_KEY` (optional)
3. Deploy! Both the React app and serverless API endpoints will deploy together.

### Supabase Database Setup (Optional)
Run the script in [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase SQL Editor to initialize all tables, RLS policies, and seed data.

---

## 🤝 License

Distributed under the MIT License.
