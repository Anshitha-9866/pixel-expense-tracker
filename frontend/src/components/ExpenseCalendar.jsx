import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { formatAmount, currentMonth, getMonthLabel } from "../utils/categories";
import { CATEGORY_EMOJIS } from "../utils/categories";
import PixelLoader from "./PixelLoader";

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function ExpenseCalendar() {
  const [month, setMonth] = useState(currentMonth());
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Fetch daily breakdown
  useEffect(() => {
    const fetchDaily = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stats/daily?month=${month}`);
        setDailyData(res.data.byDate || {});
      } catch {
        setDailyData({});
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, [month]);

  // Fetch expenses for selected date
  useEffect(() => {
    if (!selectedDate) return;
    const fetchDay = async () => {
      setLoadingExpenses(true);
      try {
        const res = await api.get(`/expenses?month=${month}&search=`);
        const dayExpenses = res.data.filter((e) => e.date === selectedDate);
        setSelectedExpenses(dayExpenses);
      } catch {
        setSelectedExpenses([]);
      } finally {
        setLoadingExpenses(false);
      }
    };
    fetchDay();
  }, [selectedDate, month]);

  // Calendar grid
  const { days, firstWeekday, daysInMonth } = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    const dim = new Date(y, m, 0).getDate();
    return { days: dim, firstWeekday: d.getDay(), daysInMonth: dim };
  }, [month]);

  // Color intensity based on spend
  const maxDaily = useMemo(() => {
    const values = Object.values(dailyData).map((d) => d.total);
    return values.length ? Math.max(...values) : 1;
  }, [dailyData]);

  const getDayColor = (dateKey) => {
    const data = dailyData[dateKey];
    if (!data) return "var(--pink-100)";
    const intensity = data.total / maxDaily;
    if (intensity > 0.8) return "var(--pink-600)";
    if (intensity > 0.5) return "var(--pink-500)";
    if (intensity > 0.2) return "var(--pink-400)";
    return "var(--pink-300)";
  };

  const prevMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setSelectedDate(null);
  };

  const totalMonth = Object.values(dailyData).reduce((s, d) => s + d.total, 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "13px",
        color: "var(--pink-600)",
        marginBottom: "20px",
        letterSpacing: "0.5px",
      }}>
        📅 Calendar
      </h1>

      {/* Month nav */}
      <div className="pixel-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="pixel-btn secondary" onClick={prevMonth} style={{ fontSize: 8, padding: "8px 12px" }}>
            ← Prev
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: "11px", marginBottom: 4 }}>
              {getMonthLabel(month)}
            </div>
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--pink-500)" }}>
              Total: {formatAmount(totalMonth)}
            </div>
          </div>
          <button className="pixel-btn secondary" onClick={nextMonth} style={{ fontSize: 8, padding: "8px 12px" }}>
            Next →
          </button>
        </div>
      </div>

      {loading ? (
        <PixelLoader />
      ) : (
        <div className="pixel-card" style={{ padding: 16 }}>
          {/* Day name headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
            {DAY_NAMES.map((d) => (
              <div key={d} style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                textAlign: "center",
                color: "var(--gray-400)",
                padding: "4px 0",
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {/* Empty cells for offset */}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const [y, m] = month.split("-");
              const dateKey = `${y}-${m}-${String(day).padStart(2, "0")}`;
              const data = dailyData[dateKey];
              const isSelected = selectedDate === dateKey;
              const isToday = dateKey === new Date().toISOString().slice(0, 10);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  style={{
                    aspectRatio: "1",
                    border: isSelected
                      ? "2px solid var(--black)"
                      : isToday
                      ? "2px solid var(--pink-500)"
                      : "2px solid transparent",
                    background: isSelected ? "var(--pink-500)" : getDayColor(dateKey),
                    color: isSelected ? "white" : "var(--black)",
                    cursor: "pointer",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    minHeight: 44,
                    position: "relative",
                    transition: "background 0.15s",
                  }}
                >
                  <span>{day}</span>
                  {data && (
                    <span style={{ fontSize: 6, marginTop: 2, opacity: 0.85 }}>
                      ₹{data.total >= 1000 ? `${(data.total / 1000).toFixed(1)}k` : Math.round(data.total)}
                    </span>
                  )}
                  {data && data.count > 0 && (
                    <div style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      background: isSelected ? "white" : "var(--pink-700)",
                      borderRadius: 0,
                    }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "var(--gray-400)" }}>Spend intensity:</span>
            {[
              { color: "var(--pink-100)", label: "None" },
              { color: "var(--pink-300)", label: "Low" },
              { color: "var(--pink-400)", label: "Med" },
              { color: "var(--pink-500)", label: "High" },
              { color: "var(--pink-600)", label: "Max" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 12, height: 12, background: color, border: "1px solid var(--gray-200)" }} />
                <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6px", color: "var(--gray-400)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected date drawer */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pixel-card"
            style={{ marginTop: 20, borderColor: "var(--pink-400)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", color: "var(--pink-600)" }}>
                💖 {selectedDate}
              </h3>
              <button className="pixel-btn secondary" onClick={() => setSelectedDate(null)} style={{ fontSize: 7, padding: "5px 8px" }}>
                ✖
              </button>
            </div>

            {loadingExpenses ? (
              <PixelLoader text="Loading..." />
            ) : selectedExpenses.length === 0 ? (
              <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--gray-400)", textAlign: "center", padding: 20 }}>
                🌸 No expenses on this day
              </p>
            ) : (
              <>
                {selectedExpenses.map((e) => (
                  <div key={e._id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--pink-100)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{CATEGORY_EMOJIS[e.category]}</span>
                      <div>
                        <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}>{e.title}</div>
                        {e.note && <div style={{ fontFamily: "var(--font-pixel)", fontSize: "6px", color: "var(--gray-400)", marginTop: 2 }}>📌 {e.note}</div>}
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "var(--pink-600)" }}>
                      {formatAmount(e.amount)}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", color: "var(--pink-600)" }}>
                    Total: {formatAmount(selectedExpenses.reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
