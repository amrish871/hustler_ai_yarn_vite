import React from "react";

// Types copied from HomeScreen.tsx
type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
  catalog: Product[];
};
type Product = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  quantity?: string;
  category: string;
  image: string;
};

type Order = {
  id: number;
  date: string;
  time: string;
  store: Store;
  items: Product[];
  total: string;
  paymentMethod: string;
  address: string;
};

interface RecentOrdersProps {
  orders: Order[];
  handleSelectStore: (store: Store) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, handleSelectStore }) => {
  if (orders.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-bold text-white mb-4 px-4">Recent Orders</h2>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4">
        {orders.slice(0, 5).map((order) => (
          <button
            key={order.id}
            onClick={() => handleSelectStore(order.store)}
            className="flex-shrink-0 w-48 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-left"
          >
            <div className="text-3xl mb-2">{order.store.image}</div>
            <h3 className="font-semibold text-white mb-1 truncate">{order.store.name}</h3>
            <p className="text-xs text-blue-200 mb-2">{order.date} at {order.time}</p>
            <div className="mb-2">
              <p className="text-xs text-gray-300 mb-1">Items: {order.items.length}</p>
              <div className="flex flex-wrap gap-1">
                {order.items.slice(0, 2).map((item, idx) => (
                  <span key={idx} className="text-xs bg-white/20 text-blue-200 px-2 py-1 rounded">
                    {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
                  </span>
                ))}
                {order.items.length > 2 && (
                  <span className="text-xs text-blue-300">+{order.items.length - 2} more</span>
                )}
              </div>
            </div>
            <p className="text-sm font-semibold text-green-400">${order.total}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
