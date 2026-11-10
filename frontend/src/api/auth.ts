import type { AuthResponse, DeliveryAddress, User } from '../types';

const AUTH_STORAGE_KEY = 'ironvault_auth_v1';
const USERS_STORAGE_KEY = 'ironvault_users_db_v1';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_URL = import.meta.env.VITE_API_URL ?? '';

interface StoredDbUser {
    id: string;
    email: string;
    name: string;
    // Password hash simulation in client mock
    passwordHash: string;
    addresses: DeliveryAddress[];
    createdAt: string;
}

// Initial demo users seeded in mock storage
const DEFAULT_MOCK_USERS: StoredDbUser[] = [
    {
        id: 'usr_demo_athlete',
        email: 'athlete@ironvault.ro',
        name: 'David Marian',
        // In real backend: argon2/bcrypt hash. Here simulated with bcrypt marker format
        passwordHash: '$2b$12$e8x...simulated_bcrypt_hash_for_ironvault2026',
        addresses: [
            {
                id: 'addr_1',
                fullName: 'David Marian',
                phone: '+40 721 000 111',
                street: 'Strada Barcău 14, Ap. 12',
                city: 'Cluj-Napoca',
                county: 'Cluj',
                postalCode: '400400',
                isDefault: true,
            },
            {
                id: 'addr_2',
                fullName: 'David Marian (Sala & Gym)',
                phone: '+40 721 000 111',
                street: 'Bulevardul Muncii 88',
                city: 'Cluj-Napoca',
                county: 'Cluj',
                postalCode: '400641',
                isDefault: false,
            },
        ],
        createdAt: '2026-02-15T10:00:00.000Z',
    },
];

function getStoredUsers(): StoredDbUser[] {
    try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
            return DEFAULT_MOCK_USERS;
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : DEFAULT_MOCK_USERS;
    } catch {
        return DEFAULT_MOCK_USERS;
    }
}

function saveStoredUsers(users: StoredDbUser[]) {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
        // storage disabled or quota exceeded
    }
}

function getStoredAuth(): { user: User; token: string } | null {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveStoredAuth(auth: { user: User; token: string } | null) {
    try {
        if (!auth) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } else {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
        }
    } catch {
        // storage disabled
    }
}

export async function fetchCurrentUser(): Promise<User | null> {
    if (!USE_MOCK) {
        const auth = getStoredAuth();
        if (!auth?.token) return null;
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
            credentials: 'include',
        });
        if (!res.ok) {
            saveStoredAuth(null);
            return null;
        }
        const data = await res.json();
        return data.user;
    }

    const currentAuth = getStoredAuth();
    if (!currentAuth) return null;

    // Refresh from db to get updated addresses
    const users = getStoredUsers();
    const existing = users.find((u) => u.id === currentAuth.user.id);
    if (!existing) {
        saveStoredAuth(null);
        return null;
    }

    const updatedUser: User = {
        id: existing.id,
        email: existing.email,
        name: existing.name,
        addresses: existing.addresses,
        createdAt: existing.createdAt,
    };
    saveStoredAuth({ user: updatedUser, token: currentAuth.token });
    return updatedUser;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();

    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: cleanEmail, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Autentificare eșuată. Verificați credențialele.');
        }
        const data: AuthResponse = await res.json();
        saveStoredAuth(data);
        return data;
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
        throw new Error('Nu există niciun cont înregistrat cu această adresă de email.');
    }

    // Demo password or user check
    if (password.length < 6) {
        throw new Error('Parola trebuie să aibă minim 6 caractere.');
    }

    // Check demo password (if athlete demo account, check for 'ironvault2026' or accept password >= 6 chars for testing)
    if (user.email === 'athlete@ironvault.ro' && password !== 'ironvault2026' && password !== 'password123') {
        throw new Error('Parolă incorectă pentru contul demonstrativ (folosiți: ironvault2026).');
    }

    const authData: AuthResponse = {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            addresses: user.addresses,
            createdAt: user.createdAt,
        },
        token: `mock_jwt_token_${user.id}_${Date.now()}`,
    };

    saveStoredAuth(authData);
    return authData;
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
        throw new Error('Vă rugăm să introduceți numele complet.');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Vă rugăm să introduceți o adresă de email validă.');
    }
    if (!password || password.length < 6) {
        throw new Error('Parola trebuie să conțină cel puțin 6 caractere.');
    }

    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Înregistrarea a eșuat.');
        }
        const data: AuthResponse = await res.json();
        saveStoredAuth(data);
        return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
        throw new Error('Există deja un cont înregistrat cu acest email.');
    }

    const newUser: StoredDbUser = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: cleanName,
        passwordHash: `$2b$12$mock_hashed_with_argon2_bcrypt_${Date.now()}`,
        addresses: [],
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    const authData: AuthResponse = {
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            addresses: newUser.addresses,
            createdAt: newUser.createdAt,
        },
        token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
    };

    saveStoredAuth(authData);
    return authData;
}

