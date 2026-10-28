import { Link, useParams } from 'react-router';
import { getCategories, getProduct } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/format';
import ProductTile from '../components/ProductTile';
import StockBadge from '../components/StockBadge';
import NotFoundPage from './NotFoundPage';

function ProductSkeleton() {
    return (
        <div className="grid animate-pulse gap-8 md:grid-cols-2" aria-hidden="true">
            <div className="aspect-[4/3] rounded-lg bg-line" />
            <div className="space-y-4">
                <div className="h-4 w-1/4 rounded bg-line" />
                <div className="h-10 w-3/4 rounded bg-line" />
                <div className="h-6 w-1/3 rounded bg-line" />
            </div>
        </div>
    );
}

export default function ProductPage() {
    const { slug = '' } = useParams();
    const { data: product, loading, error } = useAsync(`product:${slug}`, () => getProduct(slug));
    const { data: categories } = useAsync('categories', getCategories);

    if (error) return <p role="alert" className="py-16 text-center">Couldn't load this product.</p>;
    if (!loading && product === null) return <NotFoundPage />;
    if (!product || product.slug !== slug) return <ProductSkeleton />;

    const category = categories?.find((c) => c.slug === product.categorySlug);

    return (
        <article className="grid gap-8 md:grid-cols-2 md:gap-12">
            <ProductTile product={product} large />

            <div>
                {category && (
                    <Link to={`/category/${category.slug}`} className="text-sm text-muted hover:text-ink">
                        ← {category.name}
                    </Link>
                )}
                <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
                    {product.name}
                </h1>

                <div className="mt-4 flex items-center gap-4">
                    <span className="text-2xl font-semibold tabular-nums">{formatPrice(product.priceCents)}</span>
                    <StockBadge stock={product.stock} />
                </div>

                <p className="mt-6 leading-relaxed text-ink/80">{product.description}</p>

                <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
                    {Object.entries(product.specs).map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-muted">{label}</dt>
                            <dd className="text-right font-medium">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </article>
    );
}