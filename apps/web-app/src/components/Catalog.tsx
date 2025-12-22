import { Store, Product } from '../screens/Home/Home.types';
import { ProductCard } from './ProductCard';

type Props = {
  store: Store;
  cartCount: number;
  total: number;

  onAdd: (p: Product) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;

  /** NEW: quantity resolver */
  getQuantity: (productId: number) => number;
};

export function Catalog({
  store,
  cartCount,
  total,
  onAdd,
  onRemove,
  onCheckout,
  getQuantity
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {store.catalog.map(product => {
          const quantity = getQuantity(product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              onAdd={() => onAdd(product)}
              onRemove={() => onRemove(product.id)}
            />
          );
        })}
      </div>

      {cartCount > 0 && (
        <button
          onClick={onCheckout}
          className="w-full mt-4 py-3 bg-green-500 rounded-full text-white font-bold"
        >
          Checkout – ₹{total.toFixed(2)}
        </button>
      )}
    </>
  );
}
