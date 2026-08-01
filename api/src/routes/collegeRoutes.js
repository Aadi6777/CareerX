const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');
const { filterCollegesByLocationAndBudget } = require('../services/geoService');

router.get('/nearby', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 12.9716; // Default Bengaluru
    const lng = req.query.lng ? parseFloat(req.query.lng) : 77.5946;
    const maxDistanceKm = req.query.radiusKm ? parseFloat(req.query.radiusKm) : 3000;
    const maxBudget = req.query.budget ? parseFloat(req.query.budget) : null;
    const typeFilter = req.query.type || 'All';

    let allColleges = [...mockDB.colleges];
    if (!isMock && supabase) {
      try {
        const { data } = await supabase.from('colleges').select('*');
        if (data && data.length > 0) {
          const names = new Set(data.map(c => c.name));
          const newMockColleges = mockDB.colleges.filter(m => !names.has(m.name));
          allColleges = [...data, ...newMockColleges];
        }
      } catch (err) {
        console.warn('Supabase fetch fallback to mock colleges:', err);
      }
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
    let allColleges = [...mockDB.colleges];

    if (!isMock && supabase) {
      try {
        const { data } = await supabase.from('colleges').select('*');
        if (data && data.length > 0) {
          const names = new Set(data.map(c => c.name));
          const newMockColleges = mockDB.colleges.filter(m => !names.has(m.name));
          allColleges = [...data, ...newMockColleges];
        }
      } catch (err) {}
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
