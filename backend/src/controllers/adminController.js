import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';
import { Dish } from '../models/Dish.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    if (isDbConnected()) {
      const totalOrders = await Order.countDocuments();
      const activeRestaurants = await Restaurant.countDocuments();
      const totalDishes = await Dish.countDocuments();

      const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

      res.json({
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        activeRestaurants,
        totalDishes,
        recentOrders,
      });
    } else {
      const stats = await mockStore.getStats();
      res.json(stats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

