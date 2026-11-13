export type Category = {
    slug: string;          // "free-weights": used in addresses
    name: string;          // "Free Weights": shown to people
    productCount: number;
};

export type Product = {
    id: number;
    slug: string;
    name: string;
    categorySlug: string;
    priceCents: number;    // 34900 = 349,00 RON
    stock: number;
    highlight: string;     // the key spec shown big on the card: "20 kg", "7 mm"
    description: string;
    specs: Record<string, string>;
    imageUrl?: string;     // the ? means "optional"
};

export type ProductQuery = {
    category?: string;
    q?: string;
    page?: number;
    pageSize?: number;
};

export type Paged<T> = {
    items: T[];
    page: number;
    totalPages: number;
    totalItems: number;
};

export type CartItem = {
    productId: number;
    slug: string;
    name: string;
    priceCents: number;
    stock: number;
    highlight: string;
    categorySlug: string;
    quantity: number;
};

export type Cart = {
    items: CartItem[];
    itemCount: number;
    subtotalCents: number;
};

export type DeliveryAddress = {
    id: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    county: string;     // Județ (e.g., Cluj, București, Timiș)
    postalCode: string;
    isDefault: boolean;
};

export type User = {
    id: string;
    email: string;
    name: string;
    addresses: DeliveryAddress[];
    createdAt: string;
};

export type AuthResponse = {
    user: User;
    token: string;
};

export type OrderStatus = 'unpaid' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
    productId: number;
    slug: string;
    name: string;
    highlight: string;
    categorySlug: string;
    priceCents: number;
    quantity: number;
};

export type Order = {
    id: string;
    userId: string;
    createdAt: string;
    status: OrderStatus;
    items: OrderItem[];
    address: Omit<DeliveryAddress, 'id' | 'isDefault'>;
    shippingMethod: ShippingMethodId;
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
};

export type ShippingMethodId = 'standard' | 'express';

export type ShippingMethod = {
    id: ShippingMethodId;
    name: string;
    eta: string;
    costCents: number;
};
