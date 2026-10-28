import type { ReactNode } from 'react';
import type { AsyncState } from '../hooks/useAsync';
import type { Paged, Product } from '../types';
import Pagination from './Pagination';
import ProductGrid, { GridSkeleton } from './ProductGrid';

type Props = { state: AsyncState<Paged<Product>>; empty: ReactNode };

export default function ProductResults({ state, empty }: Props) {
    const { data, loading, error } = state;

    if (error) {
        return (
            <div role="alert" className="py-16 text-center">
                <p className="font-medium">Couldn't load products.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-full border border-ink px-5 py-2 text-sm font-medium hover:bg-ink hover:text-paper"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!data) return <GridSkeleton />;
    if (data.items.length === 0) return <>{empty}</>;

    return (
        <div aria-busy={loading} className={`transition-opacity ${loading ? 'opacity-50' : ''}`}>
            <ProductGrid products={data.items} />
            <Pagination page={data.page} totalPages={data.totalPages} />
        </div>
    );
}