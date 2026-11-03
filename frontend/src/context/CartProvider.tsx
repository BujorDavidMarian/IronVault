import { useState, useEffect, type ReactNode } from 'react';
import type { Cart, Product } from '../types';
import { fetchCart, updateCartItemApi, clearCartApi } from '../api/cart';
import { CartContext, defaultCart } from '../context/CartContext';

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>(defaultCart);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchCart()
            .then((loaded) => {
                if (mounted) setCart(loaded);
            })
            .catch(() => {
                // Keep default empty cart on error
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (product: Product, quantity = 1): Promise<{ success: boolean; message?: string }> => {
        if (product.stock <= 0) {
            return { success: false, message: 'Acest produs nu mai este în stoc.' };
        }

        const existing = cart.items.find((item) => item.productId === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const targetQty = currentQty + quantity;

        if (targetQty > product.stock) {
            return {
                success: false,
                message: `Stoc insuficient. Sunt disponibile maxim ${product.stock} bucăți.`,
            };
        }

        try {
            const updated = await updateCartItemApi(product.id, targetQty);
            setCart(updated);
            setIsCartOpen(true);
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Eroare la adăugarea în coș.';
            return { success: false, message };
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        try {
            const updated = await updateCartItemApi(productId, quantity);
            setCart(updated);
        } catch (err) {
            console.error('Failed to update cart quantity:', err);
        }
    };

    const removeItem = async (productId: number) => {
        await updateQuantity(productId, 0);
    };

    const clearCart = async () => {
        try {
            const updated = await clearCartApi();
            setCart(updated);
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                isCartOpen,
                openCart,
                closeCart,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
