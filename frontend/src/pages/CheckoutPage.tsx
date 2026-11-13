import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatAddress, formatPrice } from '../lib/format';
import CheckoutStep, { type StepState } from '../components/checkout/CheckoutStep';
import AddressPicker from '../components/checkout/AddressPicker';

type Step = 1 | 2 | 3;

const buttonClass =
    'mt-5 w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50 sm:w-auto';

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { cart, isLoading: cartLoading } = useCart();

    const [step, setStep] = useState<Step>(1);
    const [chosenAddressId, setChosenAddressId] = useState<string>();

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

    // Until the customer picks one, use their default address (or the first one).
    const address =
        user.addresses.find((a) => a.id === chosenAddressId) ??
        user.addresses.find((a) => a.isDefault) ??
        user.addresses[0];

    function stateOf(n: Step): StepState {
        return n < step ? 'done' : n === step ? 'current' : 'upcoming';
    }

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-baseline justify-between gap-4">
                <h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">Finalizare comandă</h1>
                <span className="shrink-0 text-sm text-muted tabular-nums">{formatPrice(cart.subtotalCents)}</span>
            </div>

            <div className="space-y-3">
                <CheckoutStep
                    number={1}
                    title="Adresa de livrare"
                    state={stateOf(1)}
                    onEdit={() => setStep(1)}
                    summary={address && `${address.fullName} · ${formatAddress(address)}`}
                >
                    <AddressPicker
                        addresses={user.addresses}
                        selectedId={address?.id}
                        onSelect={setChosenAddressId}
                    />
                    <button type="button" disabled={!address} onClick={() => setStep(2)} className={buttonClass}>
                        Continuă
                    </button>
                </CheckoutStep>

                <CheckoutStep number={2} title="Metoda de livrare" state={stateOf(2)} />
                <CheckoutStep number={3} title="Sumarul comenzii" state={stateOf(3)} />
            </div>
        </div>
    );
}