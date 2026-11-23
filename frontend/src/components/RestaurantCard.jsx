
import React from 'react';
import { Star } from 'lucide-react';

export const RestaurantCard = ({ restaurant, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group cursor-pointer transition-transform duration-200 hover:scale-[0.97] flex flex-col"
    >
      {/* Restaurant Image with Offer Overlay */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient & Offer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Offer Ribbon (Bottom Banner) */}
        <div className="absolute bottom-2 left-3 right-3 text-white">
          <p className="font-black text-sm md:text-base uppercase tracking-tight drop-shadow-md truncate text-white">
            {restaurant.offer || 'ITEMS AT ₹129'}
          </p>
        </div>

        {/* Veg Only Pill if applicable */}
        {restaurant.isVegOnly && (
          <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
            Pure Veg
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      <div className="pt-3 px-1">
        <h3 className="font-extrabold text-base md:text-lg text-[#282c3f] group-hover:text-[#fc8019] transition-colors truncate">
          {restaurant.name}
        </h3>

        {/* Rating and Delivery Metrics */}
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-extrabold text-[#282c3f] mt-1">
          <div className="w-5 h-5 rounded-full bg-[#3d9b6d] text-white flex items-center justify-center text-[10px]">
            <Star className="w-3 h-3 fill-white" />
          </div>
          <span>{restaurant.rating}</span>
          <span className="text-gray-400 font-bold">•</span>
          <span>{restaurant.deliveryTimeMinutes} mins</span>
          {restaurant.costForTwo && (
            <>
              <span className="text-gray-400 font-bold">•</span>
              <span className="text-gray-500 font-normal">₹{restaurant.costForTwo} for two</span>
            </>
          )}
        </div>

        {/* Cuisines */}
        <p className="text-xs text-[#686b78] truncate mt-1 leading-snug">
          {restaurant.cuisines?.join(', ')}
        </p>

        {/* Locality in Bhimavaram */}
        <p className="text-xs text-[#686b78] truncate mt-0.5">
          {restaurant.address?.street?.split(',')[0] || 'Bhimavaram'}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
