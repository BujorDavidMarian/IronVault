import type { OrderItem } from '../types';
import { formatPrice, shippingPriceLabel } from '../lib/format';

type Props = {
    items: OrderItem[];
    subtotalCents: number;
    shippingCents: number;
};

// The receipt: every line, then subtotal, delivery and total.
export default function OrderBreakdown({ items, subtotalCents, shippingCents }: Props) {
    return (
        <div className="text-sm">
            <ul className="divide-y divide-line border-y border-line">
                {items.map((item) => (
                    <li key={item.productId} className="flex items-baseline gap-3 py-3">
                        <span className="w-8 shrink-0 text-muted tabular-nums">{item.quantity}×</span>
                        <span className="flex-1">{item.name}</span>
                        <span className="tabular-nums">{formatPrice(item.priceCents * item.quantity)}</span>
                    </li>
                ))}
            </ul>

            <dl className="space-y-1.5 py-3">
                <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted">Livrare</dt>
                    <dd className="tabular-nums">{shippingPriceLabel(shippingCents)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{formatPrice(subtotalCents + shippingCents)}</dd>
                </div>
            </dl>
        </div>
    );
}