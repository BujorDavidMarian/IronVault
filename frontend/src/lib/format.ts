const priceFormat = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' });

export function formatPrice(cents: number) {
    return priceFormat.format(cents / 100); // 34900 → "349,00 RON"
}

export function formatAddress(a: { street: string; city: string; county: string }) {
    return `${a.street}, ${a.city}, jud. ${a.county}`;
}