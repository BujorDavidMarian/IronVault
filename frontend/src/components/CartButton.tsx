import { useCart } from '../hooks/useCart';

export default function CartButton() {
    const { cart, openCart } = useCart();

    return (
        <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-line/40 transition-colors focus:outline-hidden"
            aria-label={`Coș de cumpărături cu ${cart.itemCount} produse`}
        >
            <svg
                className="h-5 w-5 text-ink"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
            <span className="hidden sm:inline font-semibold">Coș</span>
            {cart.itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white tabular-nums">
                    {cart.itemCount}
                </span>
            )}
        </button>
    );
}
