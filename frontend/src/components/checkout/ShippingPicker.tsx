import type { ShippingMethod, ShippingMethodId } from '../../types';
import { FREE_SHIPPING_FROM_CENTS } from '../../lib/shipping';
import { formatPrice, shippingPriceLabel } from '../../lib/format';

type Props = {
    methods: ShippingMethod[];
    selectedId: ShippingMethodId;
    onSelect: (id: ShippingMethodId) => void;
};

export default function ShippingPicker({ methods, selectedId, onSelect }: Props) {
    const standard = methods.find((m) => m.id === 'standard');

    return (
        <div className="space-y-3">
            {methods.map((method) => (
                <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition-colors ${
                        method.id === selectedId ? 'border-ink bg-white' : 'border-line hover:border-muted'
                    }`}
                >
                    <input
                        type="radio"
                        name="shipping"
                        checked={method.id === selectedId}
                        onChange={() => onSelect(method.id)}
                        className="accent-ink"
                    />
                    <span className="flex-1">
                        <span className="block font-medium">{method.name}</span>
                        <span className="block text-muted">{method.eta}</span>
                    </span>
                    <span className={`font-semibold tabular-nums ${method.costCents === 0 ? 'text-emerald-700' : ''}`}>
                        {shippingPriceLabel(method.costCents)}
                    </span>
                </label>
            ))}

            {standard && standard.costCents > 0 && (
                <p className="text-xs text-muted">
                    Curier standard gratuit pentru comenzi de peste {formatPrice(FREE_SHIPPING_FROM_CENTS)}.
                </p>
            )}
        </div>
    );
}