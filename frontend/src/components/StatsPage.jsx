import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useStats, useTrend } from "../hooks/useExpenses";
import { CATEGORY_COLORS, CATEGORY_EMOJIS, formatAmount, currentMonth, getMonthLabel } from "../utils/categories";
import PixelLoader from "./PixelLoader";

const PIXEL_FONT = { fontFamily: "'Press Start 2P'", fontSize: 8 };

function PixelTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--white)",
      border: "var(--border)",
      boxShadow: "var(--pixel-shadow)",
      padding: "10px 14px",
      fontFamily: "var(--font-pixel)",
      fontSize: "8px",
    }}>
      <div style={{ marginBottom: 4, color: "var(--pink-600)" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {CATEGORY_EMOJIS[p.name] || "💰"} {formatAmount(p.value)}
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [month, setMonth] = useState(currentMonth());
  const { stats, loading } = useStats(month);
  const trend = useTrend();

  const prevMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const nextMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "13px",
        color: "var(--pink-600)",
        marginBottom: "20px",
        letterSpacing: "0.5px",
      }}>
        📊 Stats
      </h1>

      {/* Month nav */}
      <div className="pixel-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="pixel-btn secondary" onClick={prevMonth} style={{ fontSize: 8, padding: "8px 12px" }}>← Prev</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", marginBottom: 6 }}>
              {getMonthLabel(month)}
            </div>
            {stats && (
              <div style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "var(--pink-500)" }}>
                Total: {formatAmount(stats.total)}
              </div>
            )}
          </div>
          <button className="pixel-btn secondary" onClick={nextMonth} style={{ fontSize: 8, padding: "8px 12px" }}>Next →</button>
        </div>
      </div>

      {loading ? (
        <PixelLoader />
      ) : !stats || stats.chartData?.length === 0 ? (
        <EmptyStats />
      ) : (
        <>
          {/* Category breakdown bar chart */}
          <motion.div
            className="pixel-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 24 }}
          >
            <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", marginBottom: 16, color: "var(--black)" }}>
              🗂️ By Category
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <XAxis
                  dataKey="category"
                  tick={PIXEL_FONT}
                  tickFormatter={(v) => `${CATEGORY_EMOJIS[v] || ""}${v.slice(0, 4)}`}
                />
                <YAxis tick={PIXEL_FONT} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<PixelTooltip />} />
                <Bar dataKey="amount" name="amount" radius={0}>
                  {stats.chartData.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#f472b6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category summary tiles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}
          >
            {stats.chartData
              .sort((a, b) => b.amount - a.amount)
              .map((item, i) => {
                const color = CATEGORY_COLORS[item.category] || "#94a3b8";
                const pct = Math.round((item.amount / stats.total) * 100);

                return (
                  <motion.div
                    key={item.category}
                    className="pixel-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    style={{ padding: 14, borderLeft: `4px solid ${color}` }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{CATEGORY_EMOJIS[item.category]}</div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", marginBottom: 4 }}>{item.category}</div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: "11px", color, marginBottom: 4 }}>
                      {formatAmount(item.amount)}
                    </div>
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "var(--gray-400)" }}>
                      {pct}% of total
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </>
      )}

      {/* 6-month trend */}
      {trend.length > 0 && (
        <motion.div
          className="pixel-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", marginBottom: 16, color: "var(--black)" }}>
            📈 6-Month Trend
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--pink-200)" />
              <XAxis
                dataKey="month"
                tick={PIXEL_FONT}
                tickFormatter={(v) => {
                  const [, m] = v.split("-");
                  return ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m, 10)];
                }}
              />
              <YAxis tick={PIXEL_FONT} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip
                formatter={(v) => [formatAmount(v), "Total"]}
                labelFormatter={(l) => getMonthLabel(l)}
                contentStyle={{ fontFamily: "var(--font-pixel)", fontSize: 8 }}
              />
              <Line
                type="stepAfter"
                dataKey="total"
                stroke="var(--pink-500)"
                strokeWidth={3}
                dot={{ fill: "var(--pink-600)", r: 5, strokeWidth: 2, stroke: "var(--black)" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}

function EmptyStats() {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
      <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--gray-400)", lineHeight: 2 }}>
        No data for this month.<br />
        <span style={{ color: "var(--pink-400)" }}>Add some expenses first! ✨</span>
      </p>
    </div>
  );
}
