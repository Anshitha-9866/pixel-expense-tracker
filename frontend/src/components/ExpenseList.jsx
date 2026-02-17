import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseItem from "./ExpenseItem";
import PixelLoader from "./PixelLoader";
import AddExpense from "./AddExpense";
import { CATEGORIES, CATEGORY_EMOJIS, formatAmount, currentMonth } from "../utils/categories";

export default function ExpenseList({ onRefreshTotal }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    month: currentMonth(),
    search: "",
    sortBy: "date",
    order: "desc",
  });

  const { expenses, loading, error, addExpense, removeExpense, updateExpense } = useExpenses(filters);

  const setFilter = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));

  const totalFiltered = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  // Wrap callbacks to also refresh the header total
  const handleAdd = (exp) => {
    addExpense(exp);
    setShowAdd(false);
    onRefreshTotal?.();
  };

  const handleDelete = (id) => {
    removeExpense(id);
    onRefreshTotal?.();
  };

  const handleUpdate = (updated) => {
    updateExpense(updated);
    onRefreshTotal?.();
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "13px",
          color: "var(--pink-600)",
          letterSpacing: "0.5px",
        }}>
          💸 Expenses
        </h1>
        <button className="pixel-btn" onClick={() => setShowAdd((v) => !v)} style={{ fontSize: 8 }}>
          {showAdd ? "✖ Close" : "➕ Add New"}
        </button>
      </div>

      {/* Add Expense form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 20, overflow: "hidden" }}
          >
            <AddExpense onAdd={handleAdd} onClose={() => setShowAdd(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters bar */}
      <div className="pixel-card" style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 160px" }}>
            <label style={labelStyle}>🔍 Search</label>
            <input
              className="pixel-input"
              placeholder="Search expenses..."
              value={filters.search}
              onChange={setFilter("search")}
            />
          </div>

          <div style={{ flex: "0 1 140px" }}>
            <label style={labelStyle}>📅 Month</label>
            <input
              className="pixel-input"
              type="month"
              value={filters.month}
              onChange={setFilter("month")}
            />
          </div>

          <div style={{ flex: "0 1 160px" }}>
            <label style={labelStyle}>🗂️ Category</label>
            <select
              className="pixel-select"
              style={{ width: "100%" }}
              value={filters.category}
              onChange={setFilter("category")}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "0 1 120px" }}>
            <label style={labelStyle}>↕️ Sort by</label>
            <select
              className="pixel-select"
              style={{ width: "100%" }}
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split("-");
                setFilters((f) => ({ ...f, sortBy, order }));
              }}
            >
              <option value="date-desc">Date ↓</option>
              <option value="date-asc">Date ↑</option>
              <option value="amount-desc">Amount ↓</option>
              <option value="amount-asc">Amount ↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        padding: "8px 4px",
      }}>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--gray-400)" }}>
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
        </span>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "var(--pink-600)" }}>
          Total: {formatAmount(totalFiltered)}
        </span>
      </div>

      {error && <div className="pixel-alert error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <PixelLoader />
      ) : expenses.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence>
          {expenses.map((exp) => (
            <ExpenseItem
              key={exp._id}
              expense={exp}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: "center", padding: "48px 24px" }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
      <p style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", color: "var(--gray-400)", lineHeight: 2 }}>
        No expenses found!<br />
        <span style={{ color: "var(--pink-400)" }}>Add your first one ✨</span>
      </p>
    </motion.div>
  );
}

const labelStyle = {
  fontFamily: "var(--font-pixel)",
  fontSize: "7px",
  display: "block",
  marginBottom: "5px",
  color: "var(--gray-400)",
};