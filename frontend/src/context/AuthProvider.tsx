import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { DeliveryAddress, User } from '../types';
import {
    deleteAddressApi,
    fetchCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    saveAddressApi,
    setDefaultAddressApi,
} from '../api/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchCurrentUser()
            .then((current) => {
                if (mounted) setUser(current);
            })
            .catch(() => {
                if (mounted) setUser(null);
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const handleLogin = useCallback(async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            const res = await loginUser(email, pass);
            setUser(res.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRegister = useCallback(async (name: string, email: string, pass: string) => {
        setIsLoading(true);
        try {
            const res = await registerUser(name, email, pass);
            setUser(res.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveAddress = useCallback(async (addressData: Omit<DeliveryAddress, 'id'>, addressId?: string) => {
        const updatedAddresses = await saveAddressApi(addressData, addressId);
        setUser((prev) => (prev ? { ...prev, addresses: updatedAddresses } : null));
    }, []);

    const handleDeleteAddress = useCallback(async (addressId: string) => {
        const updatedAddresses = await deleteAddressApi(addressId);
        setUser((prev) => (prev ? { ...prev, addresses: updatedAddresses } : null));
    }, []);

    const handleSetDefaultAddress = useCallback(async (addressId: string) => {
        const updatedAddresses = await setDefaultAddressApi(addressId);
        setUser((prev) => (prev ? { ...prev, addresses: updatedAddresses } : null));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                saveAddress: handleSaveAddress,
                deleteAddress: handleDeleteAddress,
                setDefaultAddress: handleSetDefaultAddress,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
