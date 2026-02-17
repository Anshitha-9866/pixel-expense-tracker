import { useState, useEffect, useCallback } from "react";
import api from "../api";

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All") params.set("category", filters.category);
      if (filters.month) params.set("month", filters.month);
      if (filters.search) params.set("search", filters.search);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.order) params.set("order", filters.order);

      const res = await api.get(`/expenses?${params.toString()}`);
      setExpenses(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.month, filters.search, filters.sortBy, filters.order]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e._id !== id));

  const updateExpense = (updated) =>
    setExpenses((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));

  return { expenses, loading, error, refetch: fetchExpenses, addExpense, removeExpense, updateExpense };
}

export function useStats(month) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stats/monthly?month=${month}`);
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [month]);

  return { stats, loading };
}

export function useBudgets(month) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?month=${month}`);
      setBudgets(res.data);
    } catch {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  return { budgets, loading, refetch: fetchBudgets };
}

export function useTrend() {
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    api.get("/stats/trend").then((r) => setTrend(r.data)).catch(() => {});
  }, []);

  return trend;
}
