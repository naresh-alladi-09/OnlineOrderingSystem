import { Restaurant } from '../models/Restaurant.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

// @desc    Fetch all restaurants with optional filter, search, sort
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, sort, pureVeg, fastDelivery, hasOffers } = req.query;

    if (isDbConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { cuisines: { $regex: search, $options: 'i' } },
        ];
      }

      if (cuisine && cuisine.toLowerCase() !== 'all') {
        query.cuisines = { $regex: cuisine, $options: 'i' };
      }

      if (pureVeg === 'true') {
        query.isVegOnly = true;
      }

      if (fastDelivery === 'true') {
        query.deliveryTimeMinutes = { $lte: 25 };
      }

      let sortOption = {};
      if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'deliveryTime') sortOption = { deliveryTimeMinutes: 1 };
      else if (sort === 'deliveryFee') sortOption = { deliveryFee: 1 };
      else if (sort === 'costLow') sortOption = { costForTwo: 1 };
      else if (sort === 'costHigh') sortOption = { costForTwo: -1 };
      else sortOption = { isFeatured: -1, rating: -1 };

      const restaurants = await Restaurant.find(query).sort(sortOption);
      return res.json(restaurants);
    } else {
      const restaurants = await mockStore.getRestaurants({
        search,
        cuisine,
        sort,
        pureVeg: pureVeg === 'true',
        fastDelivery: fastDelivery === 'true',
        hasOffers: hasOffers === 'true',
      });
      return res.json(restaurants);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single restaurant by id or slug
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const restaurant = (await Restaurant.findById(id).catch(() => null)) || (await Restaurant.findOne({ slug: id }));
      if (restaurant) {
        return res.json(restaurant);
      }
    } else {
      const restaurant = await mockStore.getRestaurantById(id);
      if (restaurant) {
        return res.json(restaurant);
      }
    }

    res.status(404).json({ message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
export const createRestaurant = async (req, res) => {
  try {
    const { name, description, image, banner, cuisines, deliveryTimeMinutes, deliveryFee, minOrderAmount } = req.body;

    if (!name || !description || !image) {
      return res.status(400).json({ message: 'Name, description, and image are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (isDbConnected()) {
      const restaurant = await Restaurant.create({
        name,
        slug,
        description,
        image,
        banner: banner || image,
        cuisines: Array.isArray(cuisines) ? cuisines : (cuisines || '').split(',').map((s) => s.trim()),
        deliveryTimeMinutes: Number(deliveryTimeMinutes) || 30,
        deliveryFee: Number(deliveryFee) || 1.99,
        minOrderAmount: Number(minOrderAmount) || 10.0,
      });
      return res.status(201).json(restaurant);
    } else {
      const restaurant = await mockStore.createRestaurant({
        name,
        description,
        image,
        banner: banner || image,
        cuisines: Array.isArray(cuisines) ? cuisines : (cuisines || '').split(',').map((s) => s.trim()),
        deliveryTimeMinutes: Number(deliveryTimeMinutes) || 30,
        deliveryFee: Number(deliveryFee) || 1.99,
        minOrderAmount: Number(minOrderAmount) || 10.0,
      });
      return res.status(201).json(restaurant);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const updated = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } else {
      const updated = await mockStore.updateRestaurant(id, req.body);
      if (updated) return res.json(updated);
    }

    res.status(404).json({ message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Restaurant.findByIdAndDelete(id);
      if (deleted) return res.json({ message: 'Restaurant removed successfully' });
    } else {
      const deleted = await mockStore.deleteRestaurant(id);
      if (deleted) return res.json({ message: 'Restaurant removed successfully' });
    }

    res.status(404).json({ message: 'Restaurant not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

