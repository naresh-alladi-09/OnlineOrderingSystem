import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginModal = () => {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(authModal.mode !== 'register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@feastify.com',
        password: 'admin123',
        name: 'Platform Admin',
        phone: '',
        role: 'admin',
      });
      setIsLoginMode(true);
    } else {
      setFormData({
        email: 'user@feastify.com',
        password: 'user123',
        name: 'Demo Customer',
        phone: '',
        role: 'customer',
      });
      setIsLoginMode(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {isLoginMode ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-orange-100 text-xs mt-0.5">
              {isLoginMode ? 'Sign in to order your favorite cravings' : 'Join Feastify for special food perks & discounts'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Quick-Fill Bar */}
        <div className="bg-orange-50 px-6 py-2.5 border-b border-orange-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-orange-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Quick Demo:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="px-2.5 py-1 bg-white hover:bg-orange-100 text-orange-800 rounded-md font-medium border border-orange-200 transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {error}
            </div>
          )}

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+1 (555) 012-3456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? 'Processing...' : isLoginMode ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              {isLoginMode ? "Don't have an account? Create one" : 'Already registered? Sign in instead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

