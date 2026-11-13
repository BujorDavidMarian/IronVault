import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import type { ShippingMethodId } from '../types';
import { createOrder } from '../api/orders';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { shippingMethodsFor } from '../lib/shipping';
import { formatAddress, formatPrice, shippingPriceLabel } from '../lib/format';
import CheckoutStep, { type StepState } from '../components/checkout/CheckoutStep';
import AddressPicker from '../components/checkout/AddressPicker';
import ShippingPicker from '../components/checkout/ShippingPicker';
import OrderBreakdown from '../components/OrderBreakdown';

type Step = 1 | 2 | 3;

const buttonClass =
    'mt-5 w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-50 sm:w-auto';

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { cart, isLoading: cartLoading, clearCart } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>(1);
    const [chosenAddressId, setChosenAddressId] = useState<string>();
    const [shippingId, setShippingId] = useState<ShippingMethodId>('standard');
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (authLoading || cartLoading) {
        return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-xl bg-line" aria-hidden="true" />;
    }

    // Checkout needs an account: send guests to log in, then bring them back here.
    if (!user) return <Navigate to="/login?next=/checkout" replace />;

    // `!placing`: right after ordering the cart empties; don't flash "empty cart" before the order page opens.
    if (cart.items.length === 0 && !placing) {
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

    const methods = shippingMethodsFor(cart.subtotalCents);
    const shipping = methods.find((m) => m.id === shippingId) ?? methods[0];

    function stateOf(n: Step): StepState {
        return n < step ? 'done' : n === step ? 'current' : 'upcoming';
    }

    async function placeOrder() {
        if (!user || !address) return;
        setPlacing(true);
        setError(null);
        try {
            const order = await createOrder({
                userId: user.id,
                items: cart.items,
                address,
                shippingMethod: shipping.id,
            });
            navigate(`/order/${order.id}`, { replace: true });
            void clearCart();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Comanda nu a putut fi plasată.');
            setPlacing(false);
        }
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

                <CheckoutStep
                    number={2}
                    title="Metoda de livrare"
                    state={stateOf(2)}
                    onEdit={() => setStep(2)}
                    summary={`${shipping.name} · ${shippingPriceLabel(shipping.costCents)}`}
                >
                    <ShippingPicker methods={methods} selectedId={shipping.id} onSelect={setShippingId} />
                    <button type="button" onClick={() => setStep(3)} className={buttonClass}>
                        Continuă
                    </button>
                </CheckoutStep>

                <CheckoutStep number={3} title="Sumarul comenzii" state={stateOf(3)}>
                    <OrderBreakdown
                        items={cart.items}
                        subtotalCents={cart.subtotalCents}
                        shippingCents={shipping.costCents}
                    />
                    {error && (
                        <p role="alert" className="mt-2 text-sm text-red-700">
                            {error}
                        </p>
                    )}
                    <button type="button" disabled={placing} onClick={placeOrder} className={buttonClass}>
                        {placing ? 'Se plasează…' : `Plasează comanda · ${formatPrice(cart.subtotalCents + shipping.costCents)}`}
                    </button>
                </CheckoutStep>
            </div>
        </div>
    );
}