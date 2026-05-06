import { useMemo } from 'react';
import { buildAlerts } from '../utils';

export default function Alerts({ expenses, budgets }) {
  const alerts = useMemo(() => buildAlerts(expenses, budgets), [expenses, budgets]);
  if (alerts.length === 0) return null;

  return (
    <div className="alerts">
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.level}`}>
          <strong>{a.category}</strong>
          <span>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}
