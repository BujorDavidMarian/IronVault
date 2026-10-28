import type { Product } from '../types';
import CategoryIcon from './CategoryIcon';

const tints: Record<string, string> = {
    'free-weights': 'bg-[#e8e4de]',
    'lifting-accessories': 'bg-[#eee3d5]',
    apparel: 'bg-[#e0e5e9]',
    nutrition: 'bg-[#e2e8dd]',
};

type Props = { product: Product; large?: boolean };

// Uses the real photo when there is one, otherwise the key spec in big type.
export default function ProductTile({ product, large = false }: Props) {
    if (product.imageUrl) {
        return (
            <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-[4/3] w-full rounded-lg object-cover"
            />
        );
    }

    return (
        <div
            className={`relative flex aspect-[4/3] items-end overflow-hidden rounded-lg ${tints[product.categorySlug] ?? 'bg-line'} ${large ? 'p-6 sm:p-8' : 'p-3'}`}
        >
            <CategoryIcon
                slug={product.categorySlug}
                className={`absolute text-ink/10 ${large ? '-right-6 -top-6 size-56' : '-right-3 -top-3 size-24'}`}
            />
            <span
                className={`relative font-display font-bold uppercase leading-none ${large ? 'text-6xl sm:text-7xl' : 'text-3xl'}`}
            >
                {product.highlight}
            </span>
        </div>
    );
}