const Expense = require("../models/Expense");

// ── GET ALL  (with optional filters: ?category=Food&month=2025-06&search=coffee)
const getExpenses = async (req, res, next) => {
  try {
    const { category, month, search, sortBy = "date", order = "desc" } = req.query;

    const query = {};

    if (category && category !== "All") query.category = category;

    // Month filter: YYYY-MM  →  match date starting with "YYYY-MM"
    if (month) query.date = { $regex: `^${month}` };

    if (search) query.title = { $regex: search, $options: "i" };

    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = sortBy === "amount" ? "amount" : "date";

    const expenses = await Expense.find(query).sort({ [sortField]: sortOrder });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// ── GET BY ID
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// ── CREATE
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.create({ title, amount, category, date, note });
    res.status(201).json(expense);
  } catch (err) {
    // Mongoose validation errors → 400
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(err);
  }
};

// ── UPDATE
const updateExpense = async (req, res, next) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(err);
  }
};

// ── DELETE
const deleteExpense = async (req, res, next) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Deleted successfully", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// ── BULK DELETE (e.g. clear a month)
const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide an array of ids" });
    }
    const result = await Expense.deleteMany({ _id: { $in: ids } });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, bulkDelete };
