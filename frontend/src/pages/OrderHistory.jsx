import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, ArrowRight, ShoppingBag, MapPin, CheckCircle, RefreshCw } from 'lucide-react';

export const OrderHistory = ({ onTrackOrder, onGoHome }) => {
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your orders</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Access your past feasts, live delivery status, and one-click reordering.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse';
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-600" />
              My Orders & History
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track live food deliveries or review your favorite past orders
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-orange-600 shadow-sm transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              📦
            </div>
            <h3 className="font-bold text-gray-900 text-base">No orders yet</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">
              You haven't placed any food orders yet. Start exploring delicious restaurants!
            </p>
            <button
              onClick={onGoHome}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-base text-gray-900">
                      {order.restaurantName}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {' • '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>

                  {/* Summary of items */}
                  <div className="text-xs text-gray-700">
                    <span className="font-semibold">Items: </span>
                    <span>
                      {order.orderItems?.map((it) => `${it.name} (×${it.quantity})`).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                    <span>
                      Total Paid: <strong className="text-gray-900 font-extrabold">₹{order.totalPrice?.toFixed(2)}</strong>
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[11px] font-bold text-gray-500">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button
                    onClick={() => onTrackOrder(order._id)}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

