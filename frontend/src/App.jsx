import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { OrderHistory } from './pages/OrderHistory';
import { AdminDashboard } from './pages/AdminDashboard';
import { RestaurantPartnerDashboard } from './pages/RestaurantPartnerDashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('order_bvr_101');
  const [initialTrackingOrder, setInitialTrackingOrder] = useState(null);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order) => {
    setTrackingOrderId(order._id);
    setInitialTrackingOrder(order);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackSpecificOrder = (orderId) => {
    setTrackingOrderId(orderId);
    setInitialTrackingOrder(null);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#282c3f] selection:bg-[#fc8019] selection:text-white">
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectRestaurant={handleSelectRestaurant}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <Home onSelectRestaurant={handleSelectRestaurant} />
        )}

        {currentView === 'restaurant' && selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={() => setCurrentView('home')}
            onNavigateCheckout={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            onBack={() => {
              if (selectedRestaurant) setCurrentView('restaurant');
              else setCurrentView('home');
            }}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTracking
            orderId={trackingOrderId}
            initialOrder={initialTrackingOrder}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'orders' && (
          <OrderHistory
            onTrackOrder={handleTrackSpecificOrder}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onGoHome={() => setCurrentView('home')}
            onTrackOrder={handleTrackSpecificOrder}
          />
        )}

        {currentView === 'partner' && (
          <RestaurantPartnerDashboard
            onGoHome={() => setCurrentView('home')}
            onTrackOrder={handleTrackSpecificOrder}
          />
        )}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer onNavigateCheckout={() => setCurrentView('checkout')} />
      <LoginModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
