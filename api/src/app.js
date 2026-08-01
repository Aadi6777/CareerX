const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const examRoutes = require('./routes/examRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const jobMarketRoutes = require('./routes/jobMarketRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CareerX AI-Driven Career Counseling Platform',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/skillgap', skillGapRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/jobmarket', jobMarketRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;
