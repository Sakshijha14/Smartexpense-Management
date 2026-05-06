import { useState } from 'react';
import { CATEGORIES, todayISO } from '../utils';

const initial = { description: '', amount: '', date: todayISO(), category: '' };

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.description.trim() || !form.amount) return;
    setSubmitting(true);
    try {
      await onAdd({
        description: form.description.trim(),
        amount: Number(form.amount),
        date: form.date,
        category: form.category
      });
      setForm({ ...initial, date: todayISO() });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-head"><h2>Add Expense</h2></div>
      <form className="form-grid" onSubmit={submit} autoComplete="off">
        <div className="field">
          <label htmlFor="desc">Description</label>
          <input
            id="desc"
            type="text"
            required
            maxLength={120}
            placeholder="e.g. Uber to office"
            value={form.description}
            onChange={change('description')}
          />
        </div>
        <div className="field">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            value={form.amount}
            onChange={change('amount')}
          />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" required value={form.date} onChange={change('date')} />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={change('category')}>
            <option value="">Auto-detect</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field field-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setForm({ ...initial, date: todayISO() })}
          >
            Reset
          </button>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
}
