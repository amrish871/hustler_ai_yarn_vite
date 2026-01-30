import React, { useRef } from "react";
import { CartItems } from "../screens/Home/Home.types";
import {
  Plus,
  Minus,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";

import { CartList } from "../screens/HomeScreen";


type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
};

type Product = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  quantity?: string;
  category: string;
  image: string;
  variants: { id: number; name: string; price: number, quantity: string }[];
};


interface CartProps {
  selectedStore: Store | null;
  currentTab: "chat" | "catalog" | "cart";
  cart: CartList;
  stores: Store[];
  selectedPaymentMethod: string;
  fulfillmentType: 'delivery' | 'pickup';
  onSetShowCheckoutPaymentModal: (show: boolean) => void;
  onSetFulfillmentType: (type: 'delivery' | 'pickup') => void;
  onGetTotalPrice: (storeId?: number) => string;
  onHandleCheckout: (storeId: number) => void;
  onGetCartCount: () => number;
  onRemoveFromCart: (sku_id: number, storeId?: number) => void;
  onAddToCart: (sku_id: number, storeId?: number) => void;
}

export default function Cart({
  selectedStore,
  currentTab,
  cart,
  stores,
  selectedPaymentMethod,
  fulfillmentType,
  onSetShowCheckoutPaymentModal,
  onSetFulfillmentType,
  onAddToCart,
  onRemoveFromCart,
  onGetCartCount,
  onGetTotalPrice,
  onHandleCheckout,
}: CartProps) {
  

  return (
    <div className="w-full mt-6">
      {/* Cart Tab */}
      {currentTab === "cart" && (
        <div>
          {onGetCartCount() > 0 ? (
            <>
              <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto mb-4 space-y-2">
                {
                  selectedStore &&
                  cart.find((c) => c.store_id === selectedStore.id)?.order_items.map((cartItem) => {
                  return (
                    <div
                      key={`${cartItem.sku_id}`}
                      className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="text-3xl">{cartItem.image_url}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">
                          {cartItem.product_name}
                        </h4>
                        <p className="text-blue-300 text-xs mb-1">{selectedStore.name}</p>
                        <p className="text-green-300 font-bold text-sm">
                          ${cartItem.unit_price} x {cartItem.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemoveFromCart(cartItem.sku_id, selectedStore.id)}
                          className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white font-semibold w-6 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onAddToCart(cartItem.sku_id, selectedStore.id)}
                          className="w-8 h-8 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-green-500/20 rounded-xl p-3 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-300" />
                  <span className="text-white font-semibold">
                    {onGetCartCount()} items
                  </span>
                </div>
                <span className="text-white font-bold text-lg">
                  ${onGetTotalPrice()}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-3 mb-3 flex items-center justify-between">
                <span className="text-white/70 text-sm">Delivery Charges</span>
                <span className="text-white font-semibold">
                  {fulfillmentType === "delivery" &&
                  selectedStore && (cart.find((c) => c.store_id === selectedStore.id)?.order_items
                    .reduce((sum, item) => sum + item.unit_price * item.quantity, 0) ?? 0) < 20
                    ? "$5.00"
                    : "FREE"}
                </span>
              </div>

              <div className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold transition-all flex flex-col gap-2">
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
                        onClick={() => {
                          onSetShowCheckoutPaymentModal(true);
                        }}
                        title="Change Payment Method"
                        className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center"
                      >
                        <ChevronDown className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-auto">
                    <span className="text-lg font-bold text-green-300 whitespace-nowrap">
                      ${onGetTotalPrice()}
                    </span>
                    <button
                      onClick={() => {
                        onHandleCheckout(selectedStore?.id || 0);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-bold transition-all flex items-center gap-2 whitespace-nowrap"
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
                        onSetFulfillmentType("delivery");
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
                        onSetFulfillmentType("pickup");
                      }}
                    />
                    <span className="text-xs">Store Pickup</span>
                  </label>
                </div>
                {/* Min order info */}
                {selectedStore && fulfillmentType === "delivery" && (
                  <div className="text-xs text-yellow-300 mt-2">
                    Min order $20 to avoid delivery charges
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">Your cart is empty</p>
              <p className="text-white/50 text-sm mt-2">
                Add items from the catalog to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
