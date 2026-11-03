import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/format';
import ProductTile from './ProductTile';

export default function CartDrawer() {
    const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isCartOpen) {
                closeCart();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, closeCart]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Coș de cumpărături">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Slide-over panel */}
            <div
                ref={drawerRef}
                className="relative z-10 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-in-out border-l border-line"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-xl font-bold uppercase tracking-wide">Coșul tău</h2>
                        <span className="rounded-full bg-line px-2 py-0.5 text-xs font-semibold tabular-nums">
                            {cart.itemCount}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="rounded p-1.5 text-muted hover:bg-line/60 hover:text-ink focus:outline-hidden"
                        aria-label="Închide coșul"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body / Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {cart.items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-muted">
                            <svg className="mb-3 h-12 w-12 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="font-medium text-ink">Coșul tău este gol</p>
                            <p className="mt-1 text-xs">Explorează echipamentele noastre de forță și adaugă produse.</p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="mt-6 rounded bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-ink/90 transition-colors"
                            >
                                Continuă cumpărăturile
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-line" role="list">
                            {cart.items.map((item) => {
                                const isMax = item.quantity >= item.stock;
                                return (
                                    <li key={item.productId} className="flex gap-4 py-4">
                                        {/* Product thumbnail */}
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded border border-line bg-paper">
                                            <ProductTile
                                                product={{
                                                    id: item.productId,
                                                    slug: item.slug,
                                                    name: item.name,
                                                    priceCents: item.priceCents,
                                                    stock: item.stock,
                                                    highlight: item.highlight,
                                                    categorySlug: item.categorySlug,
                                                    description: '',
                                                    specs: {},
                                                }}
                                            />
                                        </div>

                                        {/* Item info & controls */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link
                                                        to={`/product/${item.slug}`}
                                                        onClick={closeCart}
                                                        className="font-medium text-sm leading-tight text-ink hover:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.productId)}
                                                        className="text-muted hover:text-accent p-0.5"
                                                        title="Șterge produsul"
                                                        aria-label={`Șterge ${item.name}`}
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="mt-1 text-xs font-semibold tabular-nums text-muted">
                                                    {formatPrice(item.priceCents)}
                                                </div>
                                            </div>

                                            {/* Quantity adjustment & Line total */}
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center border border-line rounded bg-paper">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="px-2.5 py-1 text-sm font-semibold text-muted hover:text-ink hover:bg-line/40 transition-colors"
                                                        aria-label="Scade cantitatea"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-semibold tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={isMax}
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className={`px-2.5 py-1 text-sm font-semibold transition-colors ${
                                                            isMax
                                                                ? 'cursor-not-allowed text-muted/30'
                                                                : 'text-muted hover:text-ink hover:bg-line/40'
                                                        }`}
                                                        aria-label="Crește cantitatea"
                                                        title={isMax ? `Stoc maxim disponibil: ${item.stock}` : undefined}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="font-semibold text-sm tabular-nums">
                                                    {formatPrice(item.priceCents * item.quantity)}
                                                </span>
                                            </div>

                                            {isMax && (
                                                <span className="mt-1 text-[11px] text-accent">
                                                    Stoc maxim atins ({item.stock} buc.)
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer / Summary */}
                {cart.items.length > 0 && (
                    <div className="border-t border-line bg-paper/60 px-5 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Subtotal</span>
                            <span className="font-bold text-lg tabular-nums text-ink">
                                {formatPrice(cart.subtotalCents)}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted">
                            Costul de transport se calculează la checkout.
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    alert('Modulul de Checkout (A5) este în lucru conform planului săptămâna 8.');
                                }}
                                className="w-full rounded bg-accent py-3 text-center text-sm font-semibold uppercase tracking-wider text-white hover:bg-accent/90 transition-colors shadow-xs"
                            >
                                Finalizează comanda
                            </button>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="w-full py-2 text-center text-xs font-medium text-muted hover:text-ink"
                            >
                                Continuă cumpărăturile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
