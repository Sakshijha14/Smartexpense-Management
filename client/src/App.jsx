import { useEffect, useState } from 'react';
import Topbar from './components/Topbar';
import StatsGrid from './components/StatsGrid';
import Alerts from './components/Alerts';
import { TrendChart, CategoryChart } from './components/Charts';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Budgets from './components/Budgets';
import { api } from './api';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [exp, bud] = await Promise.all([api.listExpenses(), api.listBudgets()]);
        if (cancelled) return;
        setExpenses(exp);
        setBudgets(bud);
      } catch (err) {
        if (!cancelled) setServerError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addExpense = async (data) => {
    const created = await api.createExpense(data);
    setExpenses((prev) => [created, ...prev]);
  };

  const deleteExpense = async (id) => {
    await api.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  const saveBudget = async (category, monthlyLimit) => {
    const saved = await api.setBudget(category, monthlyLimit);
    setBudgets((prev) => {
      const others = prev.filter((b) => b.category !== category);
      return [...others, saved];
    });
  };

  return (
    <>
      <Topbar />
      <main>
        {serverError && (
          <div className="container">
            <div className="alert alert-danger">
              <strong>Server unavailable</strong>
              <span>{serverError}. Please try again in a moment.</span>
            </div>
          </div>
        )}

        <section id="dashboard" className="container">
          <StatsGrid expenses={expenses} />
          <Alerts expenses={expenses} budgets={budgets} />
        </section>

        <section className="container chart-grid">
          <TrendChart expenses={expenses} />
          <CategoryChart expenses={expenses} />
        </section>

        <section id="add" className="container">
          <ExpenseForm onAdd={addExpense} />
        </section>

        <section id="expenses" className="container">
          {loading ? (
            <div className="card"><p className="empty">Loading expenses...</p></div>
          ) : (
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          )}
        </section>

        <section id="budgets" className="container">
          <Budgets expenses={expenses} budgets={budgets} onSave={saveBudget} />
        </section>
      </main>

      <footer className="footer">
        <p>Built with React, Chart.js, Node & MongoDB</p>
      </footer>
    </>
  );
}
