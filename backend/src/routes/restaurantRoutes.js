import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, adminOnly, createRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, adminOnly, updateRestaurant)
  .delete(protect, adminOnly, deleteRestaurant);

export default router;

