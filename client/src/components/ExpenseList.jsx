import { useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_COLORS, formatINR, formatDate } from '../utils';

export default function ExpenseList({ expenses, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((e) => {
      if (filterCat && e.category !== filterCat) return false;
      if (q && !e.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [expenses, search, filterCat]);

  return (
    <div className="card">
      <div className="card-head">
        <h2>Recent Expenses</h2>
        <div className="filters">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <p className="empty">
            {expenses.length === 0
              ? 'No expenses yet — add your first above.'
              : 'No expenses match your filters.'}
          </p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="num">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id}>
                  <td data-label="Date">{formatDate(e.date)}</td>
                  <td data-label="Description">{e.description}</td>
                  <td data-label="Category">
                    <span
                      className="chip"
                      style={{ background: CATEGORY_COLORS[e.category] || '#6b7280' }}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td data-label="Amount" className="num">{formatINR(e.amount)}</td>
                  <td className="actions">
                    <button
                      className="btn-icon"
                      aria-label="Delete"
                      onClick={() => onDelete(e._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
