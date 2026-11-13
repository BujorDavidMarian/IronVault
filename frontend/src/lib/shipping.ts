import type { ShippingMethod, ShippingMethodId } from '../types';

export const FREE_SHIPPING_FROM_CENTS = 50000; // 500 RON

// The two delivery options. Standard becomes free above 500 RON.
export function shippingMethodsFor(subtotalCents: number): ShippingMethod[] {
    const freeStandard = subtotalCents >= FREE_SHIPPING_FROM_CENTS;
    return [
        { id: 'standard', name: 'Curier standard', eta: '2–3 zile lucrătoare', costCents: freeStandard ? 0 : 1999 },
        { id: 'express', name: 'Curier express', eta: 'Livrare a doua zi', costCents: 3499 },
    ];
}

export function shippingCostFor(id: ShippingMethodId, subtotalCents: number): number {
    return shippingMethodsFor(subtotalCents).find((m) => m.id === id)?.costCents ?? 0;
}