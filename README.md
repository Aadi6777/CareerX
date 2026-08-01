# 🎓 CareerX — AI-Driven Career Counseling Platform

> **Transforming student academic uncertainty into personalized, data-backed decisions powered by Gemini AI, Supabase, and React.**

---

## 🌟 Overview

Every year, millions of high school and college students face uncertainty regarding stream selection, entrance exam preparation, target career paths, and college selection. **CareerX** is an end-to-end, scalable AI advisory ecosystem built to act as a continuous companion throughout a student's academic journey.

---

## 🔥 Core Features & Modules

- 🧠 **AI Psychometric Assessment Engine**: 4-part diagnostic evaluating Quantitative Aptitude, Holland RIASEC Interest Inventory, Big Five Personality Traits, and Work Values synthesized into plain-language reports via Gemini 1.5 API.
- 📊 **Skill-Gap Radar Analytics**: Interactive **Chart.js Radar & Bar chart** visualizations comparing student abilities against benchmark requirements for target careers.
- 🗺️ **Personalized Learning Roadmap**: Time-bound, month-by-month milestone timeline with interactive completion checkmarks, progress ring, and resource links.
- 📚 **Entrance Exam Guide & Tracker**: Comprehensive filterable database for **JEE Main/Adv, NEET, CLAT, CUET, IPMAT, SAT**, eligibility rules, prep lead times, and official NTA links.
- 📍 **College Geo-Discovery**: Interactive **Leaflet Map** with distance radius sliders (50km–1500km), tuition budget filters, government/private badges, and NAAC accreditation tags.
- 🤖 **24/7 AI Mentor Chatbot**: Context-aware persistent chat powered by Gemini API with **Safety Crisis Escalation** for mental health distress queries (Tele-MANAS: 14416).
- 💰 **Job Market Trends & Education Budget Planner**: Real-time salary scales, YoY growth trends, 4-year tuition simulator, loan EMI calculator, and payback period forecasting.
- 👨‍👩‍👧 **Multi-Role Access**: Linked view-only Parent Dashboard and Admin database management panel.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Chart.js (`react-chartjs-2`), Leaflet (`react-leaflet`) |
| **Backend** | Node.js, Express.js (Vercel Serverless ready) |
| **Database** | **Supabase (PostgreSQL)** + Built-in Mock Fallback Engine |
| **AI / Intelligence** | **Google Gemini 1.5 / 2.5 API** + Built-in Fallback Generator |
| **Auth** | JWT Token Auth + Supabase / Demo Auth pre-fills |
| **Deployment** | **Vercel** Monorepo (Frontend + Express API Serverless Functions in `vercel.json`) |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies for root, server, and client:

```bash
cd /Users/aadipranav.s/CareerX
npm run install:all
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

> **Note:** CareerX includes an intelligent mock fallback engine. If `SUPABASE_URL` or `GEMINI_API_KEY` are not set, the platform will automatically run in Mock Mode out of the box!

### 4. Run Locally
Launch the Express backend server and Vite React frontend concurrently:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:3000`
- **Express Backend API**: `http://localhost:5001`

---

## 🧪 Automated API Test Suite

To verify all 10 Express API endpoints locally, run:

```bash
npm test
```

Sample output:
```text
✅ Health Check: PASSED
✅ Auth Login Test: PASSED
✅ Assessment Questions API: PASSED
✅ Entrance Exams API: PASSED
✅ Colleges Geo Search API: PASSED
✅ AI Mentor Chat API: PASSED
✅ Education Budget API: PASSED

🎉 ALL BACKEND API ENDPOINTS TESTED SUCCESSFULLY!
```

---

## ⚡ Deployment to Vercel & Supabase

### Supabase Setup
1. Create a project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase dashboard.
3. Paste and run the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).

### Vercel Deployment
1. Push this repository to GitHub/GitLab.
2. Import the project in [Vercel.com](https://vercel.com).
3. Vercel automatically detects [`vercel.json`](./vercel.json).
4. Configure Environment Variables in Vercel settings:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   - `GEMINI_API_KEY` = `your-google-gemini-api-key`
   - `JWT_SECRET` = `careerx_super_secret_jwt_key_2026`
5. Deploy! Both the frontend static app and backend `/api/*` serverless functions deploy together.

---

## 📄 License
This project is licensed under the MIT License.
