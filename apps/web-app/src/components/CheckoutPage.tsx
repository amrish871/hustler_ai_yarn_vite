import React, { useState } from "react";
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Store,
  Package,
  ChevronDown,
} from "lucide-react";

import { CartItem, CartItems } from "../screens/Home/Home.types";

interface CheckoutPageProps {
  cartItems: CartItems;
  stores: Array<{
    id: number;
    name: string;
    category: string;
    rating: number;
    distance: string;
    image: string;
    popular: string[];
  }>;
  onBack: () => void;
  onCheckout: (storeIds: Set<number>) => void;
  getTotalPrice: (storeId?: number) => string;
  removeFromCart: (itemId: number, variantId: number, storeId: number) => void;
  addToCart2: (itemId: number, variantId: number, storeId?: number) => void;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onEditPayment: () => void;
  deliveryAddress: string;
  onEditAddress: () => void;
  fulfillmentType: "delivery" | "pickup";
  onFulfillmentTypeChange: (type: "delivery" | "pickup") => void;
}

export default function CheckoutPage({
  cartItems,
  stores,
  onBack,
  onCheckout,
  getTotalPrice,
  removeFromCart,
  addToCart2,
  selectedPaymentMethod,
  onPaymentMethodChange,
  onEditPayment,
  deliveryAddress,
  onEditAddress,
  fulfillmentType,
  onFulfillmentTypeChange,
}: CheckoutPageProps) {
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize all items as selected on first render
  React.useEffect(() => {
    if (selectedItems.size === 0) {
      const allItemIds = new Set<string>();
      Object.entries(cartItems).forEach(([storeId, items]) => {
        (items as any[]).forEach((item) => {
          allItemIds.add(`${storeId}-${item.id}-${item.variant.id}`);
        });
      });
      setSelectedItems(allItemIds);
    }
  }, []);

  const toggleItemSelection = (itemKey: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemKey)) {
      newSelected.delete(itemKey);
    } else {
      newSelected.add(itemKey);
    }
    setSelectedItems(newSelected);
  };

  const calculateSelectedItemsQuantity = (): number => {
    let totalQuantity = 0;
    Object.entries(cartItems).forEach(([storeId, items]) => {
      (items as any[]).forEach((item) => {
        if (selectedItems.has(`${storeId}-${item.id}-${item.variant.id}`)) {
          totalQuantity += item.variant.quantity;
        }
      });
    });
    return totalQuantity;
  };

  const calculateStoreTotal = (storeId: number): string => {
    const itemsForStore = (cartItems[storeId] as any[]) || [];
    const total = itemsForStore
      .filter((item) =>
        selectedItems.has(`${storeId}-${item.id}-${item.variant.id}`)
      )
      .reduce((sum: number, item) => sum + item.variant.price * item.variant.quantity, 0)
      .toFixed(2);
    return total;
  };

  const calculateGrandTotal = (): string => {
    let total = 0;
    Object.entries(cartItems).forEach(([storeId, items]) => {
      total += parseFloat(calculateStoreTotal(parseInt(storeId)));
    });
    total += fulfillmentType === "pickup" ? 0 : 2.99;
    return total.toFixed(2);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert("Please select at least one item");
      return;
    }
    setShowOrderConfirmation(true);
    
    // Get stores from selected items
    const storesInCheckout = new Set<number>();
    selectedItems.forEach((itemKey) => {
      const storeId = itemKey.split('-')[0];
      storesInCheckout.add(parseInt(storeId));
    });
    
    // Call checkout for the first selected store
    // const firstStoreId = Array.from(storesInCheckout)[0];
    if (storesInCheckout.size > 0) {
      onCheckout(storesInCheckout);
    }
  };

  // Group selected items by store
  const selectedItemsByStore: Record<number, any[]> = {};
  Object.entries(cartItems).forEach(([storeId, items]) => {
    const storeIdNum = parseInt(storeId);
    const filteredItems = (items as any[]).filter((item) =>
      selectedItems.has(`${storeId}-${item.id}-${item.variant.id}`)
    );
    if (filteredItems.length > 0) {
      selectedItemsByStore[storeIdNum] = filteredItems;
    }
  });
  // from-purple-900 via-blue-900 to-indigo-900 rounded-2xl max-w-4xl shadow-2xl border border-white/20 max-h-[90vh] flex flex-col
  // Order Confirmation Modal
  if (showOrderConfirmation) {
    const grandTotal = calculateGrandTotal();
    const selectedItemCount = calculateSelectedItemsQuantity();

    return (
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-white/70 mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>

          <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20 space-y-3">
            <div className="flex justify-between text-white/80">
              <span>Items:</span>
              <span className="font-bold text-white">{selectedItemCount}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Order Total:</span>
              <span className="font-bold text-green-300">
                ${grandTotal}
              </span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Delivery Type:</span>
              <span className="font-bold text-white">
                {fulfillmentType === "delivery"
                  ? "Home Delivery"
                  : "Store Pickup"}
              </span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Payment Method:</span>
              <span className="font-bold text-white uppercase">
                {selectedPaymentMethod}
              </span>
            </div>
          </div>

          <p className="text-white/60 text-sm mb-6">
            You will receive updates about your order on your registered phone
            number.
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
  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-white/70 mb-6">
            Add items to your cart to get started
          </p>
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

  // Single Page Checkout
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
            Checkout
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
      <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
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
      </div>

      {/* Items Count and Price Badge */}
      <div className="bg-green-500/20 rounded-xl p-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-green-300" />
          <span className="text-white font-semibold">
            {calculateSelectedItemsQuantity()} items
          </span>
        </div>
        <span className="text-white font-bold text-lg">
          ${calculateGrandTotal()}
        </span>
      </div>

      {/* Store Items Section */}
      <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto mb-4 space-y-2">
        {Object.entries(cartItems).map(([storeId, items]) => {
          const storeIdNum = parseInt(storeId);
          // const storeData = stores.find((s) => s.id === storeIdNum);
          // if (!storeData || !items || items.length === 0) return null;

          const storeItemsArray = items as CartItem[];

          return storeItemsArray.map((item) => {
            const itemKey = `${storeId}-${item.id}-${item.variant.id}`;
            const isSelected = selectedItems.has(itemKey);

            return (
              <div
                key={itemKey}
                className={`rounded-xl p-3 flex items-center gap-3 transition-all ${
                  isSelected ? "bg-white/10" : "bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItemSelection(itemKey)}
                  className="w-4 h-4 cursor-pointer flex-shrink-0"
                />
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">
                    {item.name}
                  </h4>
                  <p className="text-blue-300 text-xs mb-1">{item.storeName}</p>
                  <p className="text-green-300 font-bold text-sm">
                    ${item.variant.price} x {item.variant.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.variant.id, storeIdNum)
                    }
                    className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white font-semibold w-6 text-center">
                    {item.variant.quantity}
                  </span>
                  <button
                    onClick={() =>
                      addToCart2(item.id, item.variant.id, storeIdNum)
                    }
                    className="w-8 h-8 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            );
          });
        })}
      </div>

      {/* Delivery Charges */}
      <div className="bg-white/5 rounded-xl p-3 mb-3 flex items-center justify-between">
        <span className="text-white/70 text-sm">Delivery Charges</span>
        <span className="text-white font-semibold">
          {fulfillmentType === "pickup" ? "FREE" : "$2.99"}
        </span>
      </div>

      {/* Payment Method & Checkout */}
      <div className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold transition-all flex flex-col gap-2 sticky bottom-0 z-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start flex-1" title="Payment Method">
            <span className="text-sm">Payment Method</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/70 capitalize">
                {selectedPaymentMethod === "card" && "💳 Credit Card"}
                {selectedPaymentMethod === "upi" && "📱 UPI"}
                {selectedPaymentMethod === "cod" && "🚚 Cash on Delivery"}
              </span>
              <button
                onClick={onEditPayment}
                title="Change Payment Method"
                className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-lg font-bold text-green-300 whitespace-nowrap">
              ${calculateGrandTotal()}
            </span>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.size === 0}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-bold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              Place Order
            </button>
          </div>
        </div>
        {/* Fulfillment type selection */}
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="delivery"
              checked={fulfillmentType === "delivery"}
              onChange={(e) => {
                e.stopPropagation();
                onFulfillmentTypeChange("delivery");
              }}
            />
            <span className="text-xs">Delivery</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="fulfillmentType"
              value="pickup"
              checked={fulfillmentType === "pickup"}
              onChange={(e) => {
                e.stopPropagation();
                onFulfillmentTypeChange("pickup");
              }}
            />
            <span className="text-xs">Store Pickup</span>
          </label>
        </div>
        {/* Min order info */}
        {fulfillmentType === "delivery" && (
          <div className="text-xs text-yellow-300 mt-2">
            Min order $20 to avoid delivery charges
          </div>
        )}
      </div>
    </div>
  );
}
