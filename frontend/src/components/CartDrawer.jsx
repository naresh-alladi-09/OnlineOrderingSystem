import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Bike,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const CartDrawer = ({ onNavigateCheckout }) => {
  const {
    cartItems,
    activeRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemsTotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    grandTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    closeCartDrawer,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [deliveryTip, setDeliveryTip] = useState(0);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg(res);
  };

  const finalTotal = Number((grandTotal + deliveryTip).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff2e5] flex items-center justify-center text-[#fc8019] font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#282c3f] text-base">Cart</h3>
                {activeRestaurant && (
                  <p className="text-xs text-[#686b78] truncate max-w-[220px]">
                    {activeRestaurant.name}, Bhimavaram
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 text-[#fc8019] flex items-center justify-center mb-4 text-4xl">
                🛒
              </div>
              <h4 className="text-lg font-black text-[#282c3f] mb-1">Your cart is empty</h4>
              <p className="text-[#686b78] text-xs max-w-xs mb-6">
                You can go to home page to view more restaurants in Bhimavaram.
              </p>
              <button
                onClick={closeCartDrawer}
                className="px-6 py-2.5 bg-[#fc8019] hover:bg-[#e46d0a] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                SEE RESTAURANTS NEAR YOU
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.dishId || item._id} className="pt-3 first:pt-0 flex items-center gap-3">
                    {/* Veg / Non-Veg Icon */}
                    <div
                      className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center p-0.5 flex-shrink-0 ${
                        item.isVeg ? 'border-emerald-600' : 'border-[#8e3a29]'
                      }`}
                    >
                      {item.isVeg ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      ) : (
                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-[#8e3a29]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-[#282c3f] truncate">{item.name}</h5>
                      <p className="text-xs text-gray-500 font-bold mt-0.5">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Swiggy Quantity Stepper */}
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden text-[#3d9b6d] font-black text-xs shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.dishId || item._id, -1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.dishId || item._id, 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.dishId || item._id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Swiggy Delivery Partner Tip */}
                <div className="pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#282c3f] mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Tip your delivery partner in Bhimavaram</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2.5">
                    Thank your delivery partner for helping you receive your food fresh and fast.
                  </p>
                  <div className="flex gap-2">
                    {[10, 20, 30, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDeliveryTip(deliveryTip === amount ? 0 : amount)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black border transition-all ${
                          deliveryTip === amount
                            ? 'bg-orange-50 border-[#fc8019] text-[#fc8019]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="p-4 bg-orange-50/60 border-t border-b border-orange-100">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-emerald-800 text-xs">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Code <strong className="font-black">{couponCode}</strong> applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-emerald-700 underline font-black hover:text-emerald-900"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Apply Coupon (e.g. FEAST20)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#fc8019] font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#282c3f] hover:bg-black text-white rounded-xl text-xs font-black transition-colors"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponMsg && !couponCode && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{couponMsg.message}</p>
                )}
              </div>

              {/* Swiggy Bill Details */}
              <div className="p-4 bg-white border-t border-gray-100 space-y-1.5 text-xs text-[#686b78]">
                <p className="font-black text-xs text-[#282c3f] uppercase tracking-wider mb-2">
                  Bill Details
                </p>

                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-[#282c3f]">₹{itemsTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-gray-400" /> Delivery Fee | Bhimavaram
                  </span>
                  <span className="font-bold text-[#282c3f]">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-black">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {deliveryTip > 0 && (
                  <div className="flex justify-between text-[#fc8019] font-bold">
                    <span>Delivery Tip</span>
                    <span>₹{deliveryTip}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold text-[#282c3f]">₹3.00</span>
                </div>

                <div className="flex justify-between">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="font-bold text-[#282c3f]">₹{taxAmount.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-[#282c3f]">
                  <span>TO PAY</span>
                  <span className="text-[#282c3f] text-base font-black">₹{(finalTotal + 3).toFixed(2)}</span>
                </div>
              </div>

              {/* Swiggy Cancellation Disclaimer */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 leading-tight">
                Review your order and address details to avoid cancellations. 100% refund is not applicable after kitchen accepts order.
              </div>

              {/* Checkout Action */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-400 transition-colors"
                  title="Empty Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    if (onNavigateCheckout) onNavigateCheckout();
                  }}
                  className="flex-1 py-3.5 px-4 bg-[#60b246] hover:bg-[#529a3b] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-between active:scale-[0.99] transition-all"
                >
                  <span>₹{(finalTotal + 3).toFixed(2)}</span>
                  <span className="flex items-center gap-1">
                    <span>PROCEED TO PAY</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
