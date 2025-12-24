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
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
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
      <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400" />
              Delivery Address
            </h3>
            <p className="text-white/70 text-sm">{deliveryAddress}</p>
          </div>
          <button
            onClick={onEditAddress}
            className="px-3 py-1 text-sm bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 rounded-lg transition-all"
          >
            Edit
          </button>
        </div>

        {/* Fulfillment Type */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="delivery"
              checked={fulfillmentType === 'delivery'}
              onChange={(e) => onFulfillmentTypeChange('delivery')}
              className="w-4 h-4"
            />
            <Truck className="w-4 h-4 text-white/70" />
            <span className="text-white/80 text-sm">Home Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="pickup"
              checked={fulfillmentType === 'pickup'}
              onChange={(e) => onFulfillmentTypeChange('pickup')}
              className="w-4 h-4"
            />
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white/80 text-sm">Store Pickup</span>
          </label>
        </div>
      </div>

      {/* Store Sections */}
      <div className="space-y-6 mb-6">
        {storeEntries.map(({ store, items }) => {
          const storeTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
          return (
            <div key={store.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              {/* Store Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="text-3xl">{store.image}</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{store.name}</h3>
                  <p className="text-white/60 text-sm">{store.category} • {store.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-300 font-bold">${storeTotal}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${store.id}-${item.id}`}
                    className="bg-white/5 rounded-lg p-3 flex items-center gap-3 hover:bg-white/10 transition-all"
                  >
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                      {item.brand && <p className="text-white/60 text-xs">{item.brand}</p>}
                      <p className="text-green-300 font-semibold text-sm">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                      <button
                        onClick={() => removeFromCart(item.id, store.id)}
                        className="w-6 h-6 bg-red-500/30 hover:bg-red-500/50 rounded flex items-center justify-center transition-all"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="w-6 text-center text-white font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 bg-green-500/30 hover:bg-green-500/50 rounded flex items-center justify-center transition-all"
                      >
                        <Plus className="w-3 h-3 text-white" />
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
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70">Store Total:</span>
                  <span className="text-green-300 font-bold text-lg">${storeTotal}</span>
                </div>
                <button
                  onClick={() => handleStoreCheckout(store.id)}
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Checkout from {store.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Method */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
        <h3 className="text-white font-bold mb-4">Payment Method</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '💳 Card', value: 'card' },
            { label: '📱 UPI', value: 'upi' },
            { label: '🚚 COD', value: 'cod' },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => onPaymentMethodChange(method.value)}
              className={`py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedPaymentMethod === method.value
                  ? 'bg-blue-500 text-white border-2 border-blue-400'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border-2 border-transparent'
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

