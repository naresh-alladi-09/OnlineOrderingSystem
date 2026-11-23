import React from 'react';
import { Heart, UtensilsCrossed } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#02060c] text-gray-400 border-t border-gray-900 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top App Download & Logo Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e46d0a] to-[#fc8019] flex items-center justify-center text-white shadow-lg">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                Easy<span className="text-[#fc8019]">Dine</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#fc8019] -mt-1">
                Bhimavaram Live
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white font-bold text-sm">For an enhanced food ordering experience in Bhimavaram</p>
            <p className="text-gray-500 text-xs mt-0.5">Fast delivery from top local restaurants across West Godavari</p>
          </div>
        </div>

        {/* 4 Column Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-gray-800">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">EasyDine Corporate</li>
              <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Team</li>
              <li className="hover:text-white transition-colors cursor-pointer">EasyDine Pro</li>
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
          <p>© {new Date().getFullYear()} EasyDine Technologies (Bhimavaram). All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the foodies of Bhimavaram
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
