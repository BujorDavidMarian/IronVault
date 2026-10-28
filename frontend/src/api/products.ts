import type { Category, Paged, Product, ProductQuery } from '../types';
import { mockCategories, mockProducts } from '../mocks/data';

export const PAGE_SIZE = 24;

const API_URL = import.meta.env.VITE_API_URL ?? '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Fake network delay, so you can see loading states while developing.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lowercase and remove accents, so "KETTLEBELL" finds "Kettlebell".
function normalize(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
    if (!USE_MOCK) return getJson<Category[]>('/api/categories');

    await wait(150);
    return mockCategories.map((category) => ({
        ...category,
        productCount: mockProducts.filter((p) => p.categorySlug === category.slug).length,
    }));
}

export async function getProducts(query: ProductQuery): Promise<Paged<Product>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = query.pageSize ?? PAGE_SIZE;

    if (!USE_MOCK) {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (query.category) params.set('category', query.category);
        if (query.q) params.set('q', query.q);
        return getJson<Paged<Product>>(`/api/products?${params}`);
    }

    await wait(250);
    let items = mockProducts;
    if (query.category) {
        items = items.filter((p) => p.categorySlug === query.category);
    }
    if (query.q) {
        // Every typed word must appear in the name: "kettle 24" finds "Cast Iron Kettlebell 24 kg".
        const words = normalize(query.q).split(/\s+/).filter(Boolean);
        items = items.filter((p) => words.every((word) => normalize(p.name).includes(word)));
    }

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), page, totalPages, totalItems };
}

export async function getProduct(slug: string): Promise<Product | null> {
    if (!USE_MOCK) {
        const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<Product>;
    }

    await wait(150);
    return mockProducts.find((p) => p.slug === slug) ?? null;
}