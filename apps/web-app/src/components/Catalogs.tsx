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
import Cart from "./Cart";

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
  
  category: string;
  image: string;
  variants: { id: number; name: string; price: number, quantity: string; }[];
};

type CartItem = {
  storeId: number;
  id: number;
  name: string;
  brand?: string;
  price: number;
  category: string;
  image: string;
  variant: { id: number; name: string; price: number, quantity: number };
};

interface CatalogProps {
  selectedStore: Store | null;
  catalog?: Product[];
  currentTab: "chat" | "catalog" | "cart";
  catalogSearchQuery: string;
  selectedCategory: string;
  selectedBrands: Set<string>;
  showBrandDropdown: boolean;
  cart: CartItem[];
  onSetCatalogSearchQuery: (query: string) => void;
  onSetSelectedCategory: (category: string) => void;
  onSetSelectedBrands: (brands: Set<string>) => void;
  onSetShowBrandDropdown: (show: boolean) => void;
  onRemoveFromCart: (itemId: number,variantIndex: number, storeId?: number) => void;
  onAddToCart: (item: Product, variantIndex: number, storeId?: number) => void;
}

export default function Catalogs({
  selectedStore,
  catalog = [],
  currentTab,
  catalogSearchQuery,
  selectedCategory,
  selectedBrands,
  showBrandDropdown,
  onSetCatalogSearchQuery,
  onSetSelectedCategory,
  onSetSelectedBrands,
  onSetShowBrandDropdown,
  cart,
  onRemoveFromCart,
  onAddToCart,
}: CatalogProps) {
  return (
    <div className="w-full mt-6">
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
            {[
              "All",
              ...Array.from(new Set(catalog.map((item) => item.category))),
            ].map((category) => (
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
            ))}
          </div>

          {/* Brand Filters Dropdown */}
          <div className="relative mb-4 flex justify-end">
            <button
              onClick={() => onSetShowBrandDropdown(!showBrandDropdown)}
              className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Brand:{" "}
              {selectedBrands.has("All")
                ? "All"
                : `${selectedBrands.size} selected`}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBrandDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white/95 rounded-lg shadow-lg z-50 min-w-max max-h-60 overflow-y-auto">
                {[
                  "All",
                  ...Array.from(
                    new Set(catalog.map((item) => item.brand).filter(Boolean))
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
              {catalog
                .filter((item) => {
                  const matchesSearch =
                    item.name
                      .toLowerCase()
                      .includes(catalogSearchQuery.toLowerCase()) ||
                    item.category
                      .toLowerCase()
                      .includes(catalogSearchQuery.toLowerCase()) ||
                    (item.brand &&
                      item.brand
                        .toLowerCase()
                        .includes(catalogSearchQuery.toLowerCase()));
                  const matchesCategory =
                    selectedCategory === "All" ||
                    item.category === selectedCategory;
                  const matchesBrand =
                    selectedBrands.has("All") ||
                    (item.brand && selectedBrands.has(item.brand));
                  return matchesSearch && matchesCategory && matchesBrand;
                })
                .map((item) => {
                  console.log("Item:", item);
                  const variants = item?.variants || [];
                  return variants.map((variant, variantIndex) => {
                    console.log("Variant:", variant);
                    const cartItem = cart.find(
                      (c) => 
                        c.id === item.id &&
                        c.variant.id === variant.id && c.storeId === selectedStore.id
                    );
                    console.log("Cart Item:", cartItem);
                    const quantity = cartItem ? cartItem.variant.quantity : 0;
                    console.log("Quantity for item", item.name, ":", quantity);
                    return (
                      <div
                        key={variant.id}
                        className="bg-white/10 rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className="text-4xl flex-shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1 truncate">
                            {variant.name}
                          </h4>
                          {item.brand && (
                            <p className="text-gray-400 text-xs mb-1">
                              {item.brand}
                            </p>
                          )}
                          {variant.quantity && (
                            <p className="text-gray-300 text-xs mb-1">
                              {variant.quantity}
                            </p>
                          )}
                          <p className="text-blue-200 text-xs mb-1">
                            {item.category}
                          </p>
                          <p className="text-green-300 font-bold text-sm">
                            ${variant.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {quantity > 0 ? (
                            <>
                              <button
                                onClick={() => onRemoveFromCart(item.id, va)}
                                className="w-7 h-7 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3 text-white" />
                              </button>
                              <span className="text-white font-semibold w-6 text-center text-sm">
                                {quantity}
                              </span>
                              <button
                                onClick={() => onAddToCart(item, variantIndex)}
                                className="w-7 h-7 bg-green-500/30 hover:bg-green-500/50 rounded-full flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onAddToCart(item, variantIndex)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-full text-white text-xs font-semibold whitespace-nowrap"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
