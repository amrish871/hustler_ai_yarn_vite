import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  id: number;
  name: string;
  description: string;
  emoji: string;
  status: 'active' | 'paused' | 'cancelled' | 'expiring';
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: string;
  nextDelivery: string;
  items: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subscriptions from localStorage
    const savedSubscriptions = localStorage.getItem('voiceAI_subscriptions');
    if (savedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (error) {
        console.error('Failed to parse subscriptions:', error);
      }
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'expiring':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      default:
        return 'bg-white/20 text-white/80 border-white/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      case 'expiring':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
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
          <h1 className="text-4xl font-bold text-white">My Subscriptions</h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'active', 'paused', 'expiring', 'cancelled'].map((status) => (
            <button
              key={status}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium whitespace-nowrap transition-all border border-white/20 capitalize"
            >
              {status}
            </button>
          ))}
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <Gift className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No subscriptions yet</p>
              <p className="text-white/50 mt-2">Create a subscription to get regular deliveries</p>
              <button
                onClick={() => navigate('/home')}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/20">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-4xl">{subscription.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{subscription.name}</h3>
                      <p className="text-white/60 text-sm mt-1">{subscription.description}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border capitalize text-sm font-medium ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {getStatusIcon(subscription.status)}
                    <span>{subscription.status}</span>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/20">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Amount</p>
                    <p className="text-2xl font-bold text-green-300">
                      ${subscription.amount.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-xs mt-1 capitalize">
                      {subscription.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Started</p>
                    <p className="text-white font-semibold">{subscription.startDate}</p>
                    <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Next Delivery</p>
                    <p className="text-white font-semibold">{subscription.nextDelivery}</p>
                    <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Upcoming</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 pb-4 border-b border-white/20">
                  <h4 className="text-white font-semibold mb-3">Subscription Items</h4>
                  <div className="space-y-2">
                    {subscription.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
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

                {/* Actions */}
                <div className="flex gap-2">
                  {subscription.status === 'active' ? (
                    <>
                      <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all text-sm">
                        Edit Subscription
                      </button>
                      <button className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition-all text-sm">
                        Pause
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all text-sm">
                        Cancel
                      </button>
                    </>
                  ) : subscription.status === 'paused' ? (
                    <>
                      <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all text-sm">
                        Resume
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all text-sm">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all text-sm">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
