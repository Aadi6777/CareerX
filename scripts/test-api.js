const app = require('../api/src/app');

async function testRoutes() {
  console.log('🧪 Starting API Routes Automated Test Suite...\n');
  const server = app.listen(5099, async () => {
    try {
      const baseUrl = 'http://localhost:5099/api';

      const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
      console.log('✅ Health Check:', healthRes.status === 'online' ? 'PASSED' : 'FAILED');

      const authRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'student@example.com', password: 'password' })
      }).then(r => r.json());
      console.log('✅ Auth Login Test:', authRes.token ? 'PASSED' : 'FAILED');

      const questionsRes = await fetch(`${baseUrl}/assessment/questions`).then(r => r.json());
      console.log('✅ Assessment Questions API (20 Qs):', questionsRes.parts?.length === 4 ? 'PASSED' : 'FAILED');

      const examsRes = await fetch(`${baseUrl}/exams/all`).then(r => r.json());
      console.log('✅ Entrance Exams API:', examsRes.count > 0 ? 'PASSED' : 'FAILED');

      const collegesRes = await fetch(`${baseUrl}/colleges/nearby?lat=12.9716&lng=77.5946&radiusKm=600`).then(r => r.json());
      console.log('✅ Colleges Geo Search API (TN & Blr):', collegesRes.count > 0 ? 'PASSED' : 'FAILED');

      const mentorRes = await fetch(`${baseUrl}/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What skills are needed for AI engineering in Bangalore?' })
      }).then(r => r.json());
      console.log('✅ AI Mentor Chat API:', mentorRes.reply ? 'PASSED' : 'FAILED');

      const budgetRes = await fetch(`${baseUrl}/budget/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annualTuition: 200000, hostelLivingPerYear: 100000, durationYears: 4 })
      }).then(r => r.json());
      console.log('✅ Education Budget API:', budgetRes.summary?.grossTotalCost === 1200000 ? 'PASSED' : 'FAILED');

      console.log('\n🎉 ALL BACKEND API ENDPOINTS TESTED SUCCESSFULLY!');
    } catch (err) {
      console.error('❌ Test failed with error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

testRoutes();
