const express = require('express');
const router = express.Router();
const { supabase, isMock, mockDB } = require('../config/supabase');

router.get('/all', async (req, res) => {
  try {
    let data = [];
    if (!isMock && supabase) {
      const { data: dbData } = await supabase.from('job_market_data').select('*');
      data = dbData || [];
    } else {
      data = mockDB.job_market_data;
    }
    res.json({ count: data.length, jobMarket: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:careerPath', async (req, res) => {
  try {
    const careerPath = decodeURIComponent(req.params.careerPath);
    let item = null;
    if (!isMock && supabase) {
      const { data: dbData } = await supabase.from('job_market_data').select('*').ilike('career_path', `%${careerPath}%`).limit(1).single();
      item = dbData;
    } else {
      item = mockDB.job_market_data.find(j => j.career_path.toLowerCase().includes(careerPath.toLowerCase()));
    }
    if (!item) item = mockDB.job_market_data[0];
    res.json({ jobMarket: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
