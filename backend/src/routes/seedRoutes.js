
import express from 'express';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { Dish } from '../models/Dish.js';
import { Order } from '../models/Order.js';
import { initialRestaurants, initialDishes, initialUsers } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        message: 'Running in mock persistence mode. Default demo restaurants, dishes, and users are already active!',
      });
    }

    // Clear existing
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Dish.deleteMany();
    await Order.deleteMany();

    // Create users (passwords hashed via pre-save)
    const createdUsers = [];
    for (const u of initialUsers) {
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: u.rawPassword || 'password123',
        role: u.role,
        phone: u.phone,
        addresses: u.addresses,
      });
      createdUsers.push(user);
    }

    // Create restaurants
    const restMap = {};
    for (const r of initialRestaurants) {
      const { _id, ...restData } = r;
      const created = await Restaurant.create(restData);
      restMap[_id] = created._id;
    }

    // Create dishes mapping old mock id to newly created MongoDB ObjectId
    for (const d of initialDishes) {
      const { _id, restaurant, ...dishData } = d;
      const targetRestId = restMap[restaurant];
      if (targetRestId) {
        await Dish.create({
          ...dishData,
          restaurant: targetRestId,
        });
      }
    }

    res.json({
      message: 'MongoDB successfully seeded with EasyDine restaurants, dishes, and accounts!',
      restaurantsCount: initialRestaurants.length,
      dishesCount: initialDishes.length,
      usersCount: createdUsers.length,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
