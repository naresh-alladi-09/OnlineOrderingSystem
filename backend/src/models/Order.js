import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: false,
  },
  dishId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
  specialInstructions: { type: String, default: '' },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: false,
    },
    restaurantName: { type: String, required: true },
    orderItems: [orderItemSchema],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      zipCode: { type: String, required: true },
      instructions: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'UPI'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    deliveryPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    couponCode: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    statusHistory: [statusHistorySchema],
    estimatedDeliveryTime: { type: String, default: '30-40 mins' },
    driverInfo: {
      name: { type: String, default: 'Alex Johnson' },
      phone: { type: String, default: '+1 (555) 382-9102' },
      vehicle: { type: String, default: 'E-Bike #42' },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;

