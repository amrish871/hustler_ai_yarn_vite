import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  brand?: string;
  category: string;
  storeId: number;
}

interface Order {
  id: number;
  date: string;
  time: string;
  store: {
    id: number;
    name: string;
    image: string;
    rating: number;
    distance: string;
    category: string;
    popular: string[];
    catalog: OrderItem[];
  };
  items: OrderItem[];
  total: string | number;
  paymentMethod: string;
  address: string;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('voiceAI_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-white">My Orders</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No orders yet</p>
              <p className="text-white/50 mt-2">Start shopping to see your orders here</p>
              <button
                onClick={() => navigate('/home')}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/20">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{order.store.image}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{order.store.name}</h3>
                        <p className="text-white/60 text-sm">{order.date} at {order.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-300">
                      ${typeof order.total === 'string' ? order.total : order.total.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-sm capitalize mt-1">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4 pb-4 border-b border-white/20">
                  <h4 className="text-white font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.storeId}`}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            {item.brand && <p className="text-white/60 text-sm">{item.brand}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">x{item.quantity}</p>
                          <p className="text-green-300 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-white/60 text-sm min-w-fit">Delivery Address:</span>
                    <p className="text-white/80 text-sm">{order.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">Payment Method:</span>
                    <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
