import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import CategoryNav from './CategoryNav';
import SearchBox from './SearchBox';

// When you go to another page (or page 2), jump back to the top.
function ScrollToTopOnPageChange() {
    const { pathname, search } = useLocation();
    const page = new URLSearchParams(search).get('page');
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, page]);
    return null;
}

export default function Layout() {
    return (
        <div className="flex min-h-dvh flex-col">
            <ScrollToTopOnPageChange />
            <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 pt-3">
                    <Link to="/" className="shrink-0 font-display text-2xl font-bold uppercase tracking-wide">
                        Iron<span className="text-accent">Vault</span>
                    </Link>
                    <SearchBox />
                </div>
                <CategoryNav />
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-line py-6 text-center text-xs text-muted">
                © 2026 IronVault
            </footer>
        </div>
    );
}