import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  onCartClick: (() => void) | null;
  setOnCartClick: (callback: (() => void) | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [onCartClick, setOnCartClick] = useState<(() => void) | null>(null);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, onCartClick, setOnCartClick }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
