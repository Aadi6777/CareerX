const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase, isMock, mockDB } = require('../config/supabase');
const { authenticateToken } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'careerx_super_secret_jwt_key_2026';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'student', grade, location, budgetRange, uncertainty } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = password ? await bcrypt.hash(password, salt) : null;
    const userId = `usr_${Date.now()}`;

    const newUser = {
      id: userId,
      email,
      name,
      role,
      grade: grade || 'Grade 11',
      location: location || 'Mumbai, MH',
      budget_range: budgetRange || { min: 50000, max: 400000 },
      career_uncertainty: uncertainty || 3,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };

    if (!isMock && supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          grade: newUser.grade,
          location: newUser.location,
          budget_range: newUser.budget_range,
          career_uncertainty: newUser.career_uncertainty,
          password_hash: newUser.password_hash
        }])
        .select()
        .single();

      if (error) throw error;
      newUser.id = data.id;
    } else {
      mockDB.users.push(newUser);
    }

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        grade: newUser.grade,
        location: newUser.location,
        budgetRange: newUser.budget_range,
        uncertainty: newUser.career_uncertainty
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    if (!isMock && supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', email).single();
      user = data;
    } else {
      user = mockDB.users.find(u => u.email === email);
    }

    if (!user) {
      // For demo convenience, return default user
      user = mockDB.users[0];
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        location: user.location,
        budgetRange: user.budget_range,
        uncertainty: user.career_uncertainty
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user = null;
    if (!isMock && supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', req.user.id).single();
      user = data;
    } else {
      user = mockDB.users.find(u => u.id === req.user.id) || mockDB.users[0];
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        location: user.location,
        budgetRange: user.budget_range,
        uncertainty: user.career_uncertainty
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/onboarding
router.patch('/onboarding', authenticateToken, async (req, res) => {
  try {
    const { grade, location, budgetRange, uncertainty } = req.body;
    const userId = req.user.id;

    if (!isMock && supabase) {
      await supabase
        .from('users')
        .update({
          grade,
          location,
          budget_range: budgetRange,
          career_uncertainty: uncertainty
        })
        .eq('id', userId);
    } else {
      const user = mockDB.users.find(u => u.id === userId) || mockDB.users[0];
      if (grade) user.grade = grade;
      if (location) user.location = location;
      if (budgetRange) user.budget_range = budgetRange;
      if (uncertainty) user.career_uncertainty = uncertainty;
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
