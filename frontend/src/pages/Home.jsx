import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { RestaurantCard } from '../components/RestaurantCard';
import {
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';

const EASYDINE_CATEGORIES = [
  { id: 'Biryani & Pulao', name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
  { id: 'Seafood', name: 'Royyalu (Prawns)', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=300&q=80' },
  { id: 'Tiffins & Dosa', name: 'Ghee Dosa', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80' },
  { id: 'Andhra Meals', name: 'Andhra Meals', img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80' },
  { id: 'Mandi & Kebabs', name: 'Mandi', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80' },
  { id: 'Godavari Ruchulu', name: 'Fish Pulusu', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=300&q=80' },
  { id: 'Tandoori', name: 'Tandoori & Kebab', img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80' },
  { id: 'Pure Veg', name: 'Pure Veg', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80' },
  { id: 'Sweets & Bakery', name: 'Pootharekulu', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80' },
  { id: 'Waffles & Shakes', name: 'Cakes & Shakes', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
  { id: 'Chinese', name: 'Chinese & Momos', img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80' },
];

export const Home = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [pureVegFilter, setPureVegFilter] = useState(false);
  const [fastDeliveryFilter, setFastDeliveryFilter] = useState(false);
  const [offersFilter, setOffersFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const topChainsRef = useRef(null);

  useEffect(() => {
    loadRestaurants();
  }, [selectedCuisine, pureVegFilter, fastDeliveryFilter, offersFilter, ratingFilter, sortBy]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      let sortParam = sortBy;
      if (ratingFilter) sortParam = 'rating';

      const data = await api.getRestaurants({
        search,
        cuisine: selectedCuisine,
        sort: sortParam,
        pureVeg: pureVegFilter,
        fastDelivery: fastDeliveryFilter,
        hasOffers: offersFilter,
      });
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to fetch Bhimavaram restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRestaurants();
  };

  const scrollTopChains = (direction) => {
    if (topChainsRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      topChainsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* 1. "WHAT'S ON YOUR MIND?" CAROUSEL */}
        <div className="pb-10 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#282c3f] tracking-tight">
              What's on your mind?
            </h2>
          </div>

          {/* Horizontal Food Circles */}
          <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none">
            {EASYDINE_CATEGORIES.map((cat, i) => {
              const isSelected = selectedCuisine.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedCuisine(isSelected ? 'all' : cat.id)}
                  className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
                >
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'ring-4 ring-[#fc8019] shadow-lg'
                        : 'border border-gray-100 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-bold mt-2 text-center transition-colors ${
                      isSelected ? 'text-[#fc8019]' : 'text-[#686b78] group-hover:text-black'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. "TOP RESTAURANT CHAINS IN BHIMAVARAM" */}
        <div className="py-10 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#282c3f] tracking-tight">
              Top restaurant chains in Bhimavaram
            </h2>
            {/* Scroll Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTopChains('left')}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTopChains('right')}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Chains Horizontal Slider */}
          <div
            ref={topChainsRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-4 scrollbar-none"
          >
            {restaurants.slice(0, 8).map((rest) => (
              <div key={rest._id} className="w-64 sm:w-72 flex-shrink-0">
                <RestaurantCard restaurant={rest} onSelect={onSelectRestaurant} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. "RESTAURANTS WITH ONLINE FOOD DELIVERY IN BHIMAVARAM" */}
        <div className="py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#282c3f] tracking-tight">
              Restaurants with online food delivery in Bhimavaram
            </h2>

            {/* In-Page Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search restaurant or dish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* FILTER PILLS BAR */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-6 scrollbar-none">
            {/* Filter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-gray-800 bg-white shadow-sm flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </div>

            {/* Sort Dropdown Pill */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-1.5 pr-7 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:border-[#fc8019] cursor-pointer"
              >
                <option value="featured">Sort By: Relevance</option>
                <option value="deliveryTime">Delivery Time</option>
                <option value="rating">Rating: High to Low</option>
                <option value="costLow">Cost: Low to High</option>
                <option value="costHigh">Cost: High to Low</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Fast Delivery Pill */}
            <button
              onClick={() => setFastDeliveryFilter(!fastDeliveryFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${
                fastDeliveryFilter
                  ? 'bg-black text-white border border-black'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Fast Delivery (&lt; 25 mins)
            </button>

            {/* Pure Veg Pill */}
            <button
              onClick={() => setPureVegFilter(!pureVegFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 flex items-center gap-1.5 ${
                pureVegFilter
                  ? 'bg-emerald-700 text-white border border-emerald-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Pure Veg
            </button>

            {/* Offers Pill */}
            <button
              onClick={() => setOffersFilter(!offersFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${
                offersFilter
                  ? 'bg-[#fc8019] text-white border border-[#fc8019]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Offers
            </button>

            {/* Rating 4.0+ Pill */}
            <button
              onClick={() => setRatingFilter(!ratingFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${
                ratingFilter
                  ? 'bg-[#3d9b6d] text-white border border-[#3d9b6d]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Ratings 4.5+
            </button>

            {/* Reset All Filters if any active */}
            {(selectedCuisine !== 'all' || pureVegFilter || fastDeliveryFilter || offersFilter || ratingFilter || search) && (
              <button
                onClick={() => {
                  setSelectedCuisine('all');
                  setPureVegFilter(false);
                  setFastDeliveryFilter(false);
                  setOffersFilter(false);
                  setRatingFilter(false);
                  setSearch('');
                  setSortBy('featured');
                }}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* MAIN RESTAURANTS GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="h-44 bg-gray-200 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#fc8019] flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                🍽️
              </div>
              <h3 className="font-bold text-[#282c3f] text-lg">No restaurants match your filters</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Try resetting your filters or search keywords to see all restaurants in Bhimavaram.
              </p>
              <button
                onClick={() => {
                  setSelectedCuisine('all');
                  setPureVegFilter(false);
                  setFastDeliveryFilter(false);
                  setOffersFilter(false);
                  setRatingFilter(false);
                  setSearch('');
                }}
                className="px-5 py-2.5 bg-[#fc8019] text-white font-bold rounded-xl text-xs shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {restaurants.map((rest) => (
                <RestaurantCard
                  key={rest._id}
                  restaurant={rest}
                  onSelect={onSelectRestaurant}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
