import React from "react";
import {
  MessageSquare,
  ShoppingCart,
  Grid
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


interface HeaderTabsProps {
  selectedStore: Store | null;
  currentTab: "chat" | "catalog" | "cart";
  onSetCurrentTab: (tab: "chat" | "catalog" | "cart") => void;
  onGetCartCount: () => number;
}

export default function HeaderTabs({
  selectedStore,
  currentTab,
  onSetCurrentTab,
  onGetCartCount
  
}: HeaderTabsProps) {
  

  return (
    <div className="w-full mt-6">
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
    </div>
  );
}
