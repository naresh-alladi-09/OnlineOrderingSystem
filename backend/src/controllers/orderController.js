import { Order } from '../models/Order.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      restaurantId,
      restaurantName,
      deliveryAddress,
      paymentMethod = 'COD',
      couponCode = '',
      customerName,
      customerEmail,
      customerPhone,
      specialNotes = '',
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({ message: 'Complete delivery address is required' });
    }

    // Calculate financials
    const itemsPrice = Number(
      orderItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0).toFixed(2)
    );
    let deliveryPrice = itemsPrice > 399 ? 0.0 : 30.0;
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2)); // 5% GST on restaurant food
    let discountPrice = 0.0;

    // Apply coupons
    const code = (couponCode || '').trim().toUpperCase();
    if (code === 'FEAST20') {
      discountPrice = Number((itemsPrice * 0.2).toFixed(2)); // 20% discount
    } else if (code === 'FREESHIP') {
      discountPrice = deliveryPrice;
      deliveryPrice = 0.0;
    } else if (code === 'SAVE50' && itemsPrice > 250) {
      discountPrice = 50.0;
    }

    const totalPrice = Number((itemsPrice + deliveryPrice + taxPrice - discountPrice).toFixed(2));

    const orderPayload = {
      user: req.user ? req.user._id : null,
      customerName: customerName || (req.user ? req.user.name : 'Guest Customer'),
      customerEmail: customerEmail || (req.user ? req.user.email : 'guest@feastify.com'),
      customerPhone: customerPhone || (req.user ? req.user.phone : '+91 99490 88776'),
      restaurant: restaurantId,
      restaurantName: restaurantName || 'Bhimavaram Food Kitchen',
      orderItems: orderItems.map((item) => ({
        dishId: item.dishId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        specialInstructions: item.specialInstructions || specialNotes,
      })),
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      itemsPrice,
      taxPrice,
      deliveryPrice,
      discountPrice,
      totalPrice,
      couponCode: code,
      orderStatus: 'Placed',
      estimatedDeliveryTime: '25-35 mins',
      driverInfo: {
        name: 'Kalyan Varma',
        phone: '+91 98495 12389',
        vehicle: 'Hero Splendor - AP 37 CB 9981',
      },
    };

    if (isDbConnected()) {
      const order = await Order.create({
        ...orderPayload,
        statusHistory: [{ status: 'Placed', timestamp: new Date(), note: 'Order placed by customer' }],
      });
      return res.status(201).json(order);
    } else {
      const order = await mockStore.createOrder(orderPayload);
      return res.status(201).json(order);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isDbConnected()) {
      const orders = await Order.find({
        $or: [{ user: userId }, { customerEmail: req.user.email }],
      }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = await mockStore.getUserOrders(userId);
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID (live tracking / receipt)
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const order = await Order.findById(id).populate('user', 'name email phone');
      if (order) return res.json(order);
    } else {
      const order = await mockStore.getOrderById(id);
      if (order) return res.json(order);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin / Restaurant staff)
// @route   GET /api/orders
// @access  Public / Private (Admin or Restaurant Owner)
export const getAllOrders = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (restaurantId) query.restaurant = restaurantId;
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      let orders = await mockStore.getOrders();
      if (restaurantId) {
        orders = orders.filter((o) => o.restaurant === restaurantId || o.restaurantId === restaurantId);
      }
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign delivery partner to order
// @route   PATCH /api/orders/:id/assign-driver
// @access  Public / Restaurant Owner
export const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, vehicle, status = 'Out for Delivery', note } = req.body;

    const driverInfo = {
      name: name || 'Kalyan Varma',
      phone: phone || '+91 98495 12389',
      vehicle: vehicle || 'Hero Splendor - AP 37 CB 9981',
    };

    if (isDbConnected()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.driverInfo = driverInfo;
      if (status) {
        order.orderStatus = status;
        order.statusHistory.push({
          status,
          timestamp: new Date(),
          note: note || `Assigned delivery partner ${driverInfo.name} (${driverInfo.vehicle})`,
        });
      }
      await order.save();
      return res.json(order);
    } else {
      const order = await mockStore.getOrderById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.driverInfo = driverInfo;
      if (status) {
        order.orderStatus = status;
        order.statusHistory.push({
          status,
          timestamp: new Date(),
          note: note || `Assigned delivery partner ${driverInfo.name} (${driverInfo.vehicle})`,
        });
      }
      order.updatedAt = new Date();
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (isDbConnected()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.orderStatus = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Order transitioned to ${status}`,
      });
      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
      await order.save();
      return res.json(order);
    } else {
      const updated = await mockStore.updateOrderStatus(id, status, note);
      if (updated) return res.json(updated);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

