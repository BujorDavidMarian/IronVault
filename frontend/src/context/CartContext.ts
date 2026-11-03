import { createContext } from 'react';
import type { Cart, Product } from '../types';

export type CartContextType = {
    cart: Cart;
    isLoading: boolean;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message?: string }>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

export const defaultCart: Cart = {
    items: [],
    itemCount: 0,
    subtotalCents: 0,
};

export const CartContext = createContext<CartContextType | null>(null);
