import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, LogOut, CreditCard, Package, TrendingUp, Bell, Globe, ShoppingCart, ChevronDown } from 'lucide-react';
import { Language, t } from '../translations';

interface NavbarProps {
  onMenuClick?: () => void;
  user?: { id: string; name: string; phone?: string; email?: string };
  language: Language;
  onLanguageChange: (lang: Language) => void;
  orders?: any[];
  cartCount?: number;
  onCartClick?: (() => void) | null;
  // deliveryAddress?: string;
  onAddressClick?: () => void;
}

export default function Navbar({ onMenuClick, user, language, onLanguageChange, orders = [], cartCount = 0, onCartClick, onAddressClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const deliveryAddress = localStorage.getItem('deliveryAddress') ? JSON.parse(localStorage.getItem('deliveryAddress') as string) : '';

  // Load user from localStorage if not provided
  useEffect(() => {
    if (!userInfo) {
      const savedUser = localStorage.getItem('voiceAI_user');
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }
    }
  }, [userInfo]);

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserMenu]);

  const isActive = (path: string) => location.pathname === path;

  const userInitials = userInfo?.name
    ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { label: 'Profile', icon: MapPin, action: () => navigate('/profile') },
    { label: t(language, 'addresses'), icon: MapPin, action: () => navigate('/manage-addresses') },
    { label: t(language, 'payments'), icon: CreditCard, action: () => navigate('/manage-payments') },
    { label: t(language, 'orders'), icon: Package, action: () => navigate('/orders') },
    { label: t(language, 'transactions'), icon: TrendingUp, action: () => navigate('/transactions') },
    { label: t(language, 'subscriptions'), icon: Bell, action: () => navigate('/subscriptions') },
  ];


  const setDeliveryAddress = (address: string) => {
    localStorage.setItem('deliveryAddress', JSON.stringify(address));
  }

  useEffect(() => {
    const addresses = localStorage.getItem('addresses');
    
    if (addresses) {
      const addressObject = JSON.parse(addresses)
      const defaultAddress = addressObject.find((address: any) =>address.isDefault);
      console.log('Default Address from Navbar:', JSON.stringify(defaultAddress));
      const addressString = `${defaultAddress.apartment_number}, ${defaultAddress.locality}, near ${defaultAddress.landmark}, ${defaultAddress.formatted_address}`;
      setDeliveryAddress(addressString);
    }
  }, [deliveryAddress]);

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg border-b border-white/10 sticky top-0 z-50">
      <div className="mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="text-2xl font-bold text-white hover:text-blue-200 transition-colors"
            >
              Order Near Buy
            </button>
          </div>

          {/* Center: Delivery Address */}
          <div className="flex-1 flex justify-center px-4">
            {deliveryAddress && (
              <button
                onClick={onAddressClick}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm max-w-md transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <span className="truncate">{deliveryAddress}</span>
                <span className="ml-auto text-blue-300 font-bold">▼</span>
              </button>
            )}
          </div>

          {/* Right: Profile & Cart */}
          <div className="flex items-center gap-6">
            {/* User Profile Button & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{userInitials}</span>
                </div>
              </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-white/20">
                  <div className="text-white font-semibold">{userInfo?.name || 'User'}</div>
                  <div className="text-white/60 text-sm">{userInfo?.email || 'user@email.com'}</div>
                </div>

                <div className="p-2 space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}

                  {/* Language Divider */}
                  <div className="my-2 border-t border-white/10"></div>

                  {/* Language Option */}
                  <div className="px-4 py-2 text-white/60 text-sm font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {t(language, 'language')}
                  </div>

                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>

                  <button
                    onClick={() => {
                      onLanguageChange('hi');
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      language === 'hi'
                        ? 'bg-blue-600 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>हिंदी</span>
                  </button>

                  {/* Logout */}
                  <div className="my-2 border-t border-white/10"></div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('authToken');
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t(language, 'logout')}</span>
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Cart Icon */}
            
            <button
              onClick={onCartClick}
              className="relative w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
