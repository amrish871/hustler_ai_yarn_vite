import React from "react";
import { Star } from "lucide-react";

// Types copied from HomeScreen.tsx
type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
  catalog: any[];
};

interface RecentlyVisitedStoresProps {
  recentlyVisitedStores: Store[];
  handleSelectStore: (store: Store) => void;
}

const RecentlyVisitedStores: React.FC<RecentlyVisitedStoresProps> = ({ recentlyVisitedStores, handleSelectStore }) => {
  if (recentlyVisitedStores.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-bold text-white mb-4 px-4">Recently Visited Stores</h2>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4">
        {recentlyVisitedStores.map((store) => (
          <button
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="flex-shrink-0 w-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-center"
          >
            <div className="text-4xl mb-2">{store.image}</div>
            <h3 className="font-semibold text-white mb-1 truncate">{store.name}</h3>
            <p className="text-xs text-blue-200 mb-2">{store.category}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-white">{store.rating}</span>
            </div>
            <p className="text-xs text-blue-300">{store.distance}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyVisitedStores;
