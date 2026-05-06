import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/categorize.js';

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String, enum: CATEGORIES, required: true, default: 'Other' }
  },
  { timestamps: true }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
