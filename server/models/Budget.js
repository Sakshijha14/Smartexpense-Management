import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/categorize.js';

const budgetSchema = new mongoose.Schema(
  {
    category: { type: String, enum: CATEGORIES, required: true, unique: true },
    monthlyLimit: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Budget', budgetSchema);
