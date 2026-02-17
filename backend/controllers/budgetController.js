const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// ── GET all budgets for a month + spent amounts
const getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query; // YYYY-MM

    const budgets = await Budget.find(month ? { month } : {}).sort({ category: 1 });

    if (!month) return res.json(budgets);

    // Aggregate how much has been spent per category this month
    const expenses = await Expense.find({ date: { $regex: `^${month}` } });

    const spentMap = {};
    expenses.forEach((e) => {
      spentMap[e.category] = (spentMap[e.category] || 0) + e.amount;
    });

    const result = budgets.map((b) => ({
      ...b.toObject(),
      spent: spentMap[b.category] || 0,
      remaining: b.limit - (spentMap[b.category] || 0),
      percentage: Math.min(100, Math.round(((spentMap[b.category] || 0) / b.limit) * 100)),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ── SET budget (upsert)
const setBudget = async (req, res, next) => {
  try {
    const { category, month, limit } = req.body;

    if (!category || !month || !limit) {
      return res.status(400).json({ error: "category, month and limit are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { limit },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(budget);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(err);
  }
};

// ── DELETE budget
const deleteBudget = async (req, res, next) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBudgets, setBudget, deleteBudget };
