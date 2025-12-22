import { Plus, Minus } from 'lucide-react';
import { Product } from '../screens/Home/Home.types';

type Props = {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove
}: Props) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 flex flex-col justify-between">
      {/* Image / Emoji */}
      <div className="text-4xl mb-2 text-center">
        {product.image}
      </div>

      {/* Name */}
      <div className="text-white text-sm font-semibold text-center">
        {product.name}
      </div>

      {/* Price */}
      <div className="text-green-300 text-sm text-center mb-2">
        ₹{product.price}
      </div>

      {/* Actions */}
      {quantity === 0 ? (
        <button
          onClick={onAdd}
          className="mt-2 bg-green-500/30 hover:bg-green-500/40 transition text-white text-sm py-1 rounded-full"
        >
          Add
        </button>
      ) : (
        <div className="mt-2 flex items-center justify-between bg-white/10 rounded-full px-2 py-1">
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full bg-red-500/30 hover:bg-red-500/40 flex items-center justify-center"
          >
            <Minus size={14} />
          </button>

          <span className="text-white text-sm font-semibold">
            {quantity}
          </span>

          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-full bg-green-500/30 hover:bg-green-500/40 flex items-center justify-center"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
