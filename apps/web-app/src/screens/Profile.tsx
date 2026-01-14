import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react';
import { Language, t } from '../translations';

interface UserInfo {
  id?: string;
  name: string;
  gender?: string;
  email?: string;
  phone?: string;
}

interface ProfileProps {
  language: Language;
}

export default function Profile({ language }: ProfileProps) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    gender: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ name?: string; gender?: string }>({});

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserInfo(user);
      setFormData(user);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userInfo) {
      setFormData(userInfo);
    }
  };


  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: { name?: string; gender?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(formData));
    setUserInfo(formData);
    setIsEditing(false);
    // You can add a toast notification here
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/70">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/60">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
          {/* Avatar Section */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {formData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
                <p className="text-white/60 text-sm">User Account</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Profile Information */}
          {!isEditing ? (
            <div className="space-y-6">
              {/* Name */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Name
                </label>
                <p className="text-white text-lg">{formData.name || 'Not provided'}</p>
              </div>

              {/* Gender */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Gender
                </label>
                <p className="text-white text-lg">{formData.gender || 'Not provided'}</p>
              </div>

              {/* Email */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-white text-lg">{formData.email || 'Not provided'}</p>
              </div>

              {/* Phone */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <p className="text-white text-lg">{formData.phone || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            /* Editing Form */
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all ${errors.name ? 'border-red-500' : 'border-white/20'}`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Gender Input */}
              <div>
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all ${errors.gender ? 'border-red-500' : 'border-white/20'}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="text-white/60 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {!isEditing && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        {!isEditing && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            <button
              onClick={() => navigate('/manage-addresses')}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-semibold">Addresses</span>
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>📦</span>
              <span className="text-sm font-semibold">Orders</span>
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>💳</span>
              <span className="text-sm font-semibold">Payments</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
