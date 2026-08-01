import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import ExamsPage from './pages/ExamsPage';
import CollegesPage from './pages/CollegesPage';
import MentorPage from './pages/MentorPage';
import JobMarketPage from './pages/JobMarketPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col justify-between relative bg-slate-950 text-slate-100 font-sans">
          <div>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/skill-gap" element={<SkillGapPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/colleges" element={<CollegesPage />} />
                <Route path="/mentor" element={<MentorPage />} />
                <Route path="/job-market" element={<JobMarketPage />} />
                <Route path="/parent" element={<ParentDashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          <Footer />
          <FloatingChatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
