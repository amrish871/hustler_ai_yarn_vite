import { Store, Product } from '../screens/Home/Home.types';
import { ProductCard } from './ProductCard';

type Props = {
  store: Store;
  onAdd: (p: Product) => void;
  onRemove: (id: number) => void;
  /** NEW: quantity resolver */
  getQuantity: (productId: number) => number;
};

export function Catalog({
  store,
  onAdd,
  onRemove,
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
    </>
  );
}
