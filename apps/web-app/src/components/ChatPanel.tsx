import React, { useRef } from "react";
import {
  Mic,
  MessageSquare,
  Send,
  Image,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  ChevronDown,
  Grid,
} from "lucide-react";

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

type CartItem = Omit<Product, 'quantity'> & { quantity: number; storeId: number };

interface ChatPanelProps {
  messages: Message[];
  inputText: string;
  selectedStore: Store | null;
  currentTab: "chat" | "catalog" | "cart";
  cart: CartItem[];
  stores: Store[];
  suggestions: Product[];
  showSuggestions: boolean;
  storeProductSuggestions: Array<{ store: Store; product: Product }>;
  isListening: boolean;
  showMediaOptions: boolean;
  catalogSearchQuery: string;
  selectedCategory: string;
  selectedBrands: Set<string>;
  showBrandDropdown: boolean;
  selectedPaymentMethod: string;
  fulfillmentType: 'delivery' | 'pickup';
  recommendationQuantities: Record<string, number>;
  
  onSetMessages: (messages: Message[]) => void;
  onSetInputText: (text: string) => void;
  onSetCurrentTab: (tab: "chat" | "catalog" | "cart") => void;
  onSetShowSuggestions: (show: boolean) => void;
  onSetStoreProductSuggestions: (suggestions: Array<{ store: Store; product: Product }>) => void;
  onSetSuggestions: (products: Product[]) => void;
  onSetSelectedStore: (store: Store | null) => void;
  onSetShowConversation: (show: boolean) => void;
  onSetShowCatalog: (show: boolean) => void;
  onSetShowMediaOptions: (show: boolean) => void;
  onSetCatalogSearchQuery: (query: string) => void;
  onSetSelectedCategory: (category: string) => void;
  onSetSelectedBrands: (brands: Set<string>) => void;
  onSetShowBrandDropdown: (show: boolean) => void;
  onSetShowCheckoutPaymentModal: (show: boolean) => void;
  onSetShowCheckout: (show: boolean) => void;
  onSetRecommendationQuantities: (quantities: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  onSetCart: (cart: CartItem[]) => void;
  onSetFulfillmentType: (type: 'delivery' | 'pickup') => void;
  
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleListening: () => void;
  onSelectSuggestion: (product: Product) => void;
  onAddToCart: (item: Product | CartItem) => void;
  onRemoveFromCart: (itemId: number, storeId?: number) => void;
  onHandleSelectRecommendation: (storeId: number, product: Product) => void;
  onGetCartCount: () => number;
  onGetTotalPrice: (storeId?: number) => string;
  onHandleCheckout: (storeId: number) => void;
}

export default function ChatPanel({
  messages,
  inputText,
  selectedStore,
  currentTab,
  cart,
  stores,
  suggestions,
  showSuggestions,
  storeProductSuggestions,
  isListening,
  showMediaOptions,
  catalogSearchQuery,
  selectedCategory,
  selectedBrands,
  showBrandDropdown,
  selectedPaymentMethod,
  fulfillmentType,
  recommendationQuantities,
  
  onSetMessages,
  onSetInputText,
  onSetCurrentTab,
  onSetShowSuggestions,
  onSetStoreProductSuggestions,
  onSetSuggestions,
  onSetSelectedStore,
  onSetShowConversation,
  onSetShowCatalog,
  onSetShowMediaOptions,
  onSetCatalogSearchQuery,
  onSetSelectedCategory,
  onSetSelectedBrands,
  onSetShowBrandDropdown,
  onSetShowCheckoutPaymentModal,
  onSetShowCheckout,
  onSetRecommendationQuantities,
  onSetCart,
  onSetFulfillmentType,
  
  onInputChange,
  onSendMessage,
  onImageUpload,
  onToggleListening,
  onSelectSuggestion,
  onAddToCart,
  onRemoveFromCart,
  onHandleSelectRecommendation,
  onGetCartCount,
  onGetTotalPrice,
  onHandleCheckout,
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onSetShowConversation(false);
              onSetShowCatalog(false);
            }}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h3 className="text-xl font-semibold text-white">
            {selectedStore ? `${selectedStore.name}` : "Chat"}
          </h3>
        </div>
        <button
          onClick={() => {
            onSetShowConversation(false);
            onSetShowCatalog(false);
            onSetSelectedStore(null);
          }}
          className="text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tab Navigation - Only show when store is selected */}
      {selectedStore && (
        <div className="flex gap-2 mb-4 bg-white/5 p-3 rounded-lg">
          <button
            onClick={() => onSetCurrentTab("catalog")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-3 border ${
              currentTab === "catalog"
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-transparent text-white/70 hover:text-white border-white/30"
            }`}
          >
            <Grid className="w-4 h-4" />
            Catalog
          </button>
          <button
            onClick={() => onSetCurrentTab("cart")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border relative ${
              currentTab === "cart"
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-transparent text-white/70 hover:text-white border-white/30"
            }`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-5 h-5" />
              {onGetCartCount() > 0 && (
                <span className="absolute -top-3 left-2.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {onGetCartCount()}
                </span>
              )}
            </div>
            <span className="text-sm">Cart</span>
          </button>
          <button
            onClick={() => onSetCurrentTab("chat")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-3 border ${
              currentTab === "chat"
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-transparent text-white/70 hover:text-white border-white/30"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>
      )}

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

      {/* Catalog Tab */}
      {currentTab === "catalog" && selectedStore && (
        <div>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={catalogSearchQuery}
              onChange={(e) => onSetCatalogSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {["All", ...Array.from(new Set(selectedStore.catalog.map((item) => item.category)))].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => onSetSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Brand Filters Dropdown */}
          <div className="relative mb-4 flex justify-end">
            <button
              onClick={() => onSetShowBrandDropdown(!showBrandDropdown)}
              className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Brand: {selectedBrands.has("All") ? "All" : `${selectedBrands.size} selected`}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBrandDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white/95 rounded-lg shadow-lg z-50 min-w-max max-h-60 overflow-y-auto">
                {[
                  "All",
                  ...Array.from(
                    new Set(selectedStore.catalog.map((item) => item.brand).filter(Boolean))
                  ),
                ].map((brand) => (
                  <label
                    key={brand}
                    className="block px-4 py-2 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-3 text-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.has(brand as string)}
                      onChange={(e) => {
                        const newBrands = new Set(selectedBrands);
                        if (brand === "All") {
                          if (e.target.checked) {
                            newBrands.clear();
                            newBrands.add("All");
                          }
                        } else {
                          newBrands.delete("All");
                          if (e.target.checked) {
                            newBrands.add(brand as string);
                          } else {
                            newBrands.delete(brand as string);
                          }
                          if (newBrands.size === 0) {
                            newBrands.add("All");
                          }
                        }
                        onSetSelectedBrands(newBrands);
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {selectedStore.catalog
                .filter((item) => {
                  const matchesSearch =
                    item.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                    item.category.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                    (item.brand &&
                      item.brand.toLowerCase().includes(catalogSearchQuery.toLowerCase()));
                  const matchesCategory =
                    selectedCategory === "All" || item.category === selectedCategory;
                  const matchesBrand =
                    selectedBrands.has("All") ||
                    (item.brand && selectedBrands.has(item.brand));
                  return matchesSearch && matchesCategory && matchesBrand;
                })
                .map((item) => {
                  const cartItem = cart.find(
                    (c) => c.id === item.id && c.storeId === selectedStore.id
                  );
                  const quantity = cartItem ? cartItem.quantity : 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="text-4xl flex-shrink-0">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm mb-1 truncate">
                          {item.name}
                        </h4>
                        {item.brand && (
                          <p className="text-gray-400 text-xs mb-1">{item.brand}</p>
                        )}
                        {item.quantity && (
                          <p className="text-gray-300 text-xs mb-1">{item.quantity}</p>
                        )}
                        <p className="text-blue-200 text-xs mb-1">{item.category}</p>
                        <p className="text-green-300 font-bold text-sm">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {quantity > 0 ? (
                          <>
                            <button
                              onClick={() => onRemoveFromCart(item.id)}
                              className="w-7 h-7 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-white" />
                            </button>
                            <span className="text-white font-semibold w-6 text-center text-sm">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onAddToCart(item)}
                              className="w-7 h-7 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onAddToCart(item)}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Cart Tab */}
      {currentTab === "cart" && (
        <div>
          {onGetCartCount() > 0 ? (
            <>
              <div className="bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto mb-4 space-y-2">
                {cart.map((cartItem) => {
                  const store = stores.find((s) => s.id === cartItem.storeId);
                  if (!store) return null;

                  return (
                    <div
                      key={`${cartItem.storeId}-${cartItem.id}`}
                      className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="text-3xl">{cartItem.image}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">
                          {cartItem.name}
                        </h4>
                        <p className="text-blue-300 text-xs mb-1">{store.name}</p>
                        <p className="text-green-300 font-bold text-sm">
                          ${cartItem.price} x {cartItem.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemoveFromCart(cartItem.id, cartItem.storeId)}
                          className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white font-semibold w-6 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onAddToCart(cartItem)}
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
                  cart
                    .filter((c) => c.storeId === selectedStore?.id)
                    .reduce((sum, item) => sum + item.price * item.quantity, 0) < 20
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
