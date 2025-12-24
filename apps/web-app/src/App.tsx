import React, { useState }  from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartProvider, useCart } from './context/CartContext'
import Login from './screens/Login'
import { Language } from './translations'
import HomeScreen from './screens/HomeScreen'
import AddressManagement from './screens/AddressManagement'
import Orders from './screens/Orders'
import Transactions from './screens/Transactions'
import Subscriptions from './screens/Subscriptions'




// import Navbar from './components/Navbar'
// import { ProtectedRoute } from './components/ProtectedRoute'
// import VoiceAIScreen from './VoiceAIScreen'
// import AddressManagement from './screens/AddressManagement'
// import MedicinesScreen from './screens/MedicinesScreen'
// import Login from './screens/Login'
// import { Language } from './translations'

const ProtectedLayout = ({ children, language, onLanguageChange }: { children: React.ReactNode; language: Language; onLanguageChange: (lang: Language) => void }) => {
  const { cartCount, onCartClick } = useCart();
  
  return (
    <>
      <Navbar 
        language={language} 
        onLanguageChange={onLanguageChange}
        cartCount={cartCount}
        onCartClick={onCartClick || undefined}
      />
      {children}
    </>
  )
}

const AppContent = ({ language, onLanguageChange }: { language: Language; onLanguageChange: (lang: Language) => void }) => {
  return (
    <Routes>
      <Route path="/" element={<Login language={language} />} />
      <Route path="/login" element={<Login language={language} />} />
      <Route path="/home" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><HomeScreen /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/manage-addresses" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><AddressManagement language={language} /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><Orders /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><Transactions /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/subscriptions" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><Subscriptions /></ProtectedLayout></ProtectedRoute>} />
      {/* <Route path="/order-medicines" element={<ProtectedRoute><ProtectedLayout language={language} onLanguageChange={onLanguageChange}><MedicinesScreen language={language} /></ProtectedLayout></ProtectedRoute>} /> */}
    </Routes>
  )
}

const App = () => {
  const [language, setLanguage] = useState<Language>('en')

  return (
    <CartProvider>
      <Router>
        <AppContent language={language} onLanguageChange={setLanguage} />
      </Router>
    </CartProvider>
  )
}

export default App