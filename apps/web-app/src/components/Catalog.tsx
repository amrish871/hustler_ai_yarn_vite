import { Store, Product, Variant } from '../screens/Home/Home.types';
import { ProductCard } from './ProductCard';

type Props = {
  store: Store;
  catalog?: Product[];
  onAdd: (p: Product, variant?: Variant) => void;
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
  const products = catalog.length > 0 ? catalog : [];
  
  return (
    <>

      <div className="grid grid-cols-2 gap-2">
        {products.map((product: Product) => {
          const quantity = getQuantity(product.id);
          console.log('Rendering ProductCard for', product.name, 'with quantity', quantity);
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
