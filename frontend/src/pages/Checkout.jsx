import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Tag,
  AlertCircle,
  Bike,
  Heart,
  Home,
  Briefcase,
} from 'lucide-react';

export const Checkout = ({ onBack, onOrderPlaced }) => {
  const { user } = useAuth();
  const {
    cartItems,
    activeRestaurant,
    itemsTotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    grandTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [addressType, setAddressType] = useState('Home');
  const [contactData, setContactData] = useState({
    name: user?.name || 'Ravi Teja Varma',
    email: user?.email || 'user@easydine.com',
    phone: user?.phone || '+91 99490 88776',
  });

  const [addressData, setAddressData] = useState({
    street: user?.addresses?.[0]?.street || 'Door No 4-12, Near Someswara Temple, P.P. Road',
    city: 'Bhimavaram',
    state: 'Andhra Pradesh',
    zipCode: '534201',
    instructions: 'Leave at door and ring bell.',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const [deliveryTip, setDeliveryTip] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-[#fc8019] flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          🛒
        </div>
        <h2 className="text-xl font-black text-[#282c3f]">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#fc8019] text-white font-black rounded-xl text-xs hover:bg-[#e46d0a] transition-colors"
        >
          SEE RESTAURANTS IN BHIMAVARAM
        </button>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoMsg(res);
  };

  const finalPayable = Number((grandTotal + deliveryTip + 3).toFixed(2));

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!contactData.name || !contactData.phone) {
      setError('Please provide your name and phone number for delivery contact.');
      return;
    }

    if (!addressData.street) {
      setError('Please specify your delivery address in Bhimavaram.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderItems: cartItems,
        restaurantId: activeRestaurant?._id,
        restaurantName: activeRestaurant?.name || 'Bhimavaram Partner Restaurant',
        customerName: contactData.name,
        customerEmail: contactData.email || 'guest@easydine.com',
        customerPhone: contactData.phone,
        deliveryAddress: addressData,
        paymentMethod,
        couponCode,
        specialNotes: addressData.instructions,
      };

      const newOrder = await api.createOrder(payload);
      clearCart();
      onOrderPlaced(newOrder);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f1f1f6]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#fc8019] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
          <span className="text-xs font-black text-[#282c3f] uppercase tracking-wider">
            Secure Checkout • Bhimavaram
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Delivery Address & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-base text-[#282c3f] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#282c3f] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Delivery Address in Bhimavaram
                </h3>
              </div>

              {/* Address Category Tag */}
              <div className="flex gap-3 mb-4">
                {['Home', 'Work', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      addressType === type
                        ? 'bg-[#282c3f] text-white shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'Home' && <Home className="w-3.5 h-3.5" />}
                    {type === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                    {type === 'Other' && <MapPin className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">House / Flat / Landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Door No 4-12, Near Someswara Temple, P.P. Road"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fc8019] text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">City / Mandal</label>
                    <input
                      type="text"
                      readOnly
                      value="Bhimavaram, West Godavari"
                      className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={addressData.zipCode}
                      onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1">Delivery Instructions for Rider</label>
                  <input
                    type="text"
                    placeholder="e.g. Call upon arrival, leave with security at gate"
                    value={addressData.instructions}
                    onChange={(e) => setAddressData({ ...addressData, instructions: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Customer Contact */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h3 className="font-black text-base text-[#282c3f] flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#282c3f] text-white flex items-center justify-center text-xs font-black">
                  2
                </span>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h3 className="font-black text-base text-[#282c3f] flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#282c3f] text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                Payment Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#fc8019] bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-[#fc8019]" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-[#fc8019] focus:ring-[#fc8019]"
                    />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-[#282c3f]">UPI / Google Pay</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">PhonePe, GPay, Paytm</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#fc8019] bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-[#fc8019] focus:ring-[#fc8019]"
                    />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-[#282c3f]">Pay on Delivery</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Cash or QR scan at door</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#fc8019] bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-[#fc8019] focus:ring-[#fc8019]"
                    />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-[#282c3f]">Debit / Credit Card</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, RuPay</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Items & Price Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-4">
              {/* Restaurant Header */}
              {activeRestaurant && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <img
                    src={activeRestaurant.image}
                    alt={activeRestaurant.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-black text-sm text-[#282c3f]">{activeRestaurant.name}</h4>
                    <p className="text-[11px] text-gray-500">{activeRestaurant.address?.street}, Bhimavaram</p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.dishId || item._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-gray-800 truncate max-w-[170px]">{item.name}</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Bar */}
              <div className="pt-2 border-t border-gray-100">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-emerald-800 text-xs">
                    <span className="font-bold">Code {couponCode} applied</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-emerald-700 underline font-black"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. FEAST20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#fc8019]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#282c3f] text-white rounded-xl text-xs font-black hover:bg-black"
                    >
                      APPLY
                    </button>
                  </div>
                )}
                {promoMsg && !couponCode && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{promoMsg.message}</p>
                )}
              </div>

              {/* Delivery Partner Tip Selector */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    Delivery Tip (Rider in Bhimavaram)
                  </span>
                  <span className="text-[#fc8019] font-black">₹{deliveryTip}</span>
                </div>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDeliveryTip(t)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        deliveryTip === t
                          ? 'bg-orange-50 border-[#fc8019] text-[#fc8019]'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      ₹{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* EasyDine Bill Details */}
              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-[#686b78]">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-[#282c3f]">₹{itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-gray-400" /> Delivery Fee
                  </span>
                  <span className="font-bold text-[#282c3f]">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-black">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold text-[#282c3f]">₹3.00</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="font-bold text-[#282c3f]">₹{taxAmount.toFixed(2)}</span>
                </div>
                {deliveryTip > 0 && (
                  <div className="flex justify-between text-[#fc8019] font-bold">
                    <span>Delivery Partner Tip</span>
                    <span>₹{deliveryTip.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Savings</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-[#282c3f]">
                  <span>TO PAY</span>
                  <span className="text-[#282c3f] text-lg font-black">₹{finalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* EasyDine Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#60b246] hover:bg-[#529a3b] text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.99] disabled:opacity-60 text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {submitting ? (
                  <span>CONNECTING TO RESTAURANT...</span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>PAY ₹{finalPayable.toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Secure payments • Instant doorstep delivery in Bhimavaram
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
