import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ExpenseList from "./components/ExpenseList";
import BudgetManager from "./components/BudgetManager";
import ExpenseCalendar from "./components/ExpenseCalendar";
import StatsPage from "./components/StatsPage";
import api from "./api/index.js";
import { currentMonth } from "./utils/categories";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  // Always fetch the real total from server — never calculate manually
  const fetchTotal = async () => {
    try {
      const month = currentMonth();
      const res = await api.get(`/stats/monthly?month=${month}`);
      setTotalThisMonth(res.data.total ?? 0);
    } catch {
      setTotalThisMonth(0);
    }
  };

  // Refetch on mount AND every time the user switches tabs
  useEffect(() => { fetchTotal(); }, [tab]);

  const pages = {
    dashboard: <Dashboard onNavigate={setTab} onRefreshTotal={fetchTotal} />,
    expenses: <ExpenseList onRefreshTotal={fetchTotal} />,
    budgets: <BudgetManager />,
    calendar: <ExpenseCalendar />,
    stats: <StatsPage />,
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header tab={tab} setTab={setTab} totalThisMonth={totalThisMonth} />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {pages[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingHearts />
    </div>
  );
}

function FloatingHearts() {
  return (
    <>
      {[
        { top: "15%", right: "2%", size: 12, delay: "0s" },
        { top: "40%", right: "1.5%", size: 8, delay: "1s" },
        { top: "70%", right: "2.5%", size: 10, delay: "2s" },
        { top: "85%", left: "1.5%", size: 8, delay: "0.5s" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            ...s,
            opacity: 0.2,
            pointerEvents: "none",
            zIndex: 0,
            animation: `pixelFloat 3s ease-in-out ${s.delay} infinite`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
            <rect x="1" y="0" width="2" height="1" fill="#ec4899" />
            <rect x="5" y="0" width="2" height="1" fill="#ec4899" />
            <rect x="0" y="1" width="3" height="2" fill="#ec4899" />
            <rect x="4" y="1" width="3" height="2" fill="#ec4899" />
            <rect x="0" y="3" width="8" height="2" fill="#ec4899" />
            <rect x="1" y="5" width="6" height="1" fill="#ec4899" />
            <rect x="2" y="6" width="4" height="1" fill="#ec4899" />
            <rect x="3" y="7" width="2" height="1" fill="#ec4899" />
          </svg>
        </div>
      ))}
    </>
  );
}