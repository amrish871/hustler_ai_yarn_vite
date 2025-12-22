import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Button, Input } from '@myorg/ui';
import { StoreType } from '../types';

type Props = {
  stores: StoreType[];
  onSelectStore: (store: StoreType) => void;
  onClose?: () => void;
};

export default function OrderGroceries({ stores, onSelectStore, onClose }: Props) {
  const [query, setQuery] = useState<string>('');
  const [filtered, setFiltered] = useState<StoreType[]>(stores);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim() === '') {
      setFiltered(stores);
    } else {
      const lc = q.toLowerCase();
      setFiltered(stores.filter(s => s.name.toLowerCase().includes(lc) || s.category.toLowerCase().includes(lc)));
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Nearby Grocery Stores</h3>
        <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search stores..." className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>

      <div className="bg-white/5 rounded-2xl p-4 h-96 overflow-y-auto space-y-3">
        {filtered.map(store => (
          <button key={store.id} onClick={() => onSelectStore(store)} className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{store.image}</div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">{store.name}</h4>
                <p className="text-blue-200 text-sm mb-2">{store.category}</p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />{store.rating}
                  </span>
                  <span className="flex items-center gap-1 text-white/70 text-sm">
                    <MapPin className="w-4 h-4" />{store.distance}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.popular.map((item, idx) => (
                    <span key={idx} className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
