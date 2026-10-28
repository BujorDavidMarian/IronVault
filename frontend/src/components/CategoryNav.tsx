import { NavLink } from 'react-router';
import { getCategories } from '../api/products';
import { useAsync } from '../hooks/useAsync';

function tabClass({ isActive }: { isActive: boolean }) {
    return `flex shrink-0 items-baseline gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors ${isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
        }`;
}

function Count({ n }: { n: number }) {
    return <span className="text-xs font-normal text-muted tabular-nums">{n}</span>;
}

export default function CategoryNav() {
    const { data: categories } = useAsync('categories', getCategories);
    const total = categories?.reduce((sum, c) => sum + c.productCount, 0);

    return (
        <nav aria-label="Categories" className="no-scrollbar mx-auto max-w-6xl overflow-x-auto px-4">
            <div className="flex gap-6">
                <NavLink to="/" end className={tabClass}>
                    All {total !== undefined && <Count n={total} />}
                </NavLink>
                {categories?.map((category) => (
                    <NavLink key={category.slug} to={`/category/${category.slug}`} className={tabClass}>
                        {category.name} <Count n={category.productCount} />
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}