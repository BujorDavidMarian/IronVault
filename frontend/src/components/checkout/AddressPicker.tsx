import { useEffect, useRef, useState } from 'react';
import type { DeliveryAddress } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { formatAddress } from '../../lib/format';
import AddressFormModal from '../AddressFormModal';

type Props = {
    addresses: DeliveryAddress[];
    selectedId: string | undefined;
    onSelect: (id: string) => void;
};

export default function AddressPicker({ addresses, selectedId, onSelect }: Props) {
    const { saveAddress } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // When a new address appears in the list (just added through the form), select it.
    const knownIds = useRef(new Set(addresses.map((a) => a.id)));
    useEffect(() => {
        const added = addresses.find((a) => !knownIds.current.has(a.id));
        if (added) onSelect(added.id);
        knownIds.current = new Set(addresses.map((a) => a.id));
    }, [addresses, onSelect]);

    return (
        <>
            <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((address) => (
                    <label
                        key={address.id}
                        className={`relative flex cursor-pointer gap-3 rounded-lg border p-4 text-sm transition-colors ${
                            address.id === selectedId ? 'border-ink bg-white' : 'border-line hover:border-muted'
                        }`}
                    >
                        <input
                            type="radio"
                            name="address"
                            checked={address.id === selectedId}
                            onChange={() => onSelect(address.id)}
                            className="mt-0.5 accent-ink"
                        />
                        <span>
                            <span className="block font-medium">{address.fullName}</span>
                            <span className="mt-1 block text-muted">{formatAddress(address)}</span>
                            <span className="mt-1 block text-muted tabular-nums">{address.phone}</span>
                        </span>
                    </label>
                ))}

                <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line p-4 text-sm font-medium text-muted hover:border-ink hover:text-ink"
                >
                    + Adresă nouă
                </button>
            </div>

            {isFormOpen && (
                <AddressFormModal
                    isOpen
                    onClose={() => setIsFormOpen(false)}
                    onSave={(address) => saveAddress(address)}
                />
            )}
        </>
    );
}