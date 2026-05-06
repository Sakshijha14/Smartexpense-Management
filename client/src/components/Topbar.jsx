import { useState } from 'react';

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">₹</div>
        <div>
          <h1>Smart Expense Tracker</h1>
          <p className="tagline">Logic-based categorization · trends · alerts</p>
        </div>
      </div>
      <button
        className={`menu-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
      <nav className={`nav ${open ? 'open' : ''}`}>
        <a href="#dashboard" onClick={close}>Dashboard</a>
        <a href="#add" onClick={close}>Add</a>
        <a href="#expenses" onClick={close}>Expenses</a>
        <a href="#budgets" onClick={close}>Budgets</a>
      </nav>
    </header>
  );
}
