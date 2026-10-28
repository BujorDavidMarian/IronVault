import { useParams, useSearchParams } from 'react-router';
import { getProducts } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';

export default function CatalogPage() {
    const { slug } = useParams();
    const [params] = useSearchParams();
    const page = Number(params.get('page')) || 1;

    const { data, loading } = useAsync(`products:${slug ?? 'all'}:${page}`, () =>
        getProducts({ category: slug, page }),
    );

    return (
        <>
            <h1 className="font-display text-4xl font-bold uppercase">
                {slug ? `Category: ${slug}` : 'All products'}
            </h1>
            {!data ? (
                <p className="mt-6 text-muted">Loading…</p>
            ) : (
                <>
                    <p className="mt-2 text-muted">
                        {data.totalItems} products · page {data.page} of {data.totalPages}
                    </p>
                    <ul className={`mt-6 space-y-1 ${loading ? 'opacity-50' : ''}`}>
                        {data.items.map((p) => (
                            <li key={p.id}>
                                {p.name} — {formatPrice(p.priceCents)}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}