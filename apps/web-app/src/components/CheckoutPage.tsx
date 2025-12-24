import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Minus, Plus, Truck, MapPin, Clock, CheckCircle, X } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: Array<{ id: number; name: string; brand?: string; price: number; quantity: number; category: string; image: string; storeId: number }>;
  stores: Array<{ id: number; name: string; category: string; rating: number; distance: string; image: string; popular: string[]; catalog: any[] }>;
  onBack: () => void;
  onCheckout: (storeId: number) => void;
  getTotalPrice: (storeId?: number) => string;
  removeFromCart: (itemId: number, storeId: number) => void;
  addToCart: (item: any) => void;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  deliveryAddress: string;
  onEditAddress: () => void;
  fulfillmentType: 'delivery' | 'pickup';
  onFulfillmentTypeChange: (type: 'delivery' | 'pickup') => void;
}

export default function CheckoutPage({
  cartItems,
  stores,
  onBack,
  onCheckout,
  getTotalPrice,
  removeFromCart,
  addToCart,
  selectedPaymentMethod,
  onPaymentMethodChange,
  deliveryAddress,
  onEditAddress,
  fulfillmentType,
  onFulfillmentTypeChange,
}: CheckoutPageProps) {
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [selectedStoreForCheckout, setSelectedStoreForCheckout] = useState<number | null>(null);
  
  // Group cart items by store
  const cartByStore = cartItems.reduce((acc, item) => {
    const store = stores.find(s => s.id === item.storeId);
    if (!store) return acc;
    if (!acc[store.id]) {
      acc[store.id] = { store, items: [] };
    }
    acc[store.id].items.push(item);
    return acc;
  }, {} as Record<number, { store: any; items: any[] }>);

  const storeEntries = Object.values(cartByStore);

  const handleStoreCheckout = (storeId: number) => {
    setSelectedStoreForCheckout(storeId);
    setShowOrderConfirmation(true);
    onCheckout(storeId);
  };

  // Order Confirmation Modal
  if (showOrderConfirmation) {
    const selectedStoreData = storeEntries.find(entry => entry.store.id === selectedStoreForCheckout);
    const storeTotal = selectedStoreData ? selectedStoreData.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) : '0.00';
    
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-white/70 mb-6">Your order has been confirmed and will be delivered soon.</p>

          <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20 space-y-3">
            {selectedStoreData && (
              <div className="flex justify-between text-white/80">
                <span>Store:</span>
                <span className="font-bold text-white">{selectedStoreData.store.name}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span>Order Total:</span>
              <span className="font-bold text-green-300">
                ${(
                  parseFloat(storeTotal) + (fulfillmentType === 'pickup' ? 0 : 2.99)
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Delivery Type:</span>
              <span className="font-bold text-white">
                {fulfillmentType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
              </span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Payment Method:</span>
              <span className="font-bold text-white uppercase">{selectedPaymentMethod}</span>
            </div>
          </div>

          <p className="text-white/60 text-sm mb-6">
            You will receive updates about your order on your registered phone number.
          </p>

          <button
            onClick={() => {
              setShowOrderConfirmation(false);
              onBack();
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-bold transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-2">Cart is Empty</h2>
          <p className="text-white/70 mb-6">Add items to your cart to get started</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-bold transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10 sticky top-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Summary
          </h2>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Delivery Info */}
      <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-400" />
              Delivery Address
            </h3>
            <p className="text-white/70 text-xs">{deliveryAddress}</p>
          </div>
          <button
            onClick={onEditAddress}
            className="px-2 py-1 text-xs bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 rounded-lg transition-all flex-shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Fulfillment Type */}
        <div className="flex gap-3 pt-3 border-t border-white/10 text-sm">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="delivery"
              checked={fulfillmentType === 'delivery'}
              onChange={(e) => onFulfillmentTypeChange('delivery')}
              className="w-3 h-3"
            />
            <Truck className="w-3 h-3 text-white/70" />
            <span className="text-white/80 text-xs">Delivery</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="pickup"
              checked={fulfillmentType === 'pickup'}
              onChange={(e) => onFulfillmentTypeChange('pickup')}
              className="w-3 h-3"
            />
            <Clock className="w-3 h-3 text-white/70" />
            <span className="text-white/80 text-xs">Pickup</span>
          </label>
        </div>
      </div>

      {/* Store Sections */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
        {storeEntries.map(({ store, items }) => {
          const storeTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
          return (
            <div key={store.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
              {/* Store Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <div className="text-2xl">{store.image}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm">{store.name}</h3>
                  <p className="text-white/60 text-xs">{store.category} • {store.distance}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-300 font-bold text-sm">${storeTotal}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={`${store.id}-${item.id}`}
                    className="bg-white/5 rounded p-2 flex items-center gap-2 hover:bg-white/10 transition-all text-xs"
                  >
                    <div className="text-lg flex-shrink-0">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-xs">{item.name}</h4>
                      {item.brand && <p className="text-white/60 text-xs">{item.brand}</p>}
                      <p className="text-green-300 font-semibold text-xs">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-white/10 rounded p-0.5 flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id, store.id)}
                        className="w-5 h-5 bg-red-500/30 hover:bg-red-500/50 rounded flex items-center justify-center transition-all"
                      >
                        <Minus className="w-2.5 h-2.5 text-white" />
                      </button>
                      <span className="w-4 text-center text-white font-semibold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-5 h-5 bg-green-500/30 hover:bg-green-500/50 rounded flex items-center justify-center transition-all"
                      >
                        <Plus className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-white/80 font-semibold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Store Checkout Button */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-white/70">Total:</span>
                  <span className="text-green-300 font-bold">${storeTotal}</span>
                </div>
                <button
                  onClick={() => handleStoreCheckout(store.id)}
                  className="w-full py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded text-white font-bold transition-all flex items-center justify-center gap-1 text-xs"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Checkout
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Method */}
      <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10 sticky bottom-0 z-20">
        <h3 className="text-white font-bold mb-2 text-xs">Payment</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '💳 Card', value: 'card' },
            { label: '📱 UPI', value: 'upi' },
            { label: '🚚 COD', value: 'cod' },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => onPaymentMethodChange(method.value)}
              className={`py-1.5 px-2 rounded text-xs font-medium transition-all ${
                selectedPaymentMethod === method.value
                  ? 'bg-blue-500 text-white border border-blue-400'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-transparent'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note: Each store section has its own checkout button */}
    </div>
  );
}

