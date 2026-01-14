import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, TrendingUp, MapPin, CreditCard, AlertCircle } from 'lucide-react';
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
  orderNumber: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedDelivery?: string;
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

const dummyOrders: Order[] = [
  {
    id: 1001,
    orderNumber: 'ORD-2026-001ABC',
    date: 'Jan 10, 2026',
    time: '2:30 PM',
    status: 'delivered',
    estimatedDelivery: 'Jan 10',
    store: {
      id: 1,
      name: 'Fresh Mart',
      image: '🛒',
      rating: 4.8,
      distance: '1.2 km',
      category: 'Grocery',
      popular: ['Milk', 'Eggs', 'Vegetables'],
      catalog: [],
    },
    items: [
      {
        id: 1,
        name: 'Organic Milk',
        image: '🥛',
        price: 3.99,
        quantity: 2,
        brand: 'Dairy Fresh',
        category: 'Dairy',
        storeId: 1,
      },
      {
        id: 2,
        name: 'Whole Wheat Bread',
        image: '🍞',
        price: 2.49,
        quantity: 1,
        brand: 'Artisan Bakery',
        category: 'Bakery',
        storeId: 1,
      },
      {
        id: 3,
        name: 'Mixed Vegetables',
        image: '🥕',
        price: 4.99,
        quantity: 1,
        category: 'Vegetables',
        storeId: 1,
      },
    ],
    total: 18.46,
    paymentMethod: 'credit_card',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  },
  {
    id: 1002,
    orderNumber: 'ORD-2026-002XYZ',
    date: 'Jan 11, 2026',
    time: '4:15 PM',
    status: 'in_transit',
    estimatedDelivery: 'Today',
    store: {
      id: 2,
      name: 'Pizza Palace',
      image: '🍕',
      rating: 4.6,
      distance: '2.1 km',
      category: 'Food',
      popular: ['Pepperoni Pizza', 'Margherita', 'BBQ Chicken'],
      catalog: [],
    },
    items: [
      {
        id: 4,
        name: 'Pepperoni Pizza Large',
        image: '🍕',
        price: 16.99,
        quantity: 1,
        brand: 'Pizza Palace',
        category: 'Pizza',
        storeId: 2,
      },
      {
        id: 5,
        name: 'Garlic Bread',
        image: '🍞',
        price: 3.99,
        quantity: 1,
        brand: 'Pizza Palace',
        category: 'Sides',
        storeId: 2,
      },
      {
        id: 6,
        name: 'Coca Cola 2L',
        image: '🥤',
        price: 2.99,
        quantity: 1,
        brand: 'Coca Cola',
        category: 'Beverages',
        storeId: 2,
      },
    ],
    total: 23.97,
    paymentMethod: 'debit_card',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  },
  {
    id: 1003,
    orderNumber: 'ORD-2026-003DEF',
    date: 'Jan 09, 2026',
    time: '10:45 AM',
    status: 'confirmed',
    estimatedDelivery: 'Jan 13',
    store: {
      id: 3,
      name: 'Medicine Plus',
      image: '💊',
      rating: 4.9,
      distance: '0.8 km',
      category: 'Pharmacy',
      popular: ['Pain Relief', 'Vitamins', 'Cold Medicine'],
      catalog: [],
    },
    items: [
      {
        id: 7,
        name: 'Vitamin C Tablets',
        image: '💊',
        price: 8.99,
        quantity: 2,
        brand: 'HealthCare Plus',
        category: 'Vitamins',
        storeId: 3,
      },
      {
        id: 8,
        name: 'Pain Relief Capsules',
        image: '💊',
        price: 5.49,
        quantity: 1,
        brand: 'GenericMed',
        category: 'Pain Relief',
        storeId: 3,
      },
    ],
    total: 23.47,
    paymentMethod: 'cod',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  },
  {
    id: 1004,
    orderNumber: 'ORD-2026-004GHI',
    date: 'Jan 11, 2026',
    time: '11:20 AM',
    status: 'pending',
    estimatedDelivery: 'Jan 12',
    store: {
      id: 4,
      name: 'Bookstore Hub',
      image: '📚',
      rating: 4.7,
      distance: '1.5 km',
      category: 'Books & Media',
      popular: ['Fiction', 'Self-help', 'Tech Books'],
      catalog: [],
    },
    items: [
      {
        id: 9,
        name: 'The Great Gatsby',
        image: '📖',
        price: 12.99,
        quantity: 1,
        brand: 'Penguin Classics',
        category: 'Fiction',
        storeId: 4,
      },
      {
        id: 10,
        name: 'Atomic Habits',
        image: '📖',
        price: 14.99,
        quantity: 1,
        brand: 'Random House',
        category: 'Self-help',
        storeId: 4,
      },
    ],
    total: 27.98,
    paymentMethod: 'digital_wallet',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  },
  {
    id: 1005,
    orderNumber: 'ORD-2026-005JKL',
    date: 'Jan 08, 2026',
    time: '6:50 PM',
    status: 'cancelled',
    store: {
      id: 1,
      name: 'Fresh Mart',
      image: '🛒',
      rating: 4.8,
      distance: '1.2 km',
      category: 'Grocery',
      popular: ['Milk', 'Eggs', 'Vegetables'],
      catalog: [],
    },
    items: [
      {
        id: 11,
        name: 'Eggs (Dozen)',
        image: '🥚',
        price: 4.99,
        quantity: 1,
        brand: 'Farm Fresh',
        category: 'Dairy',
        storeId: 1,
      },
      {
        id: 12,
        name: 'Butter',
        image: '🧈',
        price: 5.49,
        quantity: 1,
        brand: 'Dairy Fresh',
        category: 'Dairy',
        storeId: 1,
      },
    ],
    total: 10.48,
    paymentMethod: 'credit_card',
    address: '456 Business Ave, Suite 200, New York, NY 10002',
  },
];

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('voiceAI_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders:', error);
        setOrders(dummyOrders);
      }
    } else {
      // Use dummy orders if no saved orders
      setOrders(dummyOrders);
      localStorage.setItem('voiceAI_orders', JSON.stringify(dummyOrders));
    }
    setLoading(false);
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'in_transit':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-white/50" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_transit':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const canCancelOrder = (order: Order) => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      ));
      setCancellingOrderId(null);
      // Save to localStorage
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      );
      localStorage.setItem('voiceAI_orders', JSON.stringify(updatedOrders));
    }
  };

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
              <div
                key={order.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all overflow-hidden"
              >
                {/* Order Summary */}
                <button
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="w-full p-6 text-left hover:bg-white/5 transition-all"
                >
                  {/* Order ID Badge at top */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide">Order ID</p>
                      <p className="text-sm font-mono font-bold text-blue-300">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl">{order.store.image}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{order.store.name}</h3>
                        <p className="text-white/60 text-sm">{order.date} at {order.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-300">
                        ${typeof order.total === 'string' ? order.total : order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary Row */}
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Est. {order.estimatedDelivery}</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <>
                    <div className="border-t border-white/20 px-6 py-4">
                      {/* Order Items */}
                      <h4 className="text-white font-semibold mb-3">Order Items</h4>
                      <div className="space-y-2 mb-6">
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

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Delivery Address */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/60 text-sm font-medium">Delivery Address</p>
                              <p className="text-white/80 text-sm mt-1">{order.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/60 text-sm font-medium">Payment Method</p>
                              <p className="text-white/80 text-sm mt-1 capitalize">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="text-white/60 text-sm font-medium">Order Status</p>
                              <p className="text-white/80 text-sm mt-1">{getStatusLabel(order.status)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order ID */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/60 text-sm font-medium">Order ID</p>
                              <p className="text-white/80 text-sm mt-1 font-mono">{order.orderNumber}</p>
                              <p className="text-white/60 text-xs mt-1">Reference: #{order.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-white/5 rounded-lg p-4 mb-6">
                        <h5 className="text-white font-semibold mb-3">Price Breakdown</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Subtotal</span>
                            <span className="text-white">${typeof order.total === 'string' ? order.total : order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Delivery Charge</span>
                            <span className="text-white">Free</span>
                          </div>
                          <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                            <span className="text-white font-semibold">Total</span>
                            <span className="text-green-300 font-semibold">${typeof order.total === 'string' ? order.total : order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {canCancelOrder(order) ? (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-white/10 text-white/50 rounded-lg font-semibold cursor-not-allowed"
                          >
                            Cannot Cancel
                          </button>
                        )}
                        <button
                          onClick={() => navigate('/home')}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                        >
                          Order Again
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
