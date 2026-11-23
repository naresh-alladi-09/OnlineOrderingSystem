import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Plus, Minus } from 'lucide-react';

export const DishCard = ({ dish, restaurant }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => (item.dishId || item._id) === dish._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0 flex justify-between gap-4">
      {/* Left Details */}
      <div className="flex-1 pr-2">
        {/* Veg/Non-Veg & Bestseller Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          {/* Swiggy Veg / Non-Veg Icon */}
          <div
            className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center p-0.5 ${
              dish.isVeg ? 'border-emerald-600' : 'border-[#8e3a29]'
            }`}
          >
            {dish.isVeg ? (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            ) : (
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#8e3a29]" />
            )}
          </div>

          {dish.isBestseller && (
            <span className="text-[11px] font-bold text-[#ee6a1a] flex items-center gap-1">
              ⭐ Bestseller
            </span>
          )}

          {dish.rating && (
            <span className="text-[11px] font-semibold text-gray-500">
              ★ {dish.rating}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h4 className="font-bold text-base text-[#282c3f] leading-snug">
          {dish.name}
        </h4>

        {/* Price */}
        <p className="text-sm font-semibold text-[#282c3f] mt-1">
          ₹{dish.price}
        </p>

        {/* Description */}
        <p className="text-xs text-[#686b78] mt-2 line-clamp-2 leading-relaxed max-w-lg">
          {dish.description}
        </p>
      </div>

      {/* Right Image & Swiggy ADD Button */}
      <div className="relative flex flex-col items-center w-32 sm:w-36 flex-shrink-0">
        <div className="w-32 h-28 sm:w-36 sm:h-32 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Swiggy Overlapping ADD Button */}
        <div className="absolute -bottom-2.5">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(dish, restaurant)}
              className="px-7 py-2 bg-white text-[#3d9b6d] font-black text-xs uppercase rounded-xl border border-gray-200 shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden text-[#3d9b6d] font-black text-xs">
              <button
                onClick={() => updateQuantity(dish._id, -1)}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-black">{quantity}</span>
              <button
                onClick={() => updateQuantity(dish._id, 1)}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
