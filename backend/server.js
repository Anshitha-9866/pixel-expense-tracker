const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const statsRoutes = require("./routes/statsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "💖 Pixel Tracker API is alive!" }));

// ── Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ── DB + Listen ────────────────────────────────────────────
const PORT = process.env.PORT || 5055;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/pixel-expense-tracker")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🌸 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
