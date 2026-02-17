export const CATEGORIES = ["Food", "Travel", "Shopping", "Rent", "Health", "Entertainment", "Other"];

export const CATEGORY_COLORS = {
  Food:          "#fb923c",
  Travel:        "#38bdf8",
  Shopping:      "#a78bfa",
  Rent:          "#4ade80",
  Health:        "#f87171",
  Entertainment: "#fbbf24",
  Other:         "#94a3b8",
};

export const CATEGORY_EMOJIS = {
  Food:          "🍔",
  Travel:        "✈️",
  Shopping:      "🛍️",
  Rent:          "🏠",
  Health:        "💊",
  Entertainment: "🎮",
  Other:         "📦",
};

export const CATEGORY_BG = {
  Food:          "#fff7ed",
  Travel:        "#f0f9ff",
  Shopping:      "#faf5ff",
  Rent:          "#f0fdf4",
  Health:        "#fef2f2",
  Entertainment: "#fffbeb",
  Other:         "#f8fafc",
};

export const getMonthLabel = (yyyyMM) => {
  const [year, month] = yyyyMM.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(month, 10) - 1]} ${year}`;
};

export const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const formatAmount = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
