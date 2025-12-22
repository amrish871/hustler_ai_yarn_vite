import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Menu, X, LogOut, CreditCard, Package, TrendingUp, Bell, Globe } from 'lucide-react';
import { Language, t } from '../translations';

interface NavbarProps {
  onMenuClick?: () => void;
  user?: { id: string; name: string; phone?: string; email?: string };
  language: Language;
  onLanguageChange: (lang: Language) => void;
  orders?: any[];
}

export default function Navbar({ onMenuClick, user, language, onLanguageChange, orders = [] }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load user from localStorage if not provided
  useEffect(() => {
    if (!userInfo) {
      const savedUser = localStorage.getItem('voiceAI_user');
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }
    }
  }, [userInfo]);

  const isActive = (path: string) => location.pathname === path;

  // const userInitials = userInfo?.name
  //   ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
  //   : 'U';

  // Profile Modal Component
  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">My Orders</h2>
          <button
            onClick={() => setShowProfileModal(false)}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-bold text-lg flex items-center gap-2">
                      <span>{order.store?.image || '🏪'}</span>
                      {order.store?.name || 'Store'}
                    </p>
                    <p className="text-white/60 text-sm">{order.date} at {order.time}</p>
                  </div>
                  <p className="text-green-300 font-bold text-lg">${typeof order.total === 'string' ? order.total : order.total?.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items?.map((item: any) => (
                    <div key={`${item.id}-${item.storeId}`} className="flex justify-between items-center text-white/80 text-sm bg-white/5 p-2 rounded">
                      <span>{item.image} {item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-3 text-white/70 text-xs">
                  <p className="mb-1"><span className="text-white/90">Payment:</span> {order.paymentMethod?.toUpperCase()}</p>
                  <p><span className="text-white/90">Address:</span> {order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const userInitials = userInfo?.name
    ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { label: 'Profile', icon: MapPin, action: () => { setShowProfileModal(true); setShowUserMenu(false); } },
    { label: t(language, 'addresses'), icon: MapPin, action: () => navigate('/manage-addresses') },
    { label: t(language, 'payments'), icon: CreditCard, action: () => navigate('/manage-payments') },
    { label: t(language, 'orders'), icon: Package, action: () => navigate('/orders') },
    { label: t(language, 'transactions'), icon: TrendingUp, action: () => navigate('/transactions') },
    { label: t(language, 'subscriptions'), icon: Bell, action: () => navigate('/subscriptions') },
  ];

  return (
    <>
      {showProfileModal && <ProfileModal />}
      <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="text-2xl font-bold text-white hover:text-blue-200 transition-colors"
            >
              🎙️ Voice AI
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/home')
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </div>

          {/* User Profile Button & Dropdown */}
          <div className="relative">
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
                      localStorage.removeItem('voiceAI_user');
                      localStorage.removeItem('voiceAI_authToken');
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
    </nav>
    </>
  );
}
