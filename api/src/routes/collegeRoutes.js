const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { filterCollegesByLocationAndBudget } = require('../services/geoService');

router.get('/nearby', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 19.0760;
    const lng = req.query.lng ? parseFloat(req.query.lng) : 72.8777;
    const maxDistanceKm = req.query.radiusKm ? parseFloat(req.query.radiusKm) : null;
    const maxBudget = req.query.budget ? parseFloat(req.query.budget) : null;
    const typeFilter = req.query.type || 'All';

    let allColleges = [];
    if (!isMock && supabase) {
      const { data } = await supabase.from('colleges').select('*');
      allColleges = data || [];
    } else {
      allColleges = mockDB.colleges;
    }

    const filtered = filterCollegesByLocationAndBudget(allColleges, { userLat: lat, userLng: lng, maxDistanceKm, maxBudget, typeFilter });
    res.json({ userLocation: { lat, lng }, count: filtered.length, colleges: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase();
    let allColleges = [];

    if (!isMock && supabase) {
      const { data } = await supabase.from('colleges').select('*');
      allColleges = data || [];
    } else {
      allColleges = mockDB.colleges;
    }

    const results = allColleges.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.state.toLowerCase().includes(query) ||
      (Array.isArray(c.programs_offered) && c.programs_offered.some(p => p.toLowerCase().includes(query)))
    );

    res.json({ count: results.length, colleges: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
