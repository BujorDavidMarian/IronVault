import { Link } from 'react-router';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import ProductTile from './ProductTile';
import StockBadge from './StockBadge';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link to={`/product/${product.slug}`} className="group block">
            <ProductTile product={product} />
            <h3 className="mt-3 line-clamp-2 text-sm font-medium group-hover:underline">{product.name}</h3>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="font-semibold tabular-nums">{formatPrice(product.priceCents)}</span>
                <StockBadge stock={product.stock} />
            </div>
        </Link>
    );
}