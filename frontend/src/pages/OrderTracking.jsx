import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  ShoppingBag,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Home,
  ShieldCheck,
} from 'lucide-react';

const STAGES = [
  { key: 'Placed', label: 'Order Placed', desc: 'Received & sent to restaurant', icon: ShoppingBag },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2 },
  { key: 'Preparing', label: 'Food Being Prepared', desc: 'Chef cooking fresh in Bhimavaram', icon: ChefHat },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your door', icon: Bike },
  { key: 'Delivered', label: 'Order Delivered', desc: 'Enjoy your delicious feast!', icon: Sparkles },
];

export const OrderTracking = ({ orderId, initialOrder, onGoHome }) => {
  const [order, setOrder] = useState(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
      const interval = setInterval(loadOrder, 6000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await api.getOrderById(orderId || initialOrder?._id);
      if (data) setOrder(data);
    } catch (err) {
      console.error('Error fetching order update:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status) => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = order ? getStageIndex(order.orderStatus) : 0;

  const handleSimulateNext = async () => {
    if (!order) return;
    const nextIdx = (currentIdx + 1) % STAGES.length;
    const nextStatus = STAGES[nextIdx].key;

    setSimulating(true);
    try {
      const updated = await api.updateOrderStatus(order._id, nextStatus, `Swiggy radar update: ${nextStatus}`);
      setOrder(updated);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#fc8019] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-600">Connecting to Bhimavaram Live Kitchen Radar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#f1f1f6]">
      {/* Top Banner (Swiggy Style) */}
      <div className="bg-[#282c3f] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-1">
              <span>Order #{order._id?.slice(-8) || 'SWIGGY-BVR'}</span>
              <span>•</span>
              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {order.orderStatus === 'Delivered'
                ? 'Delivered & Completed!'
                : `Arriving in ${order.estimatedDeliveryTime || '20-25 mins'}`}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Ordering from <strong className="text-white">{order.restaurantName}</strong>, Bhimavaram
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrder}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={onGoHome}
              className="px-4 py-2.5 bg-[#fc8019] hover:bg-[#e46d0a] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Explore Restaurants</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Swiggy Simulator Ribbon */}
        <div className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#fc8019] flex items-center justify-center font-black text-sm shadow">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-sm">Interactive Delivery Simulator</h4>
              <p className="text-xs text-orange-100">
                Advance through order stages: <strong className="text-white underline">{order.orderStatus}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateNext}
            disabled={simulating}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-orange-50 text-gray-900 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>Advance to Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-black text-[#fc8019] uppercase tracking-wider">
                Live Kitchen Radar
              </span>
              <h3 className="text-lg font-black text-[#282c3f] mt-0.5">
                {STAGES[currentIdx]?.label}
              </h3>
              <p className="text-xs text-gray-500">{STAGES[currentIdx]?.desc}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 font-bold block">Status</span>
              <span className="text-sm font-black text-[#3d9b6d] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Stepper Line & Nodes */}
          <div className="relative">
            <div className="absolute top-5 left-6 right-6 h-1 bg-gray-100 -z-0" />
            <div
              className="absolute top-5 left-6 h-1 bg-[#60b246] transition-all duration-700 -z-0"
              style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-5 relative z-10">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isPassed
                          ? 'bg-[#60b246] text-white shadow-md'
                          : isCurrent
                          ? 'bg-[#fc8019] text-white ring-4 ring-orange-200 shadow-lg scale-110 animate-pulse'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h5
                      className={`text-xs font-bold mt-3 leading-tight ${
                        isCurrent
                          ? 'text-[#fc8019]'
                          : isPassed
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.label}
                    </h5>
                    <span className="text-[10px] text-gray-400 hidden sm:block mt-0.5">
                      {stage.desc.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#fc8019] flex items-center justify-center text-2xl font-black">
              🚴‍♂️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fc8019]">
                Swiggy Delivery Partner • Bhimavaram
              </span>
              <h4 className="text-base font-black text-[#282c3f]">
                {order.driverInfo?.name || 'Kalyan Varma'}
              </h4>
              <p className="text-xs text-gray-500">
                {order.driverInfo?.vehicle || 'Hero Splendor - AP 37 CB 9981'}
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.driverInfo?.phone || '+919849512389'}`}
            className="px-5 py-2.5 bg-[#3d9b6d] hover:bg-[#34865e] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Rider ({order.driverInfo?.phone || '+91 98495 12389'})</span>
          </a>
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ordered Items */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h4 className="font-black text-sm text-[#282c3f]">
              Ordered Items ({order.orderItems?.length})
            </h4>

            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-gray-400">×{item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-bold text-gray-900">₹{order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-gray-900">
                  {order.deliveryPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.deliveryPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST & Charges</span>
                <span className="font-bold text-gray-900">₹{order.taxPrice?.toFixed(2)}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-₹{order.discountPrice?.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-[#282c3f]">
                <span>Total Paid</span>
                <span className="text-lg font-black text-[#282c3f]">₹{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Destination Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h4 className="font-black text-sm text-[#282c3f]">Delivery Location</h4>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-black text-gray-900">
                <MapPin className="w-4 h-4 text-[#fc8019]" />
                <span>{order.customerName}</span>
              </div>
              <p className="text-gray-600 pl-5.5">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.zipCode}
              </p>
              {order.deliveryAddress?.instructions && (
                <p className="text-gray-400 italic pl-5.5 pt-1">
                  Note: "{order.deliveryAddress.instructions}"
                </p>
              )}
            </div>

            <div className="pt-2">
              <h5 className="font-black text-xs text-gray-700 mb-2">Payment Details</h5>
              <div className="flex items-center justify-between text-xs p-3 bg-orange-50/70 border border-orange-100 rounded-xl">
                <span className="font-semibold text-gray-700">Mode:</span>
                <span className="font-black text-[#fc8019] uppercase">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>

            <div className="pt-2">
              <h5 className="font-black text-xs text-gray-700 mb-1">Status History Timeline</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto text-[11px] text-gray-500">
                {order.statusHistory?.map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-1">
                    <span className="font-semibold text-gray-800">{h.status}</span>
                    <span className="text-gray-400">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
