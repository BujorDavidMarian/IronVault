import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { getCategories, getProduct } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import { useCart } from '../hooks/useCart';
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
    const { cart, addToCart } = useCart();

    const [selectedQty, setSelectedQty] = useState(1);
    const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (error) return <p role="alert" className="py-16 text-center">Couldn't load this product.</p>;
    if (!loading && product === null) return <NotFoundPage />;
    if (!product || product.slug !== slug) return <ProductSkeleton />;

    const category = categories?.find((c) => c.slug === product.categorySlug);
    const cartEntry = cart.items.find((item) => item.productId === product.id);
    const alreadyInCart = cartEntry ? cartEntry.quantity : 0;
    const remainingStock = Math.max(0, product.stock - alreadyInCart);
    const isOutOfStock = product.stock <= 0;

    const handleAddToCart = async () => {
        setActionMessage(null);
        setIsSubmitting(true);
        const res = await addToCart(product, selectedQty);
        setIsSubmitting(false);

        if (!res.success) {
            setActionMessage({ text: res.message || 'Nu s-a putut adăuga în coș.', isError: true });
        } else {
            setActionMessage({ text: 'Produs adăugat în coș!', isError: false });
            setSelectedQty(1);
        }
    };

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

                {/* Add to Cart Actions */}
                <div className="mt-8 rounded-lg border border-line bg-paper/50 p-5">
                    {isOutOfStock ? (
                        <div className="rounded bg-line/60 p-3 text-center text-sm font-semibold text-muted">
                            Produsul este momentan epuizat
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="text-sm font-medium text-ink flex items-center gap-2">
                                    Cantitate:
                                    <select
                                        value={selectedQty}
                                        onChange={(e) => setSelectedQty(Number(e.target.value))}
                                        className="rounded border border-line bg-paper px-3 py-1.5 text-sm font-semibold focus:outline-hidden focus:ring-1 focus:ring-accent"
                                    >
                                        {Array.from(
                                            { length: Math.min(10, remainingStock > 0 ? remainingStock : 1) },
                                            (_, i) => i + 1
                                        ).map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {alreadyInCart > 0 && (
                                    <span className="text-xs text-muted">
                                        (Ai deja <strong className="text-ink">{alreadyInCart}</strong> în coș, stoc maxim {product.stock})
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isSubmitting || remainingStock <= 0}
                                onClick={handleAddToCart}
                                className={`w-full rounded py-3 text-center text-sm font-semibold uppercase tracking-wider text-white transition-colors shadow-xs ${
                                    remainingStock <= 0
                                        ? 'cursor-not-allowed bg-muted/50'
                                        : 'bg-accent hover:bg-accent/90'
                                }`}
                            >
                                {remainingStock <= 0 ? 'Ai atins stocul maxim' : 'Adaugă în coș'}
                            </button>

                            {actionMessage && (
                                <p
                                    role="status"
                                    className={`text-xs font-medium text-center ${
                                        actionMessage.isError ? 'text-accent' : 'text-emerald-700'
                                    }`}
                                >
                                    {actionMessage.text}
                                </p>
                            )}
                        </div>
                    )}
                </div>

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
