const jwt = require('jsonwebtoken');
const { supabase, isMock, mockDB } = require('../config/supabase');
const JWT_SECRET = process.env.JWT_SECRET || 'careerx_super_secret_jwt_key_2026';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = mockDB.users[0];
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = mockDB.users[0];
    next();
  }
}

module.exports = { authenticateToken };
