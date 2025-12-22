export type Sender = 'user' | 'ai';

export type Message = {
  text?: string;
  image?: string;
  sender: Sender;
};

export type CatalogItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export type StoreType = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
  catalog: CatalogItem[];
};

export type CartItem = CatalogItem & {
  quantity: number;
  storeId: number;
};
