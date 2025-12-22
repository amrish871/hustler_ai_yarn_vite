import { Store } from '../screens/Home/Home.types';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Props = {
  stores: Store[];
  onSelect: (store: Store) => void;
  onClose: () => void;
};

export function StoreSearch({ stores, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');

  const filtered = stores.filter(
    s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <div className="flex justify-between mb-3">
        <h3 className="text-white font-bold">Nearby Stores</h3>
        <button onClick={onClose} className="text-white">✕</button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search store"
          className="w-full pl-9 py-2 bg-white/10 text-white rounded-full"
        />
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.map(store => (
          <button
            key={store.id}
            onClick={() => onSelect(store)}
            className="w-full bg-white/10 p-3 rounded-xl text-left hover:bg-white/20"
          >
            <div className="text-white font-semibold">{store.name}</div>
            <div className="text-white/60 text-sm">{store.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
