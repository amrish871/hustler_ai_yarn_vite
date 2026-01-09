import React from "react";
import {
  ArrowLeft,
} from "lucide-react";



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


interface HeaderProps {
  selectedStore: Store | null;
  onSetSelectedStore: (store: Store | null) => void;
  onSetShowConversation: (show: boolean) => void;
  onSetShowCatalog: (show: boolean) => void;
 
}

export default function Header({
  selectedStore,
  onSetSelectedStore,
  onSetShowConversation,
  onSetShowCatalog,
  
}: HeaderProps) {
  

  return (
    <div className="w-full mt-6">
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
    </div>
  );
}
