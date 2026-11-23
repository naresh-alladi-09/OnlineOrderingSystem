import { Dish } from '../models/Dish.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

// @desc    Fetch dishes with optional restaurant, category, or search filters
// @route   GET /api/dishes
// @access  Public
export const getDishes = async (req, res) => {
  try {
    const { restaurantId, category, search, isVeg } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (restaurantId) query.restaurant = restaurantId;
      if (category && category.toLowerCase() !== 'all') query.category = category;
      if (isVeg !== undefined) query.isVeg = isVeg === 'true';
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const dishes = await Dish.find(query);
      return res.json(dishes);
    } else {
      const parsedVeg = isVeg !== undefined ? isVeg === 'true' : undefined;
      const dishes = await mockStore.getDishes({
        restaurantId,
        category,
        search,
        isVeg: parsedVeg,
      });
      return res.json(dishes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single dish by ID
// @route   GET /api/dishes/:id
// @access  Public
export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const dish = await Dish.findById(id).catch(() => null);
      if (dish) return res.json(dish);
    } else {
      const dish = await mockStore.getDishById(id);
      if (dish) return res.json(dish);
    }

    res.status(404).json({ message: 'Dish not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new dish
// @route   POST /api/dishes
// @access  Private/Admin
export const createDish = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category, image, isVeg, isBestseller, portionSize } = req.body;

    if (!restaurantId || !name || !price || !category) {
      return res.status(400).json({ message: 'Restaurant, name, price, and category are required' });
    }

    const defaultImg =
      image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    if (isDbConnected()) {
      const dish = await Dish.create({
        restaurant: restaurantId,
        name,
        description: description || '',
        price: Number(price),
        category,
        image: defaultImg,
        isVeg: Boolean(isVeg),
        isBestseller: Boolean(isBestseller),
        portionSize: portionSize || 'Serves 1',
      });
      return res.status(201).json(dish);
    } else {
      const dish = await mockStore.createDish({
        restaurant: restaurantId,
        name,
        description: description || '',
        price: Number(price),
        category,
        image: defaultImg,
        isVeg: Boolean(isVeg),
        isBestseller: Boolean(isBestseller),
        portionSize: portionSize || 'Serves 1',
      });
      return res.status(201).json(dish);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update dish
// @route   PUT /api/dishes/:id
// @access  Private/Admin
export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const updated = await Dish.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } else {
      const updated = await mockStore.updateDish(id, req.body);
      if (updated) return res.json(updated);
    }

    res.status(404).json({ message: 'Dish not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete dish
// @route   DELETE /api/dishes/:id
// @access  Private/Admin
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Dish.findByIdAndDelete(id);
      if (deleted) return res.json({ message: 'Dish removed successfully' });
    } else {
      const deleted = await mockStore.deleteDish(id);
      if (deleted) return res.json({ message: 'Dish removed successfully' });
    }

    res.status(404).json({ message: 'Dish not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

