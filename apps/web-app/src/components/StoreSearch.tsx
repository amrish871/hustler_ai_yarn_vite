import React from "react";
import { Search, Star, MapPin } from "lucide-react";

// Types copied from HomeScreen.tsx
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

interface StoreSearchProps {
  storeSearchQuery: string;
  filteredStores: Store[];
  handleStoreSearch: (query: string) => void;
  handleSelectStore: (store: Store) => void;
  setShowStoreSearch: (show: boolean) => void;
}

const StoreSearch: React.FC<StoreSearchProps> = ({
  storeSearchQuery,
  filteredStores,
  handleStoreSearch,
  handleSelectStore,
  setShowStoreSearch,
}) => {
  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Nearby Grocery Stores
        </h3>
        <button
          onClick={() => setShowStoreSearch(false)}
          className="text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={storeSearchQuery}
          onChange={(e) => handleStoreSearch(e.target.value)}
          placeholder="Search stores..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="bg-white/5 rounded-2xl p-4 h-96 overflow-y-auto space-y-3">
        {filteredStores.map((store) => (
          <button
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{store.image}</div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">
                  {store.name}
                </h4>
                <p className="text-blue-200 text-sm mb-2">{store.category}</p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {store.rating}
                  </span>
                  <span className="flex items-center gap-1 text-white/70 text-sm">
                    <MapPin className="w-4 h-4" />
                    {store.distance}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.popular.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreSearch;
