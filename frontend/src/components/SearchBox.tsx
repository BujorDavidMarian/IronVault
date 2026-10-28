import type { FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

// The address is the single source of truth: typing writes ?q= into the address bar,
// and the input reads its value back from there.
export default function SearchBox() {
    const { pathname } = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onSearchPage = pathname === '/search';
    const value = onSearchPage ? (params.get('q') ?? '') : '';

    function handleChange(next: string) {
        const target = next ? `/search?q=${encodeURIComponent(next)}` : '/search';
        // The first keystroke adds a history entry; the rest replace it,
        // so "Back" returns to where the search started, not one letter back.
        navigate(target, { replace: onSearchPage });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur(); // closes the phone keyboard
    }

    return (
        <form role="search" onSubmit={handleSubmit} className="relative ml-auto w-full max-w-sm">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
            </svg>
            <input
                type="search"
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
                enterKeyHint="search"
                autoComplete="off"
                className="w-full rounded-full border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
            />
        </form>
    );
}