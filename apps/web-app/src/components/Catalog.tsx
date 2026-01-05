import { Store, Product } from '../screens/Home/Home.types';
import { ProductCard } from './ProductCard';

type Props = {
  store: any;
  catalog?: any[];
  onAdd: (p: any) => void;
  onRemove: (id: number) => void;
  /** NEW: quantity resolver */
  getQuantity: (productId: number) => number;
};

export function Catalog({
  store,
  catalog = [],
  onAdd,
  onRemove,
  getQuantity
}: Props) {
  // Use provided catalog or fall back to store.catalog
  const products = catalog.length > 0 ? catalog : store.catalog || [];
  
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {products.map((product: any) => {
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
