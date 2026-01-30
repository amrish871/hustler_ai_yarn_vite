import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Edit2, Trash2, Plus, Home, Briefcase } from 'lucide-react';

import { Language } from '../translations';
import { useSetDefaultAddress, useDeleteAddress } from '../../hooks/useAddressQuery';
interface Address {
  id: string;
  label?: string;
  locality: string;
  apartment_number: string;
  landmark?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export default function AddressManagement({ language = 'en' }: { language?: Language }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { mutate: setDefaultAddressFun } = useSetDefaultAddress();
  const { mutate: deleteAddressFun } = useDeleteAddress();

  // Load addresses from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Save addresses to localStorage
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (addr: Partial<Address>) => {
    if (!addr.locality || !addr.label || !addr.apartment_number) {
      alert('Please fill in address label, locality, and apartment number');
      return;
    }
    
    if (editingId) {
      // Update existing address
      setAddresses(prev => prev.map(a => 
        a.id === editingId 
          ? {
              ...a,
              label: addr.label || a.label,
              locality: addr.locality || a.locality,
              apartment_number: addr.apartment_number || a.apartment_number,
              landmark: addr.landmark,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
            }
          : a
      ));
      setEditingId(null);
    } else {
      // Add new address
      const a: Address = {
        id: `addr-${Date.now()}`,
        locality: addr.locality || '',
        apartment_number: addr.apartment_number || '',
        landmark: addr.landmark,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        label: addr.label || 'Home',
        isDefault: addresses.length === 0,
      };
      setAddresses(prev => [...prev, a]);
    }
    
    setNewAddress({});
    setShowForm(false);
  };

  const setDefaultAddress = (id: string) => {
    setDefaultAddressFun({ userAddressId: Number(id) });
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAddress = (id: string) => {
    deleteAddressFun({ userAddressId: Number(id) });
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const editAddress = (addr: Address) => {
    setNewAddress(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setNewAddress({});
    setEditingId(null);
    setShowForm(false);
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
        const locality = data.name || `${address.road || ''} ${address.house_number || ''}`;
        const city = address.city || address.town || address.village || '';
        const state = address.state || '';
        const postalCode = address.postcode || '';
        setNewAddress(prev => ({
          ...prev,
          locality: locality.trim(),
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
      <div className="w-full max-w-5xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-white">{language ? (language === 'hi' ? 'पते प्रबंधित करें' : 'Manage Addresses') : 'Manage Addresses'}</h2>
            </div>
            {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              {language === 'hi' ? 'जोड़ें' : 'Add Address'}
            </button>
            )}
          </div>

          {/* Addresses List */}
          {!showForm && (
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
              {language === 'hi' ? 'आपके पते' : 'Your Addresses'}
            </h3>
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 text-sm">{language === 'hi' ? 'अभी तक कोई पता नहीं। नीचे एक पता जोड़ें।' : 'No addresses yet. Add one below.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-white/10 p-5 rounded-xl border border-white/20 hover:border-white/40 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold text-lg">{addr.label}</h4>
                          {addr.isDefault && (
                            <span className="text-xs bg-green-500/40 text-green-300 px-2 py-0.5 rounded whitespace-nowrap font-medium">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-white/80 text-sm font-medium">{addr.apartment_number}</div>
                      <div className="text-white/80 text-sm">{addr.locality}</div>
                      {addr.landmark && (
                        <div className="text-white/80 text-sm">{addr.landmark}</div>
                      )}
                      {(addr.city || addr.state || addr.postalCode) && (
                        <div className="text-white/70 text-sm">
                          {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editAddress(addr)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg text-sm transition-all font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        {language === 'hi' ? 'संपादित करें' : 'Edit'}
                      </button>
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="flex-1 px-3 py-2 bg-purple-600/50 hover:bg-purple-600 text-white rounded-lg text-sm transition-all font-medium"
                        >
                          {language === 'hi' ? 'डिफ़ॉल्ट' : 'Set Default'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Add/Edit Address Form */}
          {showForm && (
            <div className="bg-white/10 p-6 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold mb-4 text-lg">
                {editingId ? (language === 'hi' ? 'पता संपादित करें' : 'Edit Address') : (language === 'hi' ? 'नया पता जोड़ें' : 'Add New Address')}
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    {language === 'hi' ? 'पता लेबल' : 'Address Label'}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="label"
                        value="Home"
                        checked={newAddress.label === 'Home'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                        className="w-4 h-4 accent-blue-400"
                      />
                      <Home className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{language === 'hi' ? 'घर' : 'Home'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="label"
                        value="Office"
                        checked={newAddress.label === 'Office'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                        className="w-4 h-4 accent-blue-400"
                      />
                      <Briefcase className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{language === 'hi' ? 'कार्यालय' : 'Office'}</span>
                    </label>
                  </div>
                </div>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={language === 'hi' ? 'अपार्टमेंट नंबर' : 'Apartment Number'}
                  value={newAddress.apartment_number || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, apartment_number: e.target.value }))}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={language === 'hi' ? 'इलाका' : 'Locality'}
                  value={newAddress.locality || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, locality: e.target.value }))}
                />
                <input
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={language === 'hi' ? 'लैंडमार्क (वैकल्पिक)' : 'Landmark (Optional)'}
                  value={newAddress.landmark || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={language === 'hi' ? 'शहर' : 'City'}
                    value={newAddress.city || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={language === 'hi' ? 'राज्य' : 'State'}
                    value={newAddress.state || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={language === 'hi' ? 'पिन कोड' : 'Postal code'}
                  value={newAddress.postalCode || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                />

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={useCurrentLocation}
                    className="flex-1 px-4 py-2 bg-indigo-600/50 hover:bg-indigo-600 text-white rounded-lg text-sm transition-all font-medium"
                  >
                    📍 {language === 'hi' ? 'वर्तमान स्थान उपयोग करें' : 'Use Current Location'}
                  </button>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => addAddress(newAddress)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all font-semibold"
                  >
                    {editingId ? (language === 'hi' ? 'अपडेट करें' : 'Update') : (language === 'hi' ? 'पता जोड़ें' : 'Add Address')}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg text-sm transition-all font-semibold"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
