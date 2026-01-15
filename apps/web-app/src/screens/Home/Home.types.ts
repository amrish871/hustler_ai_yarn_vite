export type Message = {
  text?: string;
  image?: string | ArrayBuffer | null;
  sender: 'user' | 'ai';
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
};

export type CartItem = {
    storeId: number;
    storeName: string;
    id: number;
    name: string;
    brand?: string;
    price: number;
    category: string;
    image: string;
    variant: { id: number; name: string; price: number; quantity: number };
};
export type CartItems = {
  [storeId: number]: CartItem[];
};

export type Address = {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
};
