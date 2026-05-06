import { Router } from 'express';
import Expense from '../models/Expense.js';
import { categorize } from '../utils/categorize.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { description, amount, date, category } = req.body;
    if (!description || amount == null) {
      return res.status(400).json({ error: 'description and amount are required' });
    }
    const finalCategory = category && category !== '' ? category : categorize(description);
    const expense = await Expense.create({
      description,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      category: finalCategory
    });
    res.status(201).json(expense);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { description, amount, date, category } = req.body;
    const update = {};
    if (description !== undefined) update.description = description;
    if (amount !== undefined) update.amount = Number(amount);
    if (date !== undefined) update.date = new Date(date);
    if (category !== undefined) update.category = category || categorize(description || '');
    const expense = await Expense.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json(expense);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
