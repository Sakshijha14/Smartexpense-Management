import { useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_COLORS, formatINR, isSameMonth, sumByCategory } from '../utils';

export default function Budgets({ expenses, budgets, onSave }) {
  const monthTotals = useMemo(
    () => sumByCategory(expenses.filter((e) => isSameMonth(e.date))),
    [expenses]
  );

  const budgetMap = useMemo(() => {
    const map = {};
    for (const b of budgets) map[b.category] = b.monthlyLimit;
    return map;
  }, [budgets]);

  return (
    <div className="card">
      <div className="card-head">
        <h2>Monthly Budgets</h2>
        <span className="hint">Alerts at 80% and 100%</span>
      </div>
      <div className="budget-grid">
        {CATEGORIES.map((cat) => (
          <BudgetItem
            key={cat}
            category={cat}
            spent={monthTotals[cat] || 0}
            limit={budgetMap[cat] || 0}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  );
}

function BudgetItem({ category, spent, limit, onSave }) {
  const [value, setValue] = useState(limit);
  const [saving, setSaving] = useState(false);
  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const overBy = limit > 0 ? Math.max(0, spent - limit) : 0;

  const save = async () => {
    if (Number(value) === limit) return;
    setSaving(true);
    try {
      await onSave(category, Number(value));
    } finally {
      setSaving(false);
    }
  };

  let barClass = 'budget-bar-fill';
  if (limit > 0 && spent >= limit) barClass += ' is-danger';
  else if (limit > 0 && spent / limit >= 0.8) barClass += ' is-warn';

  return (
    <div className="budget-item">
      <div className="budget-head">
        <span className="chip" style={{ background: CATEGORY_COLORS[category] }}>{category}</span>
        <span className="budget-spent">{formatINR(spent)}</span>
      </div>
      <div className="budget-bar">
        <div className={barClass} style={{ width: `${pct}%` }} />
      </div>
      <div className="budget-foot">
        <input
          type="number"
          min="0"
          step="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          placeholder="Set limit"
        />
        <span className="budget-meta">
          {limit > 0
            ? overBy > 0
              ? `Over by ${formatINR(overBy)}`
              : `${Math.round(pct)}% used`
            : 'No limit'}
        </span>
        {saving && <span className="hint">Saving...</span>}
      </div>
    </div>
  );
}
