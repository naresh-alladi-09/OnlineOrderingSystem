import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Store,
  Clock,
  Bike,
  CheckCircle2,
  AlertCircle,
  Phone,
  RefreshCw,
  Search,
  Check,
  ChevronDown,
  ChefHat,
  ArrowRight,
  TrendingUp,
  Package,
  X,
  UserCheck,
} from 'lucide-react';

const BHIMAVARAM_RIDERS = [
  {
    name: 'Kalyan Varma',
    phone: '+91 98495 12389',
    vehicle: 'Hero Splendor - AP 37 CB 9981',
    area: 'Near Someswaram & P.P. Road',
    status: 'Available',
  },
  {
    name: 'Suresh Raju',
    phone: '+91 98492 44321',
    vehicle: 'Honda Activa - AP 37 BV 1244',
    area: 'Near Mavullamma Temple & Main Road',
    status: 'Available',
  },
  {
    name: 'Venkat Rao',
    phone: '+91 94401 77654',
    vehicle: 'TVS Apache - AP 37 DX 5541',
    area: 'Near J.P. Road & Old Bus Stand',
    status: 'Available',
  },
  {
    name: 'Prasad Naidu',
    phone: '+91 99890 33412',
    vehicle: 'Bajaj Pulsar - AP 37 EG 7820',
    area: 'Near SRKR Engineering College',
    status: 'Available',
  },
  {
    name: 'Ravi Kumar',
    phone: '+91 98481 55901',
    vehicle: 'Honda Shine - AP 37 AH 3312',
    area: 'Near Sunday Market & Railway Station',
    status: 'Available',
  },
];

