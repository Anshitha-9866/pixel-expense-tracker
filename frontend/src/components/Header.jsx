import { motion } from "framer-motion";
import { PixelHeart, PixelCoin } from "./PixelIcons";
import { formatAmount } from "../utils/categories";

export default function Header({ totalThisMonth = 0, tab, setTab }) {
  const tabs = [
    { id: "dashboard", label: "🏠 Home" },
    { id: "expenses", label: "💸 Expenses" },
    { id: "budgets", label: "🎯 Budgets" },
    { id: "calendar", label: "📅 Calendar" },
    { id: "stats", label: "📊 Stats" },
  ];

  return (
    <header style={{
      background: "var(--white)",
      borderBottom: "var(--border)",
      boxShadow: "0 4px 0px var(--black)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Top bar */}
      <div style={{
        background: "var(--pink-400)",
        borderBottom: "var(--border)",
        padding: "8px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div className="animate-float">
            <PixelHeart color="#fff" size={20} />
          </div>
          <span style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--white)",
            letterSpacing: "1px",
            textShadow: "2px 2px 0px rgba(0,0,0,0.3)",
          }}>
            PIXEL EXPENSES
          </span>
          <div className="animate-float" style={{ animationDelay: "0.5s" }}>
            <PixelHeart color="#fff" size={20} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <PixelCoin size={18} />
          <span style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: "var(--white)",
            letterSpacing: "0.5px",
          }}>
            {formatAmount(totalThisMonth)} this month
          </span>
        </motion.div>
      </div>

      {/* Nav tabs */}
      <nav style={{
        display: "flex",
        gap: 0,
        padding: "0 16px",
        overflowX: "auto",
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              padding: "12px 14px",
              border: "none",
              borderBottom: tab === t.id ? "3px solid var(--pink-500)" : "3px solid transparent",
              background: "transparent",
              color: tab === t.id ? "var(--pink-600)" : "var(--gray-400)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              letterSpacing: "0.3px",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
