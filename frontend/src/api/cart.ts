import type { Cart, CartItem, Product } from '../types';
import { mockProducts } from '../mocks/data';

const CART_STORAGE_KEY = 'ironvault_cart_v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_URL = import.meta.env.VITE_API_URL ?? '';

type StoredCartEntry = {
    productId: number;
    quantity: number;
};

function readStoredCart(): StoredCartEntry[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.filter(
                (item) => item && typeof item.productId === 'number' && typeof item.quantity === 'number' && item.quantity > 0
            );
        }
        return [];
    } catch {
        return [];
    }
}

function writeStoredCart(entries: StoredCartEntry[]) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
    } catch {
        // Storage might be disabled or full
    }
}

// Server-side recalculation logic & rejection of quantities exceeding stock
export function recalculateCart(entries: StoredCartEntry[], availableProducts: Product[]): Cart {
    const items: CartItem[] = [];
    const validEntries: StoredCartEntry[] = [];

    for (const entry of entries) {
        const product = availableProducts.find((p) => p.id === entry.productId);
        if (!product || product.stock <= 0) {
            // Product unavailable or out of stock - drop from cart
            continue;
        }

        // Rejection / clamping of quantities over stock
        const validQuantity = Math.min(Math.max(1, entry.quantity), product.stock);

        items.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            stock: product.stock,
            highlight: product.highlight,
            categorySlug: product.categorySlug,
            quantity: validQuantity,
        });

        validEntries.push({
            productId: product.id,
            quantity: validQuantity,
        });
    }

    // Persist clamped valid state
    writeStoredCart(validEntries);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

    return {
        items,
        itemCount,
        subtotalCents,
    };
}

export async function fetchCart(): Promise<Cart> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/cart`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load cart');
        return res.json();
    }

    const stored = readStoredCart();
    return recalculateCart(stored, mockProducts);
}

export async function updateCartItemApi(productId: number, quantity: number): Promise<Cart> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/cart/items`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to update cart');
        }
        return res.json();
    }

    const current = readStoredCart();
    const existingIndex = current.findIndex((item) => item.productId === productId);

    if (quantity <= 0) {
        if (existingIndex !== -1) {
            current.splice(existingIndex, 1);
        }
    } else {
        if (existingIndex !== -1) {
            current[existingIndex].quantity = quantity;
        } else {
            current.push({ productId, quantity });
        }
    }

    return recalculateCart(current, mockProducts);
}

export async function clearCartApi(): Promise<Cart> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/cart`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to clear cart');
        return res.json();
    }

    writeStoredCart([]);
    return {
        items: [],
        itemCount: 0,
        subtotalCents: 0,
    };
}
