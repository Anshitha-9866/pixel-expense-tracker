import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_BG, CATEGORIES, formatAmount } from "../utils/categories";
import api from "../api";

export default function ExpenseItem({ expense, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    note: expense.note || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const color = CATEGORY_COLORS[expense.category] || "#94a3b8";
  const bg = CATEGORY_BG[expense.category] || "#f8fafc";

  const handleDelete = async () => {
    if (!window.confirm("Delete this expense? 🗑️")) return;
    setLoading(true);
    try {
      await api.delete(`/expenses/${expense._id}`);
      onDelete(expense._id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.amount || !form.date) {
      setError("All fields required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.put(`/expenses/${expense._id}`, {
        ...form,
        amount: Number(form.amount),
      });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      style={{
        border: "var(--border)",
        background: bg,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      {/* Category stripe */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: "12px 14px" }}>
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {error && <div className="pixel-alert error" style={{ fontSize: 7 }}>{error}</div>}
              <input className="pixel-input" value={form.title} onChange={set("title")} placeholder="Title" />
              <div style={{ display: "flex", gap: 8 }}>
                <input className="pixel-input" type="number" value={form.amount} onChange={set("amount")} placeholder="Amount" style={{ flex: 1 }} />
                <input className="pixel-input" type="date" value={form.date} onChange={set("date")} style={{ flex: 1 }} />
              </div>
              <select className="pixel-select" value={form.category} onChange={set("category")} style={{ width: "100%" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
              </select>
              <input className="pixel-input" value={form.note} onChange={set("note")} placeholder="Note (optional)" />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="pixel-btn success" onClick={handleSave} disabled={loading} style={{ fontSize: 8, padding: "8px 12px" }}>
                  {loading ? "..." : "✅ Save"}
                </button>
                <button className="pixel-btn secondary" onClick={() => { setEditing(false); setError(""); }} style={{ fontSize: 8, padding: "8px 12px" }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{CATEGORY_EMOJIS[expense.category]}</span>
                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "9px",
                      color: "var(--black)",
                      letterSpacing: "0.3px",
                    }}>
                      {expense.title}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "11px",
                      color: color,
                      fontWeight: "bold",
                    }}>
                      {formatAmount(expense.amount)}
                    </span>

                    <span
                      className="pixel-tag"
                      style={{ background: color + "22", borderColor: color, color: color, fontSize: 7 }}
                    >
                      {expense.category}
                    </span>

                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "7px",
                      color: "var(--gray-400)",
                    }}>
                      📅 {expense.date}
                    </span>
                  </div>

                  {expense.note && (
                    <p style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "7px",
                      color: "var(--gray-400)",
                      marginTop: 6,
                      fontStyle: "italic",
                    }}>
                      📌 {expense.note}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
                  <button
                    className="pixel-btn secondary"
                    onClick={() => setEditing(true)}
                    style={{ fontSize: 8, padding: "6px 10px" }}
                  >
                    ✏️
                  </button>
                  <button
                    className="pixel-btn danger"
                    onClick={handleDelete}
                    disabled={loading}
                    style={{ fontSize: 8, padding: "6px 10px" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
