import React, { useRef } from "react";
import {
  Mic,
  Send,
  Image
} from "lucide-react";

import { CartItems } from "../screens/Home/Home.types";

type Message = {
  text?: string;
  image?: string | null;
  sender: "user" | "ai";
  recommendations?: Array<{ storeId: number; store: Store; product: Product }>;
};

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
  variants: { id: number; name: string; price: number }[];
};


interface ChatPanelProps {
  messages: Message[];
  inputText: string;
  selectedStore: Store | null;
  currentTab: "chat" | "catalog" | "cart";
  cart: CartItems;
  stores: Store[];
  suggestions: Product[];
  showSuggestions: boolean;
  storeProductSuggestions: Array<{ store: Store; product: Product }>;
  isListening: boolean;
  showMediaOptions: boolean;
  recommendationQuantities: Record<string, number>;
  onSetInputText: (text: string) => void;
  onSetShowSuggestions: (show: boolean) => void;
  onSetStoreProductSuggestions: (suggestions: Array<{ store: Store; product: Product }>) => void;
  onSetSelectedStore: (store: Store | null) => void;
  onSetShowCatalog: (show: boolean) => void;
  onSetShowMediaOptions: (show: boolean) => void;
  onSetRecommendationQuantities: (quantities: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleListening: () => void;
  onSelectSuggestion: (product: Product) => void;
  onHandleSelectRecommendation: (storeId: number, product: Product) => void;
  
}

export default function ChatPanel({
  messages,
  inputText,
  selectedStore,
  currentTab,
  cart,
  suggestions,
  showSuggestions,
  storeProductSuggestions,
  isListening,
  showMediaOptions,
  recommendationQuantities,
  onSetInputText,
  onSetShowSuggestions,
  onSetStoreProductSuggestions,
  onSetSelectedStore,
  onSetShowCatalog,
  onSetShowMediaOptions,
  onSetRecommendationQuantities,
  onInputChange,
  onSendMessage,
  onImageUpload,
  onToggleListening,
  onSelectSuggestion,
  onHandleSelectRecommendation,
}: ChatPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full mt-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onImageUpload}
        className="hidden"
      />

      {/* Header */}
      {/* Tab Navigation - Only show when store is selected */}
      

