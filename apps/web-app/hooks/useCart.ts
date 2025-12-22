import { useState, useMemo } from 'react';
import { CartItem, Product } from '../src/screens/Home/Home.types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const add = (item: Product, storeId: number) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id && p.storeId === storeId);
      if (found) {
        return prev.map(p =>
          p.id === item.id && p.storeId === storeId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1, storeId }];
    });
  };

  const remove = (itemId: number, storeId: number) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === itemId && p.storeId === storeId
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter(p => p.quantity > 0)
    );
  };

  const count = (storeId?: number) =>
    cart
      .filter(c => !storeId || c.storeId === storeId)
      .reduce((s, i) => s + i.quantity, 0);

  const total = (storeId?: number) =>
    cart
      .filter(c => !storeId || c.storeId === storeId)
      .reduce((s, i) => s + i.price * i.quantity, 0);

  return { cart, add, remove, count, total };
}
