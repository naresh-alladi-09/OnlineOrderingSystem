import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('feastify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeRestaurant, setActiveRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('feastify_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('feastify_cart', JSON.stringify(cartItems));
    localStorage.setItem('feastify_cart_restaurant', JSON.stringify(activeRestaurant));
  }, [cartItems, activeRestaurant]);

  const addToCart = (dish, restaurant) => {
    // If cart has items from another restaurant, ask or reset
    if (activeRestaurant && activeRestaurant._id !== restaurant._id && cartItems.length > 0) {
      const proceed = window.confirm(
        `Your cart contains items from "${activeRestaurant.name}". Start a fresh cart from "${restaurant.name}"?`
      );
      if (!proceed) return false;
      setCartItems([{ ...dish, quantity: 1, dishId: dish._id }]);
      setActiveRestaurant(restaurant);
      setIsCartDrawerOpen(true);
      return true;
    }

    setActiveRestaurant(restaurant);
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => (item.dishId || item._id) === dish._id);
      if (existing) {
        return prevItems.map((item) =>
          (item.dishId || item._id) === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1, dishId: dish._id }];
    });
    setIsCartDrawerOpen(true);
    return true;
  };

  const updateQuantity = (dishId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if ((item.dishId || item._id) === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (dishId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.dishId || item._id) !== dishId));
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveRestaurant(null);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FEAST20') {
      setCouponCode('FEAST20');
      setCouponDiscount(0.20); // 20%
      return { success: true, message: '🎉 FEAST20 applied! 20% off your food order.' };
    } else if (clean === 'FREESHIP') {
      setCouponCode('FREESHIP');
      setCouponDiscount('FREE_SHIPPING');
      return { success: true, message: '🚚 FREESHIP applied! Free delivery in Bhimavaram.' };
    } else if (clean === 'SAVE50') {
      setCouponCode('SAVE50');
      setCouponDiscount(50.0);
      return { success: true, message: '💰 SAVE50 applied! ₹50 flat discount.' };
    } else {
      return { success: false, message: 'Invalid promo code. Try FEAST20, FREESHIP or SAVE50!' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
  };

  const itemsTotal = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );

  let deliveryFee = 0;
  if (cartItems.length > 0) {
    if (couponDiscount === 'FREE_SHIPPING' || itemsTotal > 399) {
      deliveryFee = 0;
    } else {
      deliveryFee = activeRestaurant?.deliveryFee || 30;
    }
  }

  const taxAmount = Number((itemsTotal * 0.05).toFixed(2));

  let discountAmount = 0;
  if (couponDiscount === 'FREE_SHIPPING') {
    discountAmount = 0; // Handled via 0 delivery fee
  } else if (typeof couponDiscount === 'number' && couponDiscount > 0 && couponDiscount < 1) {
    discountAmount = Number((itemsTotal * couponDiscount).toFixed(2));
  } else if (typeof couponDiscount === 'number' && couponDiscount >= 1) {
    discountAmount = Math.min(itemsTotal, couponDiscount);
  }

  const grandTotal = Number(
    Math.max(0, itemsTotal + deliveryFee + taxAmount - discountAmount).toFixed(2)
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        activeRestaurant,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        itemsTotal,
        deliveryFee,
        taxAmount,
        discountAmount,
        grandTotal,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

