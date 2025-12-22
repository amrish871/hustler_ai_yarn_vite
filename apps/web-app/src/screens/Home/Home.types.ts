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
  catalog: Product[];
};

export type CartItem = Product & {
  quantity: number;
  storeId: number;
};

export type Address = {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
};
