const express = require('express');
const router = express.Router();

// POST /api/budget/estimate
router.post('/estimate', (req, res) => {
  try {
    const { annualTuition = 200000, hostelLivingPerYear = 100000, durationYears = 4, familySavings = 300000, monthlyContribution = 15000, projectedStartingSalary = 900000 } = req.body;

    const totalTuitionCost = annualTuition * durationYears;
    const totalLivingCost = hostelLivingPerYear * durationYears;
    const grossTotalCost = totalTuitionCost + totalLivingCost;

    const totalFamilyCapital = familySavings + (monthlyContribution * 12 * durationYears);
    const netFundingShortfall = Math.max(0, grossTotalCost - totalFamilyCapital);
    const isLoanRequired = netFundingShortfall > 0;

    // Estimate loan EMI for shortfall at 9.5% annual interest over 7 years
    let monthlyLoanEMI = 0;
    if (isLoanRequired) {
      const r = 0.095 / 12;
      const n = 7 * 12;
      monthlyLoanEMI = Math.round((netFundingShortfall * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    // Estimated payback period in years based on starting salary (assuming 25% salary allocated to education repayment)
    const annualRepaymentCapacity = projectedStartingSalary * 0.25;
    const paybackPeriodYears = grossTotalCost > 0 ? parseFloat((grossTotalCost / annualRepaymentCapacity).toFixed(1)) : 1.0;

    res.json({
      summary: {
        grossTotalCost,
        totalTuitionCost,
        totalLivingCost,
        totalFamilyCapital,
        netFundingShortfall,
        isLoanRequired,
        monthlyLoanEMI,
        paybackPeriodYears
      },
      yearlyBreakdown: Array.from({ length: durationYears }, (_, i) => ({
        year: `Year ${i + 1}`,
        tuition: annualTuition,
        living: hostelLivingPerYear,
        total: annualTuition + hostelLivingPerYear
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
