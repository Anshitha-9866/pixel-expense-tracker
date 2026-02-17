# 💖 Pixel Expense Tracker

A cute pixel-art themed expense tracker built with the MERN stack.

```
 ██████╗ ██╗██╗  ██╗███████╗██╗     
 ██╔══██╗██║╚██╗██╔╝██╔════╝██║     
 ██████╔╝██║ ╚███╔╝ █████╗  ██║     
 ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║     
 ██║     ██║██╔╝ ██╗███████╗███████╗
 ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝
 EXPENSE TRACKER ♥
```

---

## ✨ Features

- **📊 Dashboard** — Monthly summary, category breakdown, recent expenses, budget alerts
- **💸 Expenses** — Full CRUD with search, category filter, month filter, sort by date/amount
- **🎯 Budgets** — Set monthly budgets per category, track spend vs limit with progress bars
- **📅 Calendar** — Heatmap calendar showing expense density, click any day to see expenses
- **📈 Stats** — Bar chart breakdown + 6-month trend line chart

---

## 🛠️ Tech Stack

| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | React 18, Vite, Framer Motion, Recharts, MUI |
| Backend   | Node.js, Express 4                    |
| Database  | MongoDB + Mongoose                    |
| Styling   | Custom CSS (pixel art, Press Start 2P font) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# backend/.env  (copy from .env.example)
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixel-expense-tracker
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # uses nodemon

# Terminal 2 — Frontend
cd frontend
npm run dev       # Vite dev server on :5173
```

Open **http://localhost:5173** 🌸

---

## 📁 Project Structure

```
pixel-expense-tracker/
├── backend/
│   ├── server.js                  # Express entry + DB connect
│   ├── models/
│   │   ├── Expense.js             # Expense schema (title, amount, category, date, note)
│   │   └── Budget.js              # Budget schema (category, month, limit)
│   ├── controllers/
│   │   ├── expenseController.js   # CRUD + bulk delete + filters
│   │   ├── budgetController.js    # Get/set/delete budgets with spent calc
│   │   └── statsController.js     # Monthly summary, daily breakdown, 6mo trend
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── statsRoutes.js
│   └── middleware/
│       └── errorHandler.js
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Root, tab routing, floating hearts
    │   ├── main.jsx
    │   ├── index.css              # Global pixel theme, CSS variables
    │   ├── api/index.js           # Axios instance with error interceptor
    │   ├── hooks/useExpenses.js   # Data fetching hooks
    │   ├── utils/categories.js    # Category colors, emojis, formatAmount
    │   └── components/
    │       ├── Header.jsx         # Sticky nav + month total
    │       ├── Dashboard.jsx      # Home page
    │       ├── AddExpense.jsx     # Add form (used inline + in dashboard)
    │       ├── ExpenseItem.jsx    # Single expense with inline edit
    │       ├── ExpenseList.jsx    # Filtered expense list
    │       ├── BudgetManager.jsx  # Budget CRUD + progress bars
    │       ├── ExpenseCalendar.jsx # Heatmap calendar
    │       ├── StatsPage.jsx      # Charts page
    │       ├── PixelLoader.jsx    # Bouncing pixel loader
    │       └── PixelIcons.jsx     # SVG pixel icons + category icons
    └── index.html
```

---

## 🌐 API Reference

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/expenses` | List all (query: `category`, `month`, `search`, `sortBy`, `order`) |
| GET | `/api/expenses/:id` | Get single |
| POST | `/api/expenses` | Create `{ title, amount, category, date, note? }` |
| PUT | `/api/expenses/:id` | Update (partial) |
| DELETE | `/api/expenses/:id` | Delete one |
| DELETE | `/api/expenses/bulk` | Delete many `{ ids: [...] }` |

### Budgets
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/budgets?month=YYYY-MM` | List with spent/remaining/percentage |
| POST | `/api/budgets` | Set/upsert `{ category, month, limit }` |
| DELETE | `/api/budgets/:id` | Delete |

### Stats
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stats/monthly?month=YYYY-MM` | Category totals + chart data |
| GET | `/api/stats/daily?month=YYYY-MM` | Per-day totals for calendar |
| GET | `/api/stats/trend` | Last 6 months total |

---

## 🎨 Design System

CSS variables in `index.css`:
- `--pink-{50-700}` — pink palette
- `--font-pixel` — Press Start 2P
- `--font-display` — VT323
- `--pixel-shadow` — 4px offset drop shadow
- `.pixel-btn`, `.pixel-card`, `.pixel-input`, `.pixel-select`, `.pixel-progress` — reusable classes

---

