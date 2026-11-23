

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Store,
  UtensilsCrossed,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  ArrowRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard = ({ onGoHome, onTrackOrder }) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'stats'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // New Dish Form Modal State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDish, setNewDish] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    category: 'Pizzas',
    image: '',
    isVeg: true,
    isBestseller: false,
    portionSize: 'Serves 1',
  });

  // New Restaurant Form Modal State
  const [showAddRestModal, setShowAddRestModal] = useState(false);
  const [newRest, setNewRest] = useState({
    name: '',
    description: '',
    cuisines: 'Italian, Pizza',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    deliveryTimeMinutes: 25,
    deliveryFee: 1.99,
    minOrderAmount: 12.0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, restsData, dishesData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAllOrders().catch(() => []),
        api.getRestaurants().catch(() => []),
        api.getDishes().catch(() => []),
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setRestaurants(restsData);
      setDishes(dishesData);

      if (restsData.length > 0 && !newDish.restaurantId) {
        setNewDish((prev) => ({ ...prev, restaurantId: restsData[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, `Admin manual update to ${newStatus}`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createDish(newDish);
      setDishes([created, ...dishes]);
      setShowAddDishModal(false);
      alert('Dish successfully added to menu!');
    } catch (err) {
      alert(`Error creating dish: ${err.message}`);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createRestaurant(newRest);
      setRestaurants([created, ...restaurants]);
      setShowAddRestModal(false);
      alert('Restaurant created successfully!');
    } catch (err) {
      alert(`Error creating restaurant: ${err.message}`);
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Delete this menu dish?')) return;
    try {
      await api.deleteDish(dishId);
      setDishes(dishes.filter((d) => d._id !== dishId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Admin Privileges Required</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Please sign in with an Administrator or Restaurant Manager account.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-300">
                Operations Central
              </span>
              <h1 className="text-2xl font-black">Admin & Partner Dashboard</h1>
              <p className="text-xs text-purple-200">
                Logged in as <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={onGoHome}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Customer View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* KPI Metrics Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Total Platform Sales</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                ₹{stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Orders Placed</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                {stats?.totalOrders ?? orders.length}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Active Kitchens</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                {stats?.activeRestaurants ?? restaurants.length}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Menu Dishes</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                {stats?.totalDishes ?? dishes.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Live Orders Queue ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'menu'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Menu & Dishes ({dishes.length})
          </button>
        </div>

        {/* TAB 1: LIVE ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Incoming Orders Queue</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update preparation & dispatch statuses in real time
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Live Dispatch Center
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs font-bold text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">No orders received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Order ID & Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Restaurant</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gray-800">
                          #{ord._id?.slice(-6)}
                          <span className="block text-[10px] font-sans font-normal text-gray-400">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{ord.customerName}</p>
                          <p className="text-[11px] text-gray-500">{ord.customerPhone}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {ord.restaurantName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {ord.orderItems?.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-gray-900">
                          ₹{ord.totalPrice?.toFixed(2)}
                          <span className="block text-[10px] font-normal text-gray-400">
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            disabled={updatingId === ord._id}
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-sm"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onTrackOrder(ord._id)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Radar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU & DISHES */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Menu & Dish Inventory</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage dishes, pricing, dietary flags and add new kitchen listings
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddRestModal(true)}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Restaurant</span>
                </button>

                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-purple-500/25 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food Dish</span>
                </button>
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <h4 className="font-bold text-xs text-gray-900 truncate">{dish.name}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-purple-700">₹{dish.price?.toFixed(2)}</span>
                    <span className="text-[11px] text-gray-400 block">{dish.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteDish(dish._id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD FOOD DISH */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900 mb-4">Add New Menu Dish</h3>
            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Kitchen</label>
                <select
                  required
                  value={newDish.restaurantId}
                  onChange={(e) => setNewDish({ ...newDish, restaurantId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:bg-white"
                >
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Mac & Cheese"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, flavors and textures..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.99"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Pizzas / Burgers / Bowls"
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL (Unsplash)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newDish.image}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newDish.isVeg}
                    onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newDish.isBestseller}
                    onChange={(e) => setNewDish({ ...newDish, isBestseller: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESTAURANT */}
      {showAddRestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900 mb-4">Add Kitchen Partner</h3>
            <form onSubmit={handleCreateRestaurant} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roma Pizzeria & Pasta"
                  value={newRest.name}
                  onChange={(e) => setNewRest({ ...newRest, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Handmade crusts, pasta and Italian delights..."
                  value={newRest.description}
                  onChange={(e) => setNewRest({ ...newRest, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cuisines (comma separated)</label>
                <input
                  type="text"
                  placeholder="Italian, Pizza, Pasta"
                  value={newRest.cuisines}
                  onChange={(e) => setNewRest({ ...newRest, cuisines: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Delivery Time (mins)</label>
                  <input
                    type="number"
                    value={newRest.deliveryTimeMinutes}
                    onChange={(e) => setNewRest({ ...newRest, deliveryTimeMinutes: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRest.deliveryFee}
                    onChange={(e) => setNewRest({ ...newRest, deliveryFee: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={newRest.image}
                  onChange={(e) => setNewRest({ ...newRest, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRestModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md"
                >
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

