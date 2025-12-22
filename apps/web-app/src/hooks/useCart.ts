import { useState } from 'react';
import { Product, CartItem } from '../screens/Home/Home.types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const add = (product: Product, storeId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.storeId === storeId);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.storeId === storeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, storeId }];
    });
  };

  const remove = (productId: number, storeId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId && item.storeId === storeId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId && item.storeId === storeId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => !(item.id === productId && item.storeId === storeId));
    });
  };

  const count = (storeId?: number) => {
    if (storeId === undefined) {
      return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }
    return cartItems
      .filter(item => item.storeId === storeId)
      .reduce((acc, item) => acc + item.quantity, 0);
  };

  const total = (storeId?: number) => {
    if (storeId === undefined) {
      return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
    return cartItems
      .filter(item => item.storeId === storeId)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return {
    cart: cartItems,
    add,
    remove,
    count,
    total
  };
}
