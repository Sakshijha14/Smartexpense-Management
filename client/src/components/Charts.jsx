import { useMemo, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { buildTrend, sumByCategory, CATEGORY_COLORS, formatINR } from '../utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export function TrendChart({ expenses }) {
  const [range, setRange] = useState(7);
  const { labels, data } = useMemo(() => buildTrend(expenses, range), [expenses, range]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spend',
        data,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => formatINR(ctx.parsed.y) } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => formatINR(v) } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="card">
      <div className="card-head">
        <h2>Spending Trend</h2>
        <div className="seg" role="tablist">
          {[7, 30, 90].map((r) => (
            <button
              key={r}
              className={`seg-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrap"><Line data={chartData} options={options} /></div>
    </div>
  );
}

export function CategoryChart({ expenses }) {
  const totals = useMemo(() => sumByCategory(expenses), [expenses]);
  const labels = Object.keys(totals).filter((k) => totals[k] > 0);
  const values = labels.map((k) => totals[k]);
  const colors = labels.map((k) => CATEGORY_COLORS[k] || '#6b7280');

  const chartData = {
    labels,
    datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatINR(ctx.parsed)}` } }
    },
    cutout: '62%'
  };

  return (
    <div className="card">
      <div className="card-head"><h2>By Category</h2></div>
      <div className="chart-wrap">
        {values.length === 0 ? (
          <p className="empty">Add expenses to see breakdown.</p>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
