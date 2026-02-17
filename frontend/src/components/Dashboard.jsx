import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStats, useBudgets } from "../hooks/useExpenses";
import { CATEGORY_COLORS, CATEGORY_EMOJIS, formatAmount, currentMonth, getMonthLabel } from "../utils/categories";
import { PixelHeart } from "./PixelIcons";
import PixelLoader from "./PixelLoader";
import AddExpense from "./AddExpense";
import CelebrationOverlay from "./CelebrationOverlay";
import api from "../api";

export default function Dashboard({ onNavigate, onRefreshTotal }) {
  const month = currentMonth();
  const { stats, loading: statsLoading } = useStats(month);
  const { budgets, loading: budgetsLoading } = useBudgets(month);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    api.get(`/expenses?month=${month}&sortBy=date&order=desc`)
      .then((r) => setRecentExpenses(r.data.slice(0, 5)))
      .catch(() => {});
  }, [month]);

  const handleAdd = (exp) => {
    setRecentExpenses((prev) => [exp, ...prev].slice(0, 5));
    onRefreshTotal?.();
    setShowAdd(false);
  };

  const alerts = budgets.filter((b) => (b.percentage ?? 0) >= 80);

  return (
    <>
      <CelebrationOverlay show={showCelebration} onComplete={() => setShowCelebration(false)} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--pink-400)",
            border: "var(--border)",
            boxShadow: "var(--pixel-shadow)",
            padding: "20px 24px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "13px",
              color: "var(--white)",
              letterSpacing: "1px",
              marginBottom: 8,
              textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
            }}>
              💖 HI THERE!
            </div>
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--pink-100)" }}>
              {getMonthLabel(month)} Overview
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="animate-float"><PixelHeart color="#fff" size={20} /></div>
            <div className="animate-float" style={{ animationDelay: "0.4s" }}><PixelHeart color="#fce7f3" size={16} /></div>
            <div className="animate-float" style={{ animationDelay: "0.8s" }}><PixelHeart color="#fbcfe8" size={24} /></div>
          </div>
        </motion.div>

        <div style={{ marginBottom: 24 }}>
          {showAdd ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <AddExpense
                onAdd={handleAdd}
                onClose={() => setShowAdd(false)}
                onCelebrate={() => setShowCelebration(true)}
              />
            </motion.div>
          ) : (
            <button className="pixel-btn" onClick={() => setShowAdd(true)} style={{ width: "100%", fontSize: 9, padding: "14px" }}>
              ➕ Quick Add Expense
            </button>
          )}
        </div>

        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 20 }}>
            {alerts.map((b) => (
              <div key={b._id} style={{
                background: (b.percentage ?? 0) >= 100 ? "#fee2e2" : "#fffbeb",
                border: `2px solid ${(b.percentage ?? 0) >= 100 ? "#ef4444" : "#f59e0b"}`,
                padding: "10px 14px",
                marginBottom: 8,
                fontFamily: "var(--font-pixel)",
                fontSize: "8px",
                color: (b.percentage ?? 0) >= 100 ? "#b91c1c" : "#92400e",
              }}>
                {(b.percentage ?? 0) >= 100
                  ? `🚨 ${CATEGORY_EMOJIS[b.category]} ${b.category} budget exceeded by ${formatAmount(Math.abs(b.remaining ?? 0))}!`
                  : `⚠️ ${CATEGORY_EMOJIS[b.category]} ${b.category} at ${b.percentage}% — ${formatAmount(b.remaining ?? 0)} left`}
              </div>
            ))}
          </motion.div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <StatCard
            label="This Month"
            value={statsLoading ? "..." : formatAmount(stats?.total ?? 0)}
            icon="💸"
            color="var(--pink-500)"
            delay={0}
          />
          <StatCard
            label="Transactions"
            value={statsLoading ? "..." : stats?.chartData?.reduce(() => 0, 0) ?? "—"}
            icon="🧾"
            color="var(--pink-400)"
            delay={0.05}
            rawValue={recentExpenses.length ? `${recentExpenses.length}+ recent` : "0"}
          />
          <StatCard
            label="Categories"
            value={statsLoading ? "..." : String(Object.keys(stats?.byCategory ?? {}).length)}
            icon="🗂️"
            color="var(--pink-300)"
            delay={0.1}
          />
          <StatCard
            label="Budgets Active"
            value={budgetsLoading ? "..." : String(budgets.length)}
            icon="🎯"
            color="var(--pink-200)"
            delay={0.15}
          />
        </div>

        {!statsLoading && stats && stats.chartData?.length > 0 && (
          <motion.div
            className="pixel-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px" }}>📊 This Month</h2>
              <button
                onClick={() => onNavigate?.("stats")}
                style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", background: "none", border: "none", color: "var(--pink-500)", cursor: "pointer" }}
              >
                View all →
              </button>
            </div>
            {stats.chartData.sort((a, b) => b.amount - a.amount).map((item, i) => {
              const pct = Math.round((item.amount / stats.total) * 100);
              const color = CATEGORY_COLORS[item.category] || "#f472b6";
              return (
                <div key={item.category} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}>
                      {CATEGORY_EMOJIS[item.category]} {item.category}
                    </span>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color }}>
                      {formatAmount(item.amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="pixel-progress">
                    <motion.div
                      className="pixel-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                      style={{
                        background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 6px, ${color}cc 6px, ${color}cc 8px)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <motion.div
          className="pixel-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px" }}>🕓 Recent</h2>
            <button
              onClick={() => onNavigate?.("expenses")}
              style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", background: "none", border: "none", color: "var(--pink-500)", cursor: "pointer" }}
            >
              View all →
            </button>
          </div>
          {recentExpenses.length === 0 ? (
            <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--gray-400)", textAlign: "center", padding: 20 }}>
              🌸 No expenses yet!
            </p>
          ) : (
            recentExpenses.map((e) => (
              <div key={e._id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid var(--pink-100)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{CATEGORY_EMOJIS[e.category]}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}>{e.title}</div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: "6px", color: "var(--gray-400)", marginTop: 2 }}>
                      {e.date} · {e.category}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "9px",
                  color: CATEGORY_COLORS[e.category] || "var(--pink-500)",
                }}>
                  {formatAmount(e.amount)}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </>
  );
}

function StatCard({ label, value, icon, color, delay, rawValue }) {
  return (
    <motion.div
      className="pixel-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ padding: 16, borderLeft: `4px solid ${color}` }}
    >
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", color, marginBottom: 4 }}>
        {rawValue ?? value}
      </div>
      <div style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "var(--gray-400)" }}>
        {label}
      </div>
    </motion.div>
  );
}