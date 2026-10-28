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