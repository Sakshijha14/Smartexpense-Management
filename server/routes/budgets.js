import { Router } from 'express';
import Budget from '../models/Budget.js';
import { CATEGORIES } from '../utils/categorize.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await Budget.find();
    res.json(items);
  } catch (err) { next(err); }
});

router.put('/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { monthlyLimit } = req.body;
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    if (monthlyLimit == null || Number(monthlyLimit) < 0) {
      return res.status(400).json({ error: 'monthlyLimit must be >= 0' });
    }
    const budget = await Budget.findOneAndUpdate(
      { category },
      { category, monthlyLimit: Number(monthlyLimit) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(budget);
  } catch (err) { next(err); }
});

export default router;
