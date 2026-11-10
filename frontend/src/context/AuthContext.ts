import { createContext } from 'react';
import type { DeliveryAddress, User } from '../types';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    saveAddress: (address: Omit<DeliveryAddress, 'id'>, addressId?: string) => Promise<void>;
    deleteAddress: (addressId: string) => Promise<void>;
    setDefaultAddress: (addressId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
