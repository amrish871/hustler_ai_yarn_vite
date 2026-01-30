import { Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                10k+
              </div>
              <p className="text-blue-200 text-sm mt-2">Active Stores</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                15 min
              </div>
              <p className="text-blue-200 text-sm mt-2">Avg. Delivery</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                500k+
              </div>
              <p className="text-blue-200 text-sm mt-2">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                24/7
              </div>
              <p className="text-blue-200 text-sm mt-2">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-indigo-900 font-bold text-lg">◆</span>
              </div>
              <span className="font-bold text-lg text-white">Order Near Buy</span>
            </div>

            {/* Center Links */}
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-center text-sm text-blue-200">
              © 2024 Order Near Buy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
