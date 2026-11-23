import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  Package,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Search,
  Percent,
  HelpCircle,
  Store,
  UtensilsCrossed,
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onSelectRestaurant, onSearchClick }) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bhimavaramAreas = [
    { name: 'P.P. Road & Someswaram', desc: 'Famous for D-Vindhu & Sri Kanya' },
    { name: 'Mavullamma Temple Area', desc: 'Main Road & Grand Arya' },
    { name: 'J.P. Road & Old Bus Stand', desc: 'Harsha Delicacy & Clock Tower' },
    { name: 'SRKR Engineering College', desc: 'Undi Bypass & Seven Spices' },
    { name: 'DNR College Road', desc: 'Sunday Market & Babai Tiffins' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-[0_15px_40px_-20px_rgba(40,44,63,0.15)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: EasyDine Logo & Bhimavaram Location Selector */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* EasyDine Logo */}
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 group text-left hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e46d0a] to-[#fc8019] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#282c3f] leading-none">
                  Easy<span className="text-[#fc8019]">Dine</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mt-0.5">
                  Bhimavaram
                </span>
              </div>
            </button>

            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#fc8019] transition-colors py-1 group"
              >
                <span className="font-extrabold text-[#282c3f] border-b-2 border-black group-hover:border-[#fc8019] group-hover:text-[#fc8019] text-sm">
                  Bhimavaram
                </span>
                <span className="text-gray-500 font-medium truncate max-w-[150px] hidden sm:inline">
                  Andhra Pradesh, India
                </span>
                <ChevronDown className="w-4 h-4 text-[#fc8019] ml-0.5 transition-transform group-hover:translate-y-0.5" />
              </button>

              {/* Location Dropdown Modal */}
              {locationDropdownOpen && (
                <div className="absolute left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-fadeIn">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                    Select Your Area in Bhimavaram
                  </p>
                  <div className="mt-1 divide-y divide-gray-50">
                    {bhimavaramAreas.map((area, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLocationDropdownOpen(false)}
                        className="p-2 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#fc8019]" />
                          {area.name}
                        </p>
                        <p className="text-[11px] text-gray-500 pl-5">{area.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-6 sm:gap-8 font-semibold text-sm text-[#3d4152]">
            {/* Search */}
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="hidden lg:flex items-center gap-2 hover:text-[#fc8019] transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Offers */}
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 450, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-2 hover:text-[#fc8019] transition-colors relative"
            >
              <Percent className="w-4 h-4 text-[#fc8019]" />
              <span>Offers</span>
              <span className="text-[9px] font-black text-[#fc8019] uppercase bg-orange-100 px-1 rounded-sm -mt-3 -ml-1">
                NEW
              </span>
            </button>

            {/* Restaurant Partner Dashboard Switcher */}
            <button
              onClick={() => setCurrentView('partner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'partner'
                  ? 'bg-[#fc8019] text-white shadow-sm'
                  : 'bg-orange-50 text-[#fc8019] hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Restaurant Dashboard</span>
            </button>

            {/* Admin Portal Toggle */}
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 hover:text-[#fc8019] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#fc8019] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline text-xs font-bold text-gray-800">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-100 text-[#fc8019]">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentView('orders')}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-[#fc8019] flex items-center gap-2 font-medium"
                    >
                      <Package className="w-4 h-4" />
                      Orders in Bhimavaram
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setCurrentView('admin')}
                        className="w-full text-left px-4 py-2.5 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-2 hover:text-[#fc8019] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Button with EasyDine Badge */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2 font-bold hover:text-[#fc8019] transition-colors relative"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#fc8019] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