export async function logoutUser(): Promise<void> {
    if (!USE_MOCK) {
        const auth = getStoredAuth();
        if (auth?.token) {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${auth.token}` },
                credentials: 'include',
            }).catch(() => {});
        }
    }
    saveStoredAuth(null);
}

export async function saveAddressApi(
    addressData: Omit<DeliveryAddress, 'id'>,
    addressId?: string
): Promise<DeliveryAddress[]> {
    if (!USE_MOCK) {
        const auth = getStoredAuth();
        const url = addressId ? `${API_URL}/api/addresses/${addressId}` : `${API_URL}/api/addresses`;
        const method = addressId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth?.token}`,
            },
            credentials: 'include',
            body: JSON.stringify(addressData),
        });
        if (!res.ok) throw new Error('Nu s-a putut salva adresa.');
        const updated = await res.json();
        return updated.addresses;
    }

    const auth = getStoredAuth();
    if (!auth) throw new Error('Trebuie să fii autentificat pentru a gestiona adresele.');

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === auth.user.id);
    if (userIndex === -1) throw new Error('Utilizatorul nu a fost găsit.');

    const user = users[userIndex];
    let addresses = [...user.addresses];

    if (addressData.isDefault) {
        addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    if (addressId) {
        // Edit existing
        addresses = addresses.map((a) =>
            a.id === addressId ? { ...addressData, id: addressId } : a
        );
    } else {
        // Add new
        const newAddress: DeliveryAddress = {
            ...addressData,
            id: `addr_${Date.now()}`,
            isDefault: addresses.length === 0 ? true : addressData.isDefault,
        };
        addresses.push(newAddress);
    }

    user.addresses = addresses;
    users[userIndex] = user;
    saveStoredUsers(users);

    const updatedUser = { ...auth.user, addresses };
    saveStoredAuth({ user: updatedUser, token: auth.token });

    return addresses;
}

export async function deleteAddressApi(addressId: string): Promise<DeliveryAddress[]> {
    if (!USE_MOCK) {
        const auth = getStoredAuth();
        const res = await fetch(`${API_URL}/api/addresses/${addressId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${auth?.token}` },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Nu s-a putut șterge adresa.');
        const updated = await res.json();
        return updated.addresses;
    }

    const auth = getStoredAuth();
    if (!auth) throw new Error('Trebuie să fii autentificat.');

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === auth.user.id);
    if (userIndex === -1) throw new Error('Utilizatorul nu a fost găsit.');

    const user = users[userIndex];
    let addresses = user.addresses.filter((a) => a.id !== addressId);

    // If we deleted default and there are remaining addresses, make the first one default
    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
        addresses[0].isDefault = true;
    }

    user.addresses = addresses;
    users[userIndex] = user;
    saveStoredUsers(users);

    const updatedUser = { ...auth.user, addresses };
    saveStoredAuth({ user: updatedUser, token: auth.token });

    return addresses;
}

export async function setDefaultAddressApi(addressId: string): Promise<DeliveryAddress[]> {
    if (!USE_MOCK) {
        const auth = getStoredAuth();
        const res = await fetch(`${API_URL}/api/addresses/${addressId}/default`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${auth?.token}` },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Nu s-a putut actualiza adresa implicită.');
        const updated = await res.json();
        return updated.addresses;
    }

    const auth = getStoredAuth();
    if (!auth) throw new Error('Trebuie să fii autentificat.');

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === auth.user.id);
    if (userIndex === -1) throw new Error('Utilizatorul nu a fost găsit.');

    const user = users[userIndex];
    const addresses = user.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
    }));

    user.addresses = addresses;
    users[userIndex] = user;
    saveStoredUsers(users);

    const updatedUser = { ...auth.user, addresses };
    saveStoredAuth({ user: updatedUser, token: auth.token });

    return addresses;
}
