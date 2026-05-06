export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#0ea5e9',
  Shopping: '#a855f7',
  Entertainment: '#ec4899',
  Bills: '#ef4444',
  Health: '#10b981',
  Education: '#eab308',
  Other: '#6b7280'
};

export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const isSameMonth = (date, ref = new Date()) => {
  const d = new Date(date);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
};

export const isSameDay = (a, b = new Date()) => {
  const x = new Date(a), y = new Date(b);
  return x.toDateString() === y.toDateString();
};

export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function sumByCategory(expenses) {
  const totals = {};
  for (const e of expenses) totals[e.category] = (totals[e.category] || 0) + e.amount;
  return totals;
}

export function buildTrend(expenses, days) {
  const labels = [];
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    const total = expenses
      .filter((e) => isSameDay(e.date, d))
      .reduce((acc, e) => acc + e.amount, 0);
    data.push(Number(total.toFixed(2)));
  }
  return { labels, data };
}

export function buildAlerts(expenses, budgets) {
  const monthExpenses = expenses.filter((e) => isSameMonth(e.date));
  const totalsByCat = sumByCategory(monthExpenses);
  const alerts = [];
  for (const b of budgets) {
    const spent = totalsByCat[b.category] || 0;
    if (b.monthlyLimit <= 0) continue;
    const pct = (spent / b.monthlyLimit) * 100;
    if (pct >= 100) {
      alerts.push({ level: 'danger', category: b.category, msg: `Over budget — ${formatINR(spent)} of ${formatINR(b.monthlyLimit)}` });
    } else if (pct >= 80) {
      alerts.push({ level: 'warn', category: b.category, msg: `${Math.round(pct)}% used — ${formatINR(spent)} of ${formatINR(b.monthlyLimit)}` });
    }
  }
  return alerts;
}
