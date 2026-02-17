const express = require("express");
const router = express.Router();
const { getMonthlySummary, getDailyBreakdown, getTrend } = require("../controllers/statsController");

router.get("/monthly", getMonthlySummary);
router.get("/daily", getDailyBreakdown);
router.get("/trend", getTrend);

module.exports = router;
