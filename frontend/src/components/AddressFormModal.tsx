import { useState, type FormEvent } from 'react';
import type { DeliveryAddress } from '../types';

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Omit<DeliveryAddress, 'id'>) => Promise<void>;
    initialData?: DeliveryAddress | null;
}

export default function AddressFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: AddressFormModalProps) {
    const [fullName, setFullName] = useState(initialData?.fullName ?? '');
    const [phone, setPhone] = useState(initialData?.phone ?? '');
    const [street, setStreet] = useState(initialData?.street ?? '');
    const [city, setCity] = useState(initialData?.city ?? '');
    const [county, setCounty] = useState(initialData?.county ?? '');
    const [postalCode, setPostalCode] = useState(initialData?.postalCode ?? '');
    const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !county.trim()) {
            setError('Toate câmpurile marcate sunt obligatorii.');
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                fullName: fullName.trim(),
                phone: phone.trim(),
                street: street.trim(),
                city: city.trim(),
                county: county.trim(),
                postalCode: postalCode.trim(),
                isDefault,
            });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Eroare la salvarea adresei.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-xl border border-line bg-paper p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                    <h2 className="text-xl font-bold font-display uppercase tracking-wide">
                        {initialData ? 'Modifică Adresa de Livrare' : 'Adaugă Adresă Nouă'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1.5 text-muted hover:bg-line/40 hover:text-ink transition-colors"
                        aria-label="Închide"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Nume Destinatar *
                        </label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="ex: David Marian"
                            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Număr Telefon *
                        </label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="ex: +40 721 000 111"
                            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                            Stradă, Număr, Bloc/Apartament *
                        </label>
                        <input
                            type="text"
                            required
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="ex: Strada Observatorului 34, Bl. A2, Ap. 15"
                            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Oraș *
                            </label>
                            <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Cluj-Napoca"
                                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Județ *
                            </label>
                            <input
                                type="text"
                                required
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                                placeholder="Cluj"
                                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                                Cod Poștal
                            </label>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                placeholder="400000"
                                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="h-4 w-4 rounded border-line text-accent accent-accent focus:ring-accent"
                        />
                        <span className="text-sm text-ink font-medium">
                            Setează ca adresă principală de livrare
                        </span>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-line/30 transition-colors"
                        >
                            Anulează
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-xs"
                        >
                            {isSaving ? 'Se salvează...' : 'Salvează Adresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
