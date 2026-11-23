import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    banner: { type: String, default: '' },
    cuisines: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 120 },
    deliveryTimeMinutes: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 2.99 },
    minOrderAmount: { type: Number, default: 10.0 },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Metropolis' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    isOpen: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;

