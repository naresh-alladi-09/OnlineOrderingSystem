
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DishCard } from '../components/DishCard';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Search,
  ShoppingBag,
  Percent,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const RestaurantDetail = ({ restaurant, onBack, onNavigateCheckout }) => {
  const { cartCount, grandTotal, openCartDrawer } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    loadDishes();
  }, [restaurant]);

  const loadDishes = async () => {
    setLoading(true);
    try {
      const data = await api.getDishes({ restaurantId: restaurant._id });
      setDishes(data);
    } catch (err) {
      console.error('Failed to load menu dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group dishes by category
  const categories = Array.from(new Set(dishes.map((d) => d.category)));

  const toggleSection = (cat) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const getFilteredDishes = (cat) => {
    return dishes.filter((dish) => {
      const matchesCat = dish.category === cat;
      const matchesVeg = !isVegOnly || dish.isVeg;
      const matchesSearch =
        !menuSearch ||
        dish.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        dish.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchesCat && matchesVeg && matchesSearch;
    });
  };

  return (
    <div className="min-h-screen pb-28 bg-[#f1f1f6]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#93959f] py-2">
          <button onClick={onBack} className="hover:text-black">Home</button>
          <span>/</span>
          <span className="hover:text-black">Bhimavaram</span>
          <span>/</span>
          <span className="text-[#282c3f] font-bold truncate max-w-xs">{restaurant.name}</span>
        </div>

        {/* RESTAURANT INFO CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#282c3f]">
                {restaurant.name}
              </h1>
              <p className="text-xs text-[#686b78] mt-1">
                {restaurant.cuisines?.join(', ')}
              </p>
              <p className="text-xs text-[#686b78] mt-0.5">
                {restaurant.address?.street}, Bhimavaram
              </p>
            </div>

            {/* Rating Badge */}
            <div className="p-2 border border-gray-200 rounded-xl text-center shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-1 text-xs font-black text-[#3d9b6d]">
                <Star className="w-3.5 h-3.5 fill-[#3d9b6d] text-[#3d9b6d]" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="h-px w-full bg-gray-100 my-1" />
              <span className="text-[10px] text-[#686b78] font-bold">
                {restaurant.reviewsCount}+ ratings
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 mt-4 pt-3 flex items-center gap-6 text-xs font-extrabold text-[#282c3f]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{restaurant.deliveryTimeMinutes} MINS</span>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-gray-500" />
              <span>₹{restaurant.costForTwo || 400} for two</span>
            </div>
            <div className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hidden sm:inline">
              ✓ EasyDine Delivery Available in Bhimavaram
            </div>
          </div>
        </div>

        {/* DEALS FOR YOU (COUPONS SLIDER) */}
        <div className="mt-6">
          <h3 className="text-sm font-black text-[#282c3f] tracking-tight mb-3 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-[#fc8019]" />
            Deals for you in Bhimavaram
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="min-w-[210px] bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#fc8019] flex items-center justify-center font-black text-xs">
                %
              </div>
              <div>
                <p className="text-xs font-black text-[#282c3f]">60% OFF UPTO ₹120</p>
                <p className="text-[10px] font-bold text-gray-400">USE FEAST20</p>
              </div>
            </div>

            <div className="min-w-[210px] bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                🚚
              </div>
              <div>
                <p className="text-xs font-black text-[#282c3f]">FREE DELIVERY</p>
                <p className="text-[10px] font-bold text-gray-400">USE FREESHIP</p>
              </div>
            </div>

            <div className="min-w-[210px] bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                ₹
              </div>
              <div>
                <p className="text-xs font-black text-[#282c3f]">FLAT ₹50 OFF</p>
                <p className="text-[10px] font-bold text-gray-400">USE SAVE50</p>
              </div>
            </div>
          </div>
        </div>

        {/* MENU CONTROLS: VEG TOGGLE & SEARCH */}
        <div className="mt-8 flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
          {/* Veg Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                isVegOnly ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </div>
            <span className="text-xs font-black text-[#282c3f]">Pure Veg</span>
          </label>

          {/* Search in Menu */}
          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              placeholder="Search for dishes..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* CATEGORIZED DISH ACCORDIONS */}
        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-16 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 text-xs">
              No menu items found.
            </div>
          ) : (
            categories.map((cat) => {
              const catDishes = getFilteredDishes(cat);
              if (catDishes.length === 0) return null;
              const isCollapsed = collapsedSections[cat];

              return (
                <div
                  key={cat}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
                >
                  {/* Category Header */}
                  <div
                    onClick={() => toggleSection(cat)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <h3 className="font-black text-lg text-[#282c3f]">
                      {cat} ({catDishes.length})
                    </h3>
                    {isCollapsed ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Accordion Body */}
                  {!isCollapsed && (
                    <div className="mt-2 divide-y divide-gray-100">
                      {catDishes.map((dish) => (
                        <DishCard key={dish._id} dish={dish} restaurant={restaurant} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FLOATING BOTTOM CART BAR */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto z-40 animate-slideUp">
          <div className="bg-[#60b246] text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white/90">
                {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
              </p>
              <p className="text-sm font-black text-white">
                ₹{grandTotal.toFixed(2)}
              </p>
            </div>

            <button
              onClick={openCartDrawer}
              className="px-5 py-2.5 bg-white text-[#60b246] text-xs font-black rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>VIEW CART</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