      {/* Chat Section */}
      {(!selectedStore || currentTab === "chat") && (
        <>
          {selectedStore ? (
            // Store-specific chat
            <div className="bg-white/5 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
              <p className="text-white/70 text-center mt-20">
                Browse {selectedStore.name} catalog or add items to cart
              </p>
            </div>
          ) : (
            // General chat
            <div className="bg-white/5 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-white/50 text-center mt-20">No messages yet</p>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={`msg-${idx}-${msg.sender}`}>
                      <div
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {msg.image ? (
                            <img
                              src={msg.image}
                              alt="Uploaded"
                              className="rounded-lg max-w-full"
                            />
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>

                      {/* Render recommendations if present */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.recommendations.map((rec, recIdx) => {
                            const key = `${rec.storeId}-${rec.product.id}`;
                            const qty = recommendationQuantities[key] || 1;
                            return (
                              <div
                                key={`rec-${idx}-${recIdx}`}
                                className="bg-white/10 rounded-lg p-3 border border-green-500/30"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-2xl flex-shrink-0">
                                    {rec.product.image}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white">
                                      {rec.product.name}
                                    </h4>
                                    {rec.product.brand && (
                                      <p className="text-xs text-white/70">
                                        Brand: {rec.product.brand}
                                      </p>
                                    )}
                                    {rec.product.quantity && (
                                      <p className="text-xs text-white/70">
                                        {rec.product.quantity}
                                      </p>
                                    )}
                                    <p className="text-green-400 font-bold mt-1">
                                      ${rec.product.price}
                                    </p>
                                    <p className="text-xs text-blue-300 mt-1">
                                      Store: {rec.store.name}
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                                      <button
                                        onClick={() =>
                                          onSetRecommendationQuantities((prev: any) => ({
                                            ...prev,
                                            [key]: Math.max(1, (prev[key] || 1) - 1),
                                          }))
                                        }
                                        className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white"
                                      >
                                        −
                                      </button>
                                      <span className="text-white font-semibold min-w-[1.5rem] text-center">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() =>
                                          onSetRecommendationQuantities((prev: any) => ({
                                            ...prev,
                                            [key]: (prev[key] || 1) + 1,
                                          }))
                                        }
                                        className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button
                                      onClick={() =>
                                        onHandleSelectRecommendation(
                                          rec.storeId,
                                          rec.product
                                        )
                                      }
                                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => onSetShowMediaOptions(!showMediaOptions)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              title="Upload image"
            >
              <Image className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onToggleListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSendMessage();
                    onSetShowSuggestions(false);
                  }
                }}
                placeholder="Type message..."
                autoFocus
                className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="off"
              />
              {/* Suggestions Dropdown (single store) */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-blue-950/95 backdrop-blur-md rounded-2xl shadow-lg z-[9999] max-h-64 overflow-y-auto p-2">
                  <div className="space-y-2">
                    {suggestions.map((product) => {
                      const cartItem = cart.find(
                        (c) => c.id === product.id && c.storeId === selectedStore?.id
                      );
                      const quantity = cartItem ? cartItem.quantity : 0;
                      return (
                        <button
                          key={product.id}
                          onClick={() => onSelectSuggestion(product)}
                          className="w-full bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/15 transition-colors text-left"
                        >
                          <div className="text-4xl flex-shrink-0">
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate">
                              {product.name}
                            </h4>
                            {product.brand && (
                              <p className="text-gray-400 text-xs mb-1">
                                {product.brand}
                              </p>
                            )}
                            {product.quantity && (
                              <p className="text-gray-300 text-xs mb-1">
                                {product.quantity}
                              </p>
                            )}
                            <p className="text-blue-200 text-xs">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-green-300 font-bold text-sm mb-1">
                              ${product.price}
                            </p>
                            {quantity > 0 && (
                              <p className="text-blue-300 text-xs font-semibold">
                                {quantity}x in cart
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Suggestions Dropdown (multi-store) */}
              {showSuggestions &&
                storeProductSuggestions.length > 0 &&
                !inputText
                  .toLowerCase()
                  .match(
                    /help|recommend|suggest|what should|what do you suggest|i need help|can you help|any suggestions|what do you recommend|guide me|assist me/
                  ) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-blue-950/95 backdrop-blur-md rounded-2xl shadow-lg z-[9999] max-h-64 overflow-y-auto p-2">
                    <div className="space-y-2">
                      {storeProductSuggestions.map(({ store, product }, idx) => (
                        <button
                          key={store.id + "-" + product.id + "-" + idx}
                          onClick={() => {
                            onSetSelectedStore(store);
                            onSetInputText(product.name);
                            onSetShowSuggestions(false);
                            onSetStoreProductSuggestions([]);
                            onSetShowCatalog(true);
                          }}
                          className="w-full bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/15 transition-colors text-left"
                        >
                          <div className="text-4xl flex-shrink-0">
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate">
                              {product.name}
                            </h4>
                            {product.brand && (
                              <p className="text-gray-400 text-xs mb-1">
                                {product.brand}
                              </p>
                            )}
                            {product.quantity && (
                              <p className="text-gray-300 text-xs mb-1">
                                {product.quantity}
                              </p>
                            )}
                            <p className="text-blue-200 text-xs">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 min-w-[80px]">
                            <p className="text-green-300 font-bold text-sm mb-1">
                              ${product.price}
                            </p>
                            <p className="text-blue-300 text-xs font-semibold">
                              {store.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <button
              onClick={onSendMessage}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </>
      )}

      
    </div>
  );
}
