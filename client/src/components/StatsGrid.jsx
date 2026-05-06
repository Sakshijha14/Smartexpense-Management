import { useMemo } from 'react';
import { formatINR, isSameMonth, isSameDay, daysAgo, sumByCategory } from '../utils';

export default function StatsGrid({ expenses }) {
  const stats = useMemo(() => {
    const monthExp = expenses.filter((e) => isSameMonth(e.date));
    const todayExp = expenses.filter((e) => isSameDay(e.date));
    const monthTotal = monthExp.reduce((a, e) => a + e.amount, 0);
    const todayTotal = todayExp.reduce((a, e) => a + e.amount, 0);

    const since30 = daysAgo(29);
    const last30 = expenses.filter((e) => new Date(e.date) >= since30);
    const total30 = last30.reduce((a, e) => a + e.amount, 0);
    const avg30 = total30 / 30;

    const totals = sumByCategory(monthExp);
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];

    return {
      monthTotal,
      monthCount: monthExp.length,
      todayTotal,
      todayCount: todayExp.length,
      avg30,
      topCat: top ? top[0] : '—',
      topAmt: top ? top[1] : 0
    };
  }, [expenses]);

  return (
    <div className="stats-grid">
      <div className="stat-card stat-primary">
        <span className="stat-label">This Month</span>
        <span className="stat-value">{formatINR(stats.monthTotal)}</span>
        <span className="stat-sub">{stats.monthCount} transactions</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Today</span>
        <span className="stat-value">{formatINR(stats.todayTotal)}</span>
        <span className="stat-sub">{stats.todayCount === 0 ? 'No spend yet' : `${stats.todayCount} today`}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Daily Avg (30d)</span>
        <span className="stat-value">{formatINR(stats.avg30)}</span>
        <span className="stat-sub">last 30 days</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Top Category</span>
        <span className="stat-value">{stats.topCat}</span>
        <span className="stat-sub">{stats.topAmt > 0 ? formatINR(stats.topAmt) : 'No data'}</span>
      </div>
    </div>
  );
}
