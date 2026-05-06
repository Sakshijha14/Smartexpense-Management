const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  listExpenses: () => request('/expenses'),
  createExpense: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  listBudgets: () => request('/budgets'),
  setBudget: (category, monthlyLimit) =>
    request(`/budgets/${encodeURIComponent(category)}`, {
      method: 'PUT',
      body: JSON.stringify({ monthlyLimit })
    })
};
