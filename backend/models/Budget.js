const mongoose = require("mongoose");
const { CATEGORIES } = require("./Expense");

// One budget document per category per month (e.g. "Food-2025-06")
const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    // Format: "YYYY-MM"
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be YYYY-MM format"],
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [1, "Budget limit must be at least 1"],
    },
  },
  { timestamps: true }
);

// Unique constraint: one budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
