import type { CartItem, DeliveryAddress, Order, ShippingMethodId } from '../types';
import { shippingCostFor } from '../lib/shipping';

const ORDERS_STORAGE_KEY = 'ironvault_orders_v1';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_URL = import.meta.env.VITE_API_URL ?? '';

export type NewOrder = {
    userId: string;
    items: CartItem[];
    address: DeliveryAddress;
    shippingMethod: ShippingMethodId;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readOrders(): Order[] {
    try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeOrders(orders: Order[]) {
    try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
        // storage disabled or full
    }
}

// "IV-MHX3K2": short, readable, unique enough for a mock.
function newOrderId() {
    return `IV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function createOrder(input: NewOrder): Promise<Order> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                addressId: input.address.id,
                shippingMethod: input.shippingMethod,
            }),
        });
        if (!res.ok) throw new Error('Comanda nu a putut fi plasată.');
        return res.json() as Promise<Order>;
    }

    await wait(400);

    // The server will recompute these totals itself; the mock does the same.
    const subtotalCents = input.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
    const shippingCents = shippingCostFor(input.shippingMethod, subtotalCents);
    const { id: _id, isDefault: _isDefault, ...address } = input.address;

    const order: Order = {
        id: newOrderId(),
        userId: input.userId,
        createdAt: new Date().toISOString(),
        status: 'unpaid',
        items: input.items.map(({ productId, slug, name, highlight, categorySlug, priceCents, quantity }) => ({
            productId, slug, name, highlight, categorySlug, priceCents, quantity,
        })),
        address,
        shippingMethod: input.shippingMethod,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
    };

    writeOrders([order, ...readOrders()]);
    return order;
}

export async function getOrder(id: string): Promise<Order | null> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(id)}`, { credentials: 'include' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<Order>;
    }

    await wait(150);
    return readOrders().find((o) => o.id === id) ?? null;
}