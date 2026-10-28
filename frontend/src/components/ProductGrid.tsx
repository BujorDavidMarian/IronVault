import type { Product } from '../types';
import ProductCard from './ProductCard';

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4';

export default function ProductGrid({ products }: { products: Product[] }) {
    return (
        <ul className={gridClass}>
            {products.map((product) => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <ul className={gridClass} aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <li key={i} className="animate-pulse">
                    <div className="aspect-[4/3] rounded-lg bg-line" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-line" />
                    <div className="mt-2 h-4 w-1/3 rounded bg-line" />
                </li>
            ))}
        </ul>
    );
}