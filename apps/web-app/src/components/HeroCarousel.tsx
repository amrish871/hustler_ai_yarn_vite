import { Mic, MessageSquare, Store } from 'lucide-react';

type Props = {
  isListening: boolean;
  cartCount: number;
  onToggleListening: () => void;
  onChat: () => void;
  onBrowse: () => void;
};

export function HeroCarousel({
  isListening,
  cartCount,
  onToggleListening,
  onChat,
  onBrowse
}: Props) {
  return (
    <div className="bg-white/10 rounded-3xl p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Voice AI Assistant
      </h2>

      <button
        onClick={onToggleListening}
        className={`w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center transition ${
          isListening
            ? 'bg-red-500 animate-pulse'
            : 'bg-blue-500'
        }`}
      >
        <Mic className="w-10 h-10 text-white" />
      </button>

      <div className="flex justify-center gap-3">
        <button
          onClick={onChat}
          className="px-5 py-2 bg-white/20 rounded-full text-white flex gap-2"
        >
          <MessageSquare size={16} />
          Chat
        </button>

        <button
          onClick={onBrowse}
          className="px-5 py-2 bg-white/20 rounded-full text-white flex gap-2"
        >
          <Store size={16} />
          Browse
        </button>
      </div>

      {cartCount > 0 && (
        <p className="text-green-300 mt-4">
          {cartCount} items in cart
        </p>
      )}
    </div>
  );
}
