import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 4.6 },
    portionSize: { type: String, default: 'Serves 1' },
  },
  { timestamps: true }
);

export const Dish = mongoose.model('Dish', dishSchema);
export default Dish;

