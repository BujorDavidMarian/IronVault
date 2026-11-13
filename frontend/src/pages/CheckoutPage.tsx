import { Link, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/format';

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { cart, isLoading: cartLoading } = useCart();

    if (authLoading || cartLoading) {
        return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-xl bg-line" aria-hidden="true" />;
    }

    // Checkout needs an account: send guests to log in, then bring them back here.
    if (!user) return <Navigate to="/login?next=/checkout" replace />;

    if (cart.items.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-lg font-medium">Coșul tău este gol</p>
                <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
                    Înapoi la magazin
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-baseline justify-between gap-4">
                <h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">Finalizare comandă</h1>
                <span className="shrink-0 text-sm text-muted tabular-nums">{formatPrice(cart.subtotalCents)}</span>
            </div>
        </div>
    );
}