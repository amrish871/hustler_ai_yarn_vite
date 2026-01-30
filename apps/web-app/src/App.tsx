import React, { useState, useRef, useEffect }  from 'react'
import Navbar from './components/Navbar'
import AddressModal from './components/AddressModal'
import LocationPrompt from './components/LocationPrompt'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartProvider, useCart } from './context/CartContext'
import { AuthLayout } from './components/AuthLayout'
import Login from './screens/Login'
import { Language, t } from './translations'
import HomeScreen from './screens/HomeScreen'
import AddressManagement from './screens/AddressManagement'
import Orders from './screens/Orders'
import Transactions from './screens/Transactions'
import Subscriptions from './screens/Subscriptions'
import Profile from './screens/Profile'
import { AuthProvider } from '@myorg/auth'
import queryClient from '../src/queries/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'




// import Navbar from './components/Navbar'
// import { ProtectedRoute } from './components/ProtectedRoute'
// import VoiceAIScreen from './VoiceAIScreen'
// import AddressManagement from './screens/AddressManagement'
// import MedicinesScreen from './screens/MedicinesScreen'
// import Login from './screens/Login'
// import { Language } from './translations'

const ProtectedLayout = ({ children, language, onLanguageChange, deliveryAddress, onAddressClick }: { children: React.ReactNode; language: Language; onLanguageChange: (lang: Language) => void; deliveryAddress?: string; onAddressClick?: () => void }) => {
  const { cartCount, onCartClick } = useCart();
  
  return (
    <>
      <Navbar 
        language={language} 
        onLanguageChange={onLanguageChange}
        cartCount={cartCount}
        onCartClick={onCartClick}
        deliveryAddress={deliveryAddress}
        onAddressClick={onAddressClick}
      />
      {children}
    </>
  )
}

const AppContent = ({ language, onLanguageChange }: { language: Language; onLanguageChange: (lang: Language) => void }) => {
  const [deliveryAddress, setDeliveryAddress] = useState<string>("123 Main Street, Apt 4B, New York, NY 10001");
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState<boolean>(false);
  const [locationPromptShown, setLocationPromptShown] = useState<boolean>(false);

  const addresses = [
    {
      id: 1,
      label: "Home",
      address: "123 Main Street, Apt 4B, New York, NY 10001",
    },
    {
      id: 2,
      label: "Office",
      address: "456 Business Ave, Suite 200, New York, NY 10002",
    },
    {
      id: 3,
      label: "Friend's Place",
      address: "789 Oak Road, Brooklyn, NY 10003",
    },
  ];

  // Show location prompt on first visit (only once)
  useEffect(() => {
    if (!locationPromptShown && !localStorage.getItem('locationPromptShown')) {
      setShowLocationPrompt(true);
      setLocationPromptShown(true);
      localStorage.setItem('locationPromptShown', 'true');
    }
  }, [locationPromptShown]);

  const handleAddressChange = (newAddress: string) => {
    setDeliveryAddress(newAddress);
    setShowAddressModal(false);
  };

  const handleLocationSelect = (address: string) => {
    setDeliveryAddress(address);
    setShowLocationPrompt(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthLayout title={t(language, 'login')} subtitle={t(language, 'login_subtitle')}><Login language={language} /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout title={t(language, 'login')} subtitle={t(language, 'login_subtitle')}><Login language={language} /></AuthLayout>} />
        <Route path="/home" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><HomeScreen onAddressChange={setDeliveryAddress} /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><Profile language={language} /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/manage-addresses" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><AddressManagement language={language} /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><Orders /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><Transactions /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange} deliveryAddress={deliveryAddress} onAddressClick={() => setShowAddressModal(true)}><Subscriptions /></ProtectedLayout></ProtectedRoute>} />
      </Routes>

      {/* Global Address Modal */}
      {showAddressModal && (
        <AddressModal
          // addresses={addresses}
          // deliveryAddress={deliveryAddress}
          setDeliveryAddress={handleAddressChange}
          setShowAddressModal={setShowAddressModal}
        />
      )}

      {/* Location Prompt - Shows on first visit */}
      {showLocationPrompt && (
        <LocationPrompt
          onSelectAddress={handleLocationSelect}
          onClose={() => setShowLocationPrompt(false)}
          addresses={addresses}
        />
      )}
    </>
  )
}

const App = () => {
  const [language, setLanguage] = useState<Language>('en')

  return (

    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router>
            <AppContent language={language} onLanguageChange={setLanguage} />
          </Router>
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App