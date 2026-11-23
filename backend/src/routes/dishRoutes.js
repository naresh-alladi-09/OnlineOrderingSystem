import express from 'express';
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDishes)
  .post(protect, adminOnly, createDish);

router.route('/:id')
  .get(getDishById)
  .put(protect, adminOnly, updateDish)
  .delete(protect, adminOnly, deleteDish);

export default router;