export const RestaurantPartnerDashboard = ({ onGoHome, onTrackOrder }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'new' | 'preparing' | 'delivery'
  const [isOpenForOrders, setIsOpenForOrders] = useState(true);

  // Assign Driver Modal State
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(BHIMAVARAM_RIDERS[0]);
  const [customRider, setCustomRider] = useState({ name: '', phone: '', vehicle: '' });
  const [useCustomRider, setUseCustomRider] = useState(false);
  const [submittingRider, setSubmittingRider] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      loadRestaurantOrdersAndDishes(selectedRestaurant._id);
    }
  }, [selectedRestaurant]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const allRests = await api.getRestaurants();
      setRestaurants(allRests);
      if (allRests.length > 0) {
        setSelectedRestaurant(allRests[0]);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantOrdersAndDishes = async (restId) => {
    try {
      const [allOrders, restDishes] = await Promise.all([
        api.getAllOrders(restId),
        api.getDishes({ restaurantId: restId }),
      ]);
      setOrders(allOrders);
      setDishes(restDishes);
    } catch (err) {
      console.error('Error loading restaurant dashboard data:', err);
    }
  };

  // Status transitions
  const handleAcceptOrder = async (orderId) => {
    try {
      const updated = await api.updateOrderStatus(orderId, 'Confirmed', 'Restaurant accepted order and sent to kitchen');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(`Failed to accept order: ${err.message}`);
    }
  };

  const handleStartCooking = async (orderId) => {
    try {
      const updated = await api.updateOrderStatus(orderId, 'Preparing', 'Chef is cooking food in kitchen');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleConfirmAssignDriver = async (e) => {
    e.preventDefault();
    if (!assignModalOrder) return;
    setSubmittingRider(true);

    try {
      const riderData = useCustomRider ? customRider : selectedRider;
      const updated = await api.assignDriver(assignModalOrder._id, {
        name: riderData.name,
        phone: riderData.phone,
        vehicle: riderData.vehicle,
        status: 'Out for Delivery',
        note: `Dispatched with partner ${riderData.name} (${riderData.vehicle})`,
      });

      setOrders((prev) => prev.map((o) => (o._id === assignModalOrder._id ? updated : o)));
      setAssignModalOrder(null);
    } catch (err) {
      alert(`Failed to assign delivery partner: ${err.message}`);
    } finally {
      setSubmittingRider(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const updated = await api.updateOrderStatus(orderId, 'Delivered', 'Delivered to customer doorstep');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(`Failed to complete order: ${err.message}`);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'new') return o.orderStatus === 'Placed';
    if (orderFilter === 'preparing') return o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing';
    if (orderFilter === 'delivery') return o.orderStatus === 'Out for Delivery';
    return true;
  });

  // Calculate metrics for selected restaurant
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'Placed').length;
  const preparingCount = orders.filter((o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing').length;

  return (
    <div className="min-h-screen pb-24 bg-[#f4f5f7]">
      {/* Top EasyDine Partner Header */}
      <div className="bg-[#282c3f] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e46d0a] to-[#fc8019] text-white flex items-center justify-center font-black text-xl shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#fc8019] bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800">
                  EasyDine Restaurant Partner
                </span>
                <span className="text-[10px] text-gray-400 font-bold">• Bhimavaram Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Restaurant Order & Kitchen Manager
              </h1>
            </div>
          </div>

          {/* Restaurant Switcher Dropdown */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Active Restaurant Outlet:
              </label>
              <select
                value={selectedRestaurant?._id || ''}
                onChange={(e) => {
                  const found = restaurants.find((r) => r._id === e.target.value);
                  if (found) setSelectedRestaurant(found);
                }}
                className="w-full bg-[#1c1f2e] border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#fc8019] cursor-pointer"
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.address?.street?.split(',')[0] || 'Bhimavaram'})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (selectedRestaurant) loadRestaurantOrdersAndDishes(selectedRestaurant._id);
              }}
              className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white text-xs font-bold transition-colors self-end"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onGoHome}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors self-end"
            >
              Customer App
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* OUTLET STATUS & METRICS STRIP */}
        {selectedRestaurant && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#282c3f]">{selectedRestaurant.name}</h2>
                <span className="text-xs bg-orange-50 text-[#fc8019] px-2 py-0.5 rounded-md font-bold">
                  ★ {selectedRestaurant.rating}
                </span>
              </div>
              <p className="text-xs text-[#686b78] mt-1">
                {selectedRestaurant.address?.street}, Bhimavaram • {selectedRestaurant.cuisines?.join(', ')}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
              <div className="bg-orange-50/70 border border-orange-100 p-3 rounded-2xl text-center min-w-[100px]">
                <span className="text-[10px] text-gray-500 block uppercase">New Orders</span>
                <span className="text-base font-black text-[#fc8019]">{pendingCount}</span>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl text-center min-w-[100px]">
                <span className="text-[10px] text-gray-500 block uppercase">In Kitchen</span>
                <span className="text-base font-black text-blue-600">{preparingCount}</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl text-center min-w-[120px]">
                <span className="text-[10px] text-gray-500 block uppercase">Total Sales</span>
                <span className="text-base font-black text-emerald-700">₹{totalRevenue.toFixed(2)}</span>
              </div>

              {/* Online/Offline Toggle */}
              <button
                onClick={() => setIsOpenForOrders(!isOpenForOrders)}
                className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-sm transition-all ${
                  isOpenForOrders
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isOpenForOrders ? 'bg-white animate-pulse' : 'bg-red-200'}`} />
                <span>{isOpenForOrders ? 'ACCEPTING ORDERS' : 'STORE PAUSED'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTROLS */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'orders'
                ? 'bg-[#282c3f] text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Orders Queue ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'menu'
                ? 'bg-[#282c3f] text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Menu Items & Stock ({dishes.length})
          </button>
        </div>

        {/* TAB 1: ORDERS QUEUE & RIDER ASSIGNMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Status Filter Sub-bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === 'all'
                    ? 'bg-[#fc8019] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('new')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderFilter === 'new'
                    ? 'bg-[#fc8019] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                New / Needs Acceptance ({pendingCount})
              </button>
              <button
                onClick={() => setOrderFilter('preparing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === 'preparing'
                    ? 'bg-[#fc8019] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                In Kitchen ({preparingCount})
              </button>
              <button
                onClick={() => setOrderFilter('delivery')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === 'delivery'
                    ? 'bg-[#fc8019] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Out for Delivery
              </button>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#fc8019] flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                  📋
                </div>
                <h4 className="font-black text-[#282c3f] text-base">No orders in this queue</h4>
                <p className="text-xs text-gray-500 mt-1">
                  New orders placed for {selectedRestaurant?.name} will appear here with instant alerts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredOrders.map((ord) => {
                  const isPlaced = ord.orderStatus === 'Placed';
                  const isCooking = ord.orderStatus === 'Confirmed' || ord.orderStatus === 'Preparing';
                  const isOut = ord.orderStatus === 'Out for Delivery';
                  const isDelivered = ord.orderStatus === 'Delivered';

                  return (
                    <div
                      key={ord._id}
                      className={`bg-white rounded-3xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                        isPlaced
                          ? 'border-orange-400 ring-2 ring-orange-100 shadow-md'
                          : 'border-gray-200'
                      }`}
                    >
                      <div>
                        {/* Order Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                          <div>
                            <span className="font-mono font-black text-sm text-[#282c3f]">
                              #{ord._id?.slice(-6)}
                            </span>
                            <span className="text-[11px] text-gray-400 block">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              isPlaced
                                ? 'bg-orange-500 text-white animate-pulse'
                                : isCooking
                                ? 'bg-blue-600 text-white'
                                : isOut
                                ? 'bg-purple-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="space-y-1 text-xs mb-3">
                          <p className="font-black text-[#282c3f]">
                            Customer: <span className="font-semibold">{ord.customerName}</span> ({ord.customerPhone})
                          </p>
                          <p className="text-gray-500 truncate">
                            📍 {ord.deliveryAddress?.street}, Bhimavaram
                          </p>
                          {ord.deliveryAddress?.instructions && (
                            <p className="text-orange-600 italic text-[11px] bg-orange-50 p-1.5 rounded-lg">
                              Note: "{ord.deliveryAddress.instructions}"
                            </p>
                          )}
                        </div>

                        {/* Order Items List */}
                        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 mb-3 space-y-1.5 text-xs">
                          {ord.orderItems?.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">
                                {it.quantity} × {it.name}
                              </span>
                              <span className="font-bold text-gray-900">
                                ₹{(it.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}

                          <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-sm text-[#282c3f]">
                            <span>Bill Total:</span>
                            <span className="text-emerald-700">₹{ord.totalPrice?.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Assigned Driver Details (if assigned) */}
                        {ord.driverInfo && (isOut || isDelivered) && (
                          <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-xs mb-3 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-purple-700 block">
                                Assigned Rider:
                              </span>
                              <p className="font-black text-purple-900">{ord.driverInfo.name}</p>
                              <p className="text-[11px] text-purple-700">{ord.driverInfo.vehicle}</p>
                            </div>
                            <a
                              href={`tel:${ord.driverInfo.phone}`}
                              className="p-2 bg-white rounded-lg text-purple-700 shadow-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                        {isPlaced && (
                          <button
                            onClick={() => handleAcceptOrder(ord._id)}
                            className="flex-1 py-2.5 px-3 bg-[#60b246] hover:bg-[#529a3b] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ACCEPT ORDER</span>
                          </button>
                        )}

                        {ord.orderStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleStartCooking(ord._id)}
                            className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <ChefHat className="w-4 h-4" />
                            <span>START COOKING</span>
                          </button>
                        )}

                        {isCooking && (
                          <button
                            onClick={() => setAssignModalOrder(ord)}
                            className="flex-1 py-2.5 px-3 bg-[#fc8019] hover:bg-[#e46d0a] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Bike className="w-4 h-4" />
                            <span>ASSIGN DELIVERY PARTNER</span>
                          </button>
                        )}

                        {isOut && (
                          <button
                            onClick={() => handleMarkDelivered(ord._id)}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>MARK DELIVERED</span>
                          </button>
                        )}

                        <button
                          onClick={() => onTrackOrder(ord._id)}
                          className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Live Radar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU & DISHES AVAILABILITY */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-black text-base text-[#282c3f]">
                  Menu Inventory for {selectedRestaurant?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Toggle items in-stock or sold-out in real time for EasyDine customers in Bhimavaram
                </p>
              </div>
              <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-xl text-gray-700">
                {dishes.length} Items Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 hover:shadow-sm"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <h4 className="font-bold text-xs text-gray-900 truncate">{dish.name}</h4>
                    </div>
                    <span className="text-xs font-black text-[#fc8019]">₹{dish.price}</span>
                    <span className="text-[10px] text-gray-400 block">{dish.category}</span>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black border border-emerald-200">
                    IN STOCK
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ASSIGN DELIVERY PARTNER IN BHIMAVARAM */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#fc8019] flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#282c3f]">
                    Assign Delivery Partner
                  </h3>
                  <p className="text-xs text-gray-500">
                    Order #{assignModalOrder._id?.slice(-6)} • {assignModalOrder.customerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalOrder(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignDriver} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-black text-[#282c3f] mb-2">
                  Choose Available Bhimavaram Fleet Rider:
                </label>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {BHIMAVARAM_RIDERS.map((rider, idx) => (
                    <label
                      key={idx}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        !useCustomRider && selectedRider.name === rider.name
                          ? 'border-[#fc8019] bg-orange-50/60 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="fleetRider"
                          checked={!useCustomRider && selectedRider.name === rider.name}
                          onChange={() => {
                            setSelectedRider(rider);
                            setUseCustomRider(false);
                          }}
                          className="text-[#fc8019] focus:ring-[#fc8019]"
                        />
                        <div>
                          <p className="font-black text-[#282c3f]">{rider.name}</p>
                          <p className="text-[11px] text-gray-500">{rider.vehicle}</p>
                          <p className="text-[10px] text-[#fc8019] font-bold">📍 {rider.area}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {rider.status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Rider Option */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomRider}
                    onChange={(e) => setUseCustomRider(e.target.checked)}
                    className="rounded text-[#fc8019] focus:ring-[#fc8019]"
                  />
                  <span>Assign Custom / In-House Restaurant Rider</span>
                </label>

                {useCustomRider && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Rider Name"
                      value={customRider.name}
                      onChange={(e) => setCustomRider({ ...customRider, name: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone (+91)"
                      value={customRider.phone}
                      onChange={(e) => setCustomRider({ ...customRider, phone: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Bike Plate No."
                      value={customRider.vehicle}
                      onChange={(e) => setCustomRider({ ...customRider, vehicle: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAssignModalOrder(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-xs text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRider}
                  className="flex-1 py-3 bg-[#60b246] hover:bg-[#529a3b] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{submittingRider ? 'DISPATCHING...' : 'DISPATCH RIDER'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPartnerDashboard;

