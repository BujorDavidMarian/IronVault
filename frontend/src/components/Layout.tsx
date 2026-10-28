import { Link, Outlet } from 'react-router';

export default function Layout() {
    return (
        <div className="p-8">
            <Link to="/" className="font-display text-3xl font-bold uppercase">
                Iron<span className="text-accent">Vault</span>
            </Link>
            <nav className="mt-4 mb-8 flex flex-wrap gap-4 text-sm text-muted">
                <Link to="/">Catalog</Link>
                <Link to="/category/free-weights">Category</Link>
                <Link to="/product/olympic-power-bar-20-kg">Product</Link>
                <Link to="/search?q=bar">Search</Link>
                <Link to="/nope">Missing page</Link>
            </nav>
            <Outlet />
        </div>
    );
}