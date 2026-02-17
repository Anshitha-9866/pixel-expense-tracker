import { useState } from "react";
import { motion } from "framer-motion";
import { useBudgets } from "../hooks/useExpenses";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_BG, formatAmount, currentMonth } from "../utils/categories";
import PixelLoader from "./PixelLoader";
import api from "../api";

export default function BudgetManager() {
  const [month, setMonth] = useState(currentMonth());
  const { budgets, loading, refetch } = useBudgets(month);
  const [form, setForm] = useState({ category: "Food", limit: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!form.limit || Number(form.limit) < 1) {
      setError("Enter a valid limit amount");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/budgets", { category: form.category, month, limit: Number(form.limit) });
      setSuccess(`✅ Budget set for ${form.category}!`);
      setForm((f) => ({ ...f, limit: "" }));
      refetch();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "13px",
        color: "var(--pink-600)",
        marginBottom: "20px",
        letterSpacing: "0.5px",
      }}>
        🎯 Budgets
      </h1>

      {/* Month picker */}
      <div className="pixel-card" style={{ marginBottom: 20 }}>
        <label style={labelStyle}>📅 Managing budgets for</label>
        <input
          className="pixel-input"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ maxWidth: 200 }}
        />
      </div>

      {/* Set budget form */}
      <div className="pixel-card" style={{ marginBottom: 24, background: "var(--pink-50)" }}>
        <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", marginBottom: 14, color: "var(--pink-600)" }}>
          ✏️ Set a Budget
        </h2>

        {error && <div className="pixel-alert error" style={{ marginBottom: 12 }}>{error}</div>}
        {success && <div className="pixel-alert success" style={{ marginBottom: 12 }}>{success}</div>}

        <form onSubmit={handleSetBudget} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 160px" }}>
            <label style={labelStyle}>🗂️ Category</label>
            <select
              className="pixel-select"
              style={{ width: "100%" }}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1 1 140px" }}>
            <label style={labelStyle}>💰 Monthly Limit (₹)</label>
            <input
              className="pixel-input"
              type="number"
              placeholder="e.g. 5000"
              min="1"
              value={form.limit}
              onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
            />
          </div>

          <button className="pixel-btn" type="submit" disabled={saving} style={{ fontSize: 8, height: 38 }}>
            {saving ? "Saving..." : "Set Budget"}
          </button>
        </form>
      </div>

      {/* Budget list */}
      <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", marginBottom: 14, color: "var(--black)" }}>
        📋 Current Budgets
      </h2>

      {loading ? (
        <PixelLoader />
      ) : budgets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--gray-400)", lineHeight: 2 }}>
            No budgets set for this month.<br />Add one above!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {budgets.map((b, i) => {
            const color = CATEGORY_COLORS[b.category] || "#94a3b8";
            const bg = CATEGORY_BG[b.category] || "#f8fafc";
            const pct = b.percentage ?? 0;
            const progressClass = pct >= 90 ? "danger" : pct >= 70 ? "warning" : "";

            return (
              <motion.div
                key={b._id}
                className="pixel-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ background: bg, padding: 16 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{CATEGORY_EMOJIS[b.category]}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", marginBottom: 3 }}>
                        {b.category}
                      </div>
                      <div style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "var(--gray-400)" }}>
                        {formatAmount(b.spent ?? 0)} / {formatAmount(b.limit)} spent
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "10px",
                      color: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e",
                    }}>
                      {pct}%
                    </span>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: color }}>
                      {(b.remaining ?? b.limit) >= 0
                        ? `${formatAmount(b.remaining ?? b.limit)} left`
                        : `${formatAmount(Math.abs(b.remaining ?? 0))} over!`}
                    </span>
                    <button
                      className="pixel-btn danger"
                      onClick={() => handleDelete(b._id)}
                      style={{ fontSize: 7, padding: "5px 8px" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pixel-progress">
                  <div
                    className={`pixel-progress-fill ${progressClass}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                {pct >= 90 && (
                  <p style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "#ef4444", marginTop: 6, animation: "blink 1s step-start infinite" }}>
                    ⚠️ Budget almost exhausted!
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontFamily: "var(--font-pixel)",
  fontSize: "7px",
  display: "block",
  marginBottom: "5px",
  color: "var(--gray-400)",
};
