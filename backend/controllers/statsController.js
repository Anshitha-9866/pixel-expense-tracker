const Expense = require("../models/Expense");

// ── Monthly summary: total spent + by category
const getMonthlySummary = async (req, res, next) => {
  try {
    const { month } = req.query; // YYYY-MM, defaults to current month

    const targetMonth = month || new Date().toISOString().slice(0, 7);

    const expenses = await Expense.find({ date: { $regex: `^${targetMonth}` } });

    const total = expenses.reduce((s, e) => s + e.amount, 0);

    const byCategory = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    const chartData = Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));

    res.json({ month: targetMonth, total: Math.round(total * 100) / 100, byCategory, chartData });
  } catch (err) {
    next(err);
  }
};

// ── Daily breakdown for a month (used in calendar heatmap)
const getDailyBreakdown = async (req, res, next) => {
  try {
    const { month } = req.query;
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    const expenses = await Expense.find({ date: { $regex: `^${targetMonth}` } });

    const byDate = {};
    expenses.forEach((e) => {
      if (!byDate[e.date]) byDate[e.date] = { total: 0, count: 0 };
      byDate[e.date].total += e.amount;
      byDate[e.date].count += 1;
    });

    // Round totals
    Object.keys(byDate).forEach((d) => {
      byDate[d].total = Math.round(byDate[d].total * 100) / 100;
    });

    res.json({ month: targetMonth, byDate });
  } catch (err) {
    next(err);
  }
};

// ── Last 6 months trend
const getTrend = async (req, res, next) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const trend = await Promise.all(
      months.map(async (m) => {
        const expenses = await Expense.find({ date: { $regex: `^${m}` } });
        const total = expenses.reduce((s, e) => s + e.amount, 0);
        return { month: m, total: Math.round(total * 100) / 100 };
      })
    );

    res.json(trend);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMonthlySummary, getDailyBreakdown, getTrend };
