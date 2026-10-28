import { Link, useSearchParams } from 'react-router';
import { getCategories, getProducts } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import PageHeading from '../components/PageHeading';
import ProductResults from '../components/ProductResults';

// Shown when nothing matches: the message, plus the four categories as a way out.
function NoResults({ query }: { query: string }) {
    const { data: categories } = useAsync('categories', getCategories);

    return (
        <div className="py-16 text-center">
            <p className="text-lg font-medium">No products match “{query}”</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {categories?.map((category) => (
                    <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:border-ink"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function SearchPage() {
    const [params] = useSearchParams();
    const query = (params.get('q') ?? '').trim();
    const page = Number(params.get('page')) || 1;

    // Wait until typing pauses before asking for results.
    const debouncedQuery = useDebouncedValue(query, 300);

    const results = useAsync(`search:${debouncedQuery}:${page}`, () =>
        getProducts({ q: debouncedQuery, page }),
    );

    return (
        <>
            <PageHeading
                title={debouncedQuery ? `“${debouncedQuery}”` : 'All products'}
                count={results.data?.totalItems}
            />
            <ProductResults state={results} empty={<NoResults query={debouncedQuery} />} />
        </>
    );
}