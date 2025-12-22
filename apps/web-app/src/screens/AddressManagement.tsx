import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

import { Language } from '../translations';
interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export default function AddressManagement({ language = 'en' }: { language?: Language }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  // Load addresses from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('voiceAI_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Save addresses to localStorage
  useEffect(() => {
    localStorage.setItem('voiceAI_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (addr: Partial<Address>) => {
    if (!addr.line1 || !addr.label) {
      alert('Please fill in address label and street address');
      return;
    }
    const a: Address = {
      id: `addr-${Date.now()}`,
      line1: addr.line1 || '',
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      label: addr.label || 'Home',
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, a]);
    setNewAddress({});
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const address = data.address || {};
        const line1 = data.name || `${address.road || ''} ${address.house_number || ''}`;
        const city = address.city || address.town || address.village || '';
        const state = address.state || '';
        const postalCode = address.postcode || '';
        setNewAddress(prev => ({
          ...prev,
          line1: line1.trim(),
          city,
          state,
          postalCode,
        }));
      } catch (error) {
        alert('Failed to fetch address');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">{language ? (language === 'hi' ? 'पते प्रबंधित करें' : 'Manage Addresses') : 'Manage Addresses'}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Addresses */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {language === 'hi' ? 'आपके पते' : 'Your Addresses'}
              </h3>
              {addresses.length === 0 ? (
                <p className="text-white/50 text-sm">{language === 'hi' ? 'अभी तक कोई पता नहीं' : 'No addresses yet'}</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-white font-semibold">{addr.label}</div>
                          <div className="text-white/80 text-sm mt-1">{addr.line1}</div>
                          {addr.city && (
                            <div className="text-white/80 text-sm">
                              {addr.city}
                              {addr.state ? `, ${addr.state}` : ''}
                            </div>
                          )}
                          {addr.postalCode && (
                            <div className="text-white/70 text-xs mt-1">{addr.postalCode}</div>
                          )}
                        </div>
                        {addr.isDefault && (
                          <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded whitespace-nowrap ml-2">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="flex-1 px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded text-sm transition-all"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="flex-1 px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded text-sm transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Address Form */}
            <div>
              <h3 className="text-white font-semibold mb-4">{language === 'hi' ? 'नया पता जोड़ें' : 'Add New Address'}</h3>
              <div className="bg-white/10 p-4 rounded-lg space-y-3">
                <input
                  className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Address label (e.g., Home, Office)"
                  value={newAddress.label || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                />
                <input
                  className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Street address"
                  value={newAddress.line1 || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                />
                <input
                  className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="City"
                  value={newAddress.city || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <input
                  className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="State"
                  value={newAddress.state || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                />
                <input
                  className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Postal code"
                  value={newAddress.postalCode || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    onClick={useCurrentLocation}
                    className="flex-1 px-3 py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded text-sm transition-all"
                  >
                    📍 {language === 'hi' ? 'वर्तमान स्थान उपयोग करें' : 'Use Current Location'}
                  </button>
                  <button
                    onClick={() => addAddress(newAddress)}
                    className="flex-1 px-3 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded text-sm transition-all font-semibold"
                  >
                    {language === 'hi' ? 'पता जोड़ें' : 'Add Address'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
