import { useParams, useSearchParams } from 'react-router';
import { getCategories, getProducts } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import PageHeading from '../components/PageHeading';
import ProductResults from '../components/ProductResults';
import NotFoundPage from './NotFoundPage';

// Serves both "/" (all products) and "/category/:slug".
export default function CatalogPage() {
    const { slug } = useParams();
    const [params] = useSearchParams();
    const page = Number(params.get('page')) || 1;

    const categories = useAsync('categories', getCategories);
    const products = useAsync(`products:${slug ?? 'all'}:${page}`, () =>
        getProducts({ category: slug, page }),
    );

    // "/category/treadmills" doesn't exist → show 404 instead of an empty page.
    const category = categories.data?.find((c) => c.slug === slug);
    if (slug && categories.data && !category) return <NotFoundPage />;

    const title = slug ? (category?.name ?? '') : 'All products';

    return (
        <>
            <PageHeading title={title} count={products.data?.totalItems} />
            <ProductResults
                state={products}
                empty={<p className="py-16 text-center text-muted">No products here yet.</p>}
            />
        </>
    );
}