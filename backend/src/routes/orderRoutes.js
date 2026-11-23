import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  assignDriver,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getAllOrders); // Can filter by ?restaurantId=...

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .patch(updateOrderStatus);

router.route('/:id/assign-driver')
  .patch(assignDriver);

export default router;

