import React from "react";
import { Star, MapPin } from "lucide-react";

// Types copied from HomeScreen.tsx
type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  popular: string[];
};

interface NearbyStoresProps {
  nearbyStores: Store[];
  handleSelectStore: (store: Store) => void;
}

const NearbyStores: React.FC<NearbyStoresProps> = ({ nearbyStores, handleSelectStore }) => {
  if (nearbyStores.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <div className="flex items-center gap-2 px-4 mb-4">
        <MapPin className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Nearby Stores</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-4">
        {nearbyStores.map((store) => (
          <button
            key={store.id}
            onClick={() => handleSelectStore(store)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-center"
          >
            <div className="text-4xl mb-2">{store.image}</div>
            <h3 className="font-semibold text-white mb-1 truncate text-sm">{store.name}</h3>
            <p className="text-xs text-blue-200 mb-2">{store.category}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-white">{store.rating}</span>
            </div>
            <p className="text-xs text-blue-300 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              {store.distance}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NearbyStores;
