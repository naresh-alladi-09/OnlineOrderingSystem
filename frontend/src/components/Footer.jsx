import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#02060c] text-gray-400 border-t border-gray-900 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top App Download & Logo Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fc8019] flex items-center justify-center text-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.19 2.58 7.78 6.27 9.27.42.08.57-.18.57-.41v-1.46c-2.52.55-3.05-1.22-3.05-1.22-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.91.06 1.39.93 1.39.93.81 1.39 2.12.99 2.64.76.08-.59.32-.99.58-1.22-2.01-.23-4.13-1.01-4.13-4.48 0-.99.35-1.8 1-2.44-.09-.23-.43-1.15.09-2.4 0 0 .76-.24 2.5 1.05.73-.2 1.5-.3 2.27-.3.77 0 1.54.1 2.27.3 1.74-1.29 2.5-1.05 2.5-1.05.52 1.25.18 2.17.09 2.4.65.64 1 1.45 1 2.44 0 3.48-2.12 4.25-4.14 4.47.33.28.62.84.62 1.69v2.51c0 .23.15.5.58.41C19.42 19.78 22 16.19 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">SWIGGY</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#fc8019] -mt-1">
                Bhimavaram Live
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white font-bold text-sm">For an enhanced food ordering experience in Bhimavaram</p>
            <p className="text-gray-500 text-xs mt-0.5">Delivery to all major areas across West Godavari</p>
          </div>
        </div>

        {/* 4 Column Swiggy Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-gray-800">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Swiggy Corporate</li>
              <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Team</li>
              <li className="hover:text-white transition-colors cursor-pointer">Swiggy One</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Help & Support</li>
              <li className="hover:text-white transition-colors cursor-pointer">Partner with Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Ride with Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">We Deliver to in Bhimavaram</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">P.P. Road & Someswaram</li>
              <li className="hover:text-white transition-colors cursor-pointer">Mavullamma Temple Area</li>
              <li className="hover:text-white transition-colors cursor-pointer">J.P. Road & Old Bus Stand</li>
              <li className="hover:text-white transition-colors cursor-pointer">SRKR Engineering College</li>
              <li className="hover:text-white transition-colors cursor-pointer">DNR College Road</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Popular Cuisines</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Bhimavaram Royyala Pulao</li>
              <li className="hover:text-white transition-colors cursor-pointer">Godavari Natukodi Biryani</li>
              <li className="hover:text-white transition-colors cursor-pointer">Andhra Butta Bhojanam</li>
              <li className="hover:text-white transition-colors cursor-pointer">Arabian Mandi Platters</li>
              <li className="hover:text-white transition-colors cursor-pointer">Ghee Karam Dosa</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Swiggy Bhimavaram. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the foodies of Bhimavaram
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
