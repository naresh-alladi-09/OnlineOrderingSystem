import { initialRestaurants, initialDishes, initialUsers } from './seedData.js';
import bcrypt from 'bcryptjs';

// Deep clone to prevent mutations on base templates
let restaurants = JSON.parse(JSON.stringify(initialRestaurants));
let dishes = JSON.parse(JSON.stringify(initialDishes));
let users = JSON.parse(JSON.stringify(initialUsers));

let orders = [
  {
    _id: "order_bvr_101",
    user: "user_demo",
    customerName: "Ravi Teja Varma",
    customerEmail: "user@feastify.com",
    customerPhone: "+91 99490 88776",
    restaurant: "rest_1",
    restaurantName: "D-Vindhu Family Restaurant",
    orderItems: [
      {
        dishId: "dish_1",
        name: "Special Bhimavaram Royyala (Prawn) Pulao",
        price: 360,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        isVeg: false,
        specialInstructions: "Extra raita and spicy gravy"
      },
      {
        dishId: "dish_4",
        name: "Crispy Godavari Royyalu (Prawns) Vepudu",
        price: 320,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
        isVeg: false,
        specialInstructions: "Crispy curry leaves garnish"
      }
    ],
    deliveryAddress: {
      street: "J.P. Road, Someswaram",
      city: "Bhimavaram",
      state: "Andhra Pradesh",
      zipCode: "534201",
      instructions: "Near Someswara Swamy Temple gate"
    },
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    itemsPrice: 680,
    taxPrice: 34,
    deliveryPrice: 30,
    discountPrice: 136,
    totalPrice: 608,
    couponCode: "FEAST20",
    orderStatus: "Out for Delivery",
    statusHistory: [
      { status: "Placed", timestamp: new Date(Date.now() - 35 * 60000), note: "Order placed successfully" },
      { status: "Confirmed", timestamp: new Date(Date.now() - 30 * 60000), note: "D-Vindhu kitchen confirmed your order" },
      { status: "Preparing", timestamp: new Date(Date.now() - 20 * 60000), note: "Chef is frying fresh Royyalu in spicy Godavari masala" },
      { status: "Out for Delivery", timestamp: new Date(Date.now() - 8 * 60000), note: "Rider picked up from P.P. Road" }
    ],
    estimatedDeliveryTime: "10-15 mins",
    driverInfo: {
      name: "Suresh Raju",
      phone: "+91 98492 44321",
      vehicle: "Honda Activa - AP 37 BV 1244"
    },
    createdAt: new Date(Date.now() - 35 * 60000)
  }
];

export const mockStore = {
  // Users
  findUserByEmail: async (email) => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: async (id) => {
    return users.find((u) => u._id === id);
  },
  createUser: async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      rawPassword: userData.password,
      role: userData.role || 'customer',
      phone: userData.phone || '',
      addresses: userData.addresses || [],
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },

  // Restaurants
  getRestaurants: async ({ search = '', cuisine = '', sort = '', pureVeg = false, fastDelivery = false, hasOffers = false } = {}) => {
    let result = [...restaurants];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.cuisines.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (cuisine && cuisine.toLowerCase() !== 'all') {
      const cLower = cuisine.toLowerCase();
      result = result.filter((r) => r.cuisines.some((c) => c.toLowerCase().includes(cLower)));
    }
    if (pureVeg) {
      result = result.filter((r) => r.isVegOnly === true);
    }
    if (fastDelivery) {
      result = result.filter((r) => r.deliveryTimeMinutes <= 25);
    }
    if (hasOffers) {
      result = result.filter((r) => !!r.offer);
    }

    if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'deliveryTime') {
      result.sort((a, b) => a.deliveryTimeMinutes - b.deliveryTimeMinutes);
    } else if (sort === 'deliveryFee') {
      result.sort((a, b) => a.deliveryFee - b.deliveryFee);
    } else if (sort === 'costLow') {
      result.sort((a, b) => (a.costForTwo || 300) - (b.costForTwo || 300));
    } else if (sort === 'costHigh') {
      result.sort((a, b) => (b.costForTwo || 300) - (a.costForTwo || 300));
    }
    return result;
  },
  getRestaurantById: async (id) => {
    return restaurants.find((r) => r._id === id || r.slug === id);
  },
  createRestaurant: async (data) => {
    const newRestaurant = {
      _id: `rest_${Date.now()}`,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      rating: 4.8,
      reviewsCount: 1,
      isOpen: true,
      deliveryDistanceKm: 2.0,
      costForTwo: data.costForTwo || 400,
      deliveryFee: data.deliveryFee || 30,
      minOrderAmount: data.minOrderAmount || 150,
      ...data,
      createdAt: new Date()
    };
    restaurants.unshift(newRestaurant);
    return newRestaurant;
  },
  updateRestaurant: async (id, data) => {
    const index = restaurants.findIndex((r) => r._id === id);
    if (index === -1) return null;
    restaurants[index] = { ...restaurants[index], ...data, updatedAt: new Date() };
    return restaurants[index];
  },
  deleteRestaurant: async (id) => {
    const index = restaurants.findIndex((r) => r._id === id);
    if (index === -1) return false;
    restaurants.splice(index, 1);
    dishes = dishes.filter((d) => d.restaurant !== id);
    return true;
  },

  // Dishes
  getDishes: async ({ restaurantId, category, search, isVeg } = {}) => {
    let result = [...dishes];
    if (restaurantId) {
      result = result.filter((d) => d.restaurant === restaurantId);
    }
    if (category && category.toLowerCase() !== 'all') {
      result = result.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }
    if (typeof isVeg === 'boolean') {
      result = result.filter((d) => d.isVeg === isVeg);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return result;
  },
  getDishById: async (id) => {
    return dishes.find((d) => d._id === id);
  },
  createDish: async (data) => {
    const newDish = {
      _id: `dish_${Date.now()}`,
      rating: 4.8,
      isAvailable: true,
      ...data,
      createdAt: new Date()
    };
    dishes.push(newDish);
    return newDish;
  },
  updateDish: async (id, data) => {
    const index = dishes.findIndex((d) => d._id === id);
    if (index === -1) return null;
    dishes[index] = { ...dishes[index], ...data, updatedAt: new Date() };
    return dishes[index];
  },
  deleteDish: async (id) => {
    const index = dishes.findIndex((d) => d._id === id);
    if (index === -1) return false;
    dishes.splice(index, 1);
    return true;
  },

  // Orders
  getOrders: async () => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getUserOrders: async (userId) => {
    return orders
      .filter((o) => o.user === userId || o.user?._id === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getOrderById: async (id) => {
    return orders.find((o) => o._id === id);
  },
  createOrder: async (orderData) => {
    const newOrder = {
      _id: `order_${Date.now()}`,
      orderStatus: 'Placed',
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date(),
          note: 'Order placed by customer in Bhimavaram'
        }
      ],
      driverInfo: {
        name: 'Kalyan Varma',
        phone: '+91 98495 12389',
        vehicle: 'Hero Splendor - AP 37 CB 9981'
      },
      ...orderData,
      createdAt: new Date()
    };
    orders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: async (id, status, note = '') => {
    const order = orders.find((o) => o._id === id);
    if (!order) return null;
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order updated to ${status}`
    });
    order.updatedAt = new Date();
    return order;
  },

  // Stats
  getStats: async () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const activeRestaurants = restaurants.length;
    const totalDishes = dishes.length;
    const recentOrders = orders.slice(0, 5);
    return {
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      activeRestaurants,
      totalDishes,
      recentOrders
    };
  }
};
