import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { CATEGORIES, CATEGORY_EMOJIS } from "../utils/categories";
import { sounds } from "../utils/sounds";

const INITIAL = { title: "", amount: "", category: "Food", date: "", note: "" };

export default function AddExpense({ onAdd, onClose, onCelebrate }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || !form.date) {
      setError("⚠️ Title, amount and date are required!");
      sounds.click();
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("⚠️ Amount must be greater than 0");
      sounds.click();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/expenses", {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        note: form.note.trim(),
      });

      // 🎉 SUCCESS CELEBRATION
      setSuccess(true);
      sounds.success();
      onCelebrate?.(); // Trigger celebration overlay in parent
      onAdd(res.data);

      setTimeout(() => {
        setForm(INITIAL);
        setSuccess(false);
        if (onClose) onClose();
      }, 800);
    } catch (err) {
      setError(err.message);
      sounds.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pixel-card"
      style={{ maxWidth: 440, width: "100%" }}
    >
      <h2 style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "11px",
        marginBottom: "20px",
        color: "var(--pink-600)",
        letterSpacing: "0.5px",
      }}>
        ➕ Add Expense
      </h2>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pixel-alert error"
            style={{ marginBottom: 16 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pixel-alert success"
            style={{ marginBottom: 16 }}
          >
            ✅ Expense added!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>📝 Title</label>
          <input
            className="pixel-input"
            placeholder="e.g. Lunch with friends"
            value={form.title}
            onChange={set("title")}
            maxLength={80}
            onClick={() => sounds.click()}
          />
        </div>

        {/* Amount + Date row */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>💰 Amount (₹)</label>
            <input
              className="pixel-input"
              type="number"
              placeholder="0"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={set("amount")}
              onClick={() => sounds.click()}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>📅 Date</label>
            <input
              className="pixel-input"
              type="date"
              value={form.date}
              onChange={set("date")}
              onClick={() => sounds.click()}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>🗂️ Category</label>
          <select
            className="pixel-select"
            style={{ width: "100%" }}
            value={form.category}
            onChange={set("category")}
            onClick={() => sounds.click()}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
            ))}
          </select>
        </div>

        {/* Note (optional) */}
        <div>
          <label style={labelStyle}>📌 Note (optional)</label>
          <input
            className="pixel-input"
            placeholder="Any extra details..."
            value={form.note}
            onChange={set("note")}
            maxLength={200}
            onClick={() => sounds.click()}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            type="submit"
            className="pixel-btn"
            disabled={loading}
            style={{ flex: 1 }}
            onClick={() => sounds.click()}
          >
            {loading ? "Saving..." : "✨ Add Expense"}
          </button>
          {onClose && (
            <button
              type="button"
              className="pixel-btn secondary"
              onClick={() => { sounds.click(); onClose(); }}
              style={{ flex: 0 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

const labelStyle = {
  fontFamily: "var(--font-pixel)",
  fontSize: "8px",
  display: "block",
  marginBottom: "6px",
  color: "var(--gray-400)",
  letterSpacing: "0.3px",
};