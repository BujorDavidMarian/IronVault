import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import type { DeliveryAddress } from '../types';
import AddressFormModal from '../components/AddressFormModal';

export default function AccountPage() {
    const { user, logout, saveAddress, deleteAddress, setDefaultAddress } = useAuth();
    const navigate = useNavigate();

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="mx-auto max-w-md py-12 text-center">
                <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
                    Acces Restricționat
                </h1>
                <p className="mt-2 text-sm text-muted">
                    Trebuie să fii conectat pentru a vedea detaliile contului.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="mt-6 rounded-md bg-accent px-6 py-2.5 text-sm font-semibold uppercase text-white hover:bg-accent/90"
                >
                    Mergi la Autentificare
                </button>
            </div>
        );
    }

    const handleOpenAddModal = () => {
        setEditingAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleOpenEditModal = (addr: DeliveryAddress) => {
        setEditingAddress(addr);
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async (addrData: Omit<DeliveryAddress, 'id'>) => {
        setActionError(null);
        try {
            await saveAddress(addrData, editingAddress?.id);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'Eroare la salvare.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Sigur doriți să ștergeți această adresă?')) return;
        setActionError(null);
        try {
            await deleteAddress(id);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'Eroare la ștergere.');
        }
    };

    const handleSetDefault = async (id: string) => {
        setActionError(null);
        try {
            await setDefaultAddress(id);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'Eroare la actualizare.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="space-y-8">
            {/* Account Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        Profil Atlet IronVault
                    </span>
                    <h1 className="text-3xl font-bold font-display uppercase tracking-wide">
                        {user.name}
                    </h1>
                    <p className="text-sm text-muted">
                        Email: <span className="text-ink font-medium">{user.email}</span> • Membru din {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                    </p>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md border border-line bg-paper px-4 py-2 text-sm font-semibold text-muted hover:border-red-300 hover:text-red-700 hover:bg-red-50/50 transition-colors"
                    >
                        Deconectare
                    </button>
                </div>
            </div>

            {actionError && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    {actionError}
                </div>
            )}

            {/* Saved Delivery Addresses Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold font-display uppercase tracking-wide">
                            Adrese de Livrare Salvate
                        </h2>
                        <p className="text-xs text-muted">
                            Adrese utilizate pentru calculul transportului și livrarea echipamentelor grele.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 rounded-md bg-ink px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-ink/80 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adaugă Adresă
                    </button>
                </div>

                {user.addresses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line p-8 text-center bg-white/40">
                        <svg
                            className="mx-auto h-10 w-10 text-muted/60 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <p className="text-sm font-semibold text-ink">Nu ai nicio adresă de livrare salvată.</p>
                        <p className="text-xs text-muted mt-1">
                            Adaugă o adresă pentru un checkout rapid la finalizarea comenzilor.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="mt-4 rounded-md bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-accent/90"
                        >
                            Adaugă Prima Adresă
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`relative rounded-xl border p-5 transition-shadow bg-paper ${
                                    addr.isDefault
                                        ? 'border-accent shadow-xs'
                                        : 'border-line hover:border-muted/50'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-ink text-base">
                                            {addr.fullName}
                                        </h3>
                                        {addr.isDefault && (
                                            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                                                Principală
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(addr)}
                                            className="rounded-md p-1.5 text-muted hover:text-ink hover:bg-line/40 transition-colors text-xs font-medium"
                                            title="Modifică"
                                        >
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(addr.id)}
                                            className="rounded-md p-1.5 text-muted hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
                                            title="Șterge"
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                </div>

                                <div className="text-xs text-muted space-y-1">
                                    <p className="text-ink font-medium">{addr.street}</p>
                                    <p>
                                        {addr.city}, Jud. {addr.county}{' '}
                                        {addr.postalCode ? `• Cod: ${addr.postalCode}` : ''}
                                    </p>
                                    <p className="pt-1 flex items-center gap-1.5 text-muted">
                                        <span>📞</span> {addr.phone}
                                    </p>
                                </div>

                                {!addr.isDefault && (
                                    <div className="mt-4 pt-3 border-t border-line/60">
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-xs font-medium text-accent hover:underline"
                                        >
                                            Setează ca adresă principală
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Modal */}
            <AddressFormModal
                key={editingAddress?.id ?? 'new'}
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSave={handleSaveAddress}
                initialData={editingAddress}
            />
        </div>
    );
}
