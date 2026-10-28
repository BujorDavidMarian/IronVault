import { Link, useSearchParams } from 'react-router';

type Props = { page: number; totalPages: number };

// [1, 2, 3, 4, 5] for few pages; [1, '…', 6, 7, 8, '…', 20] for many.
function pageList(page: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    const from = Math.max(2, page - 1);
    const to = Math.min(total - 1, page + 1);
    if (from > 2) pages.push('…');
    for (let p = from; p <= to; p++) pages.push(p);
    if (to < total - 1) pages.push('…');
    pages.push(total);
    return pages;
}

const base = 'grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm tabular-nums';

export default function Pagination({ page, totalPages }: Props) {
    const [params] = useSearchParams();
    if (totalPages <= 1) return null;

    // Keeps every other address parameter (like ?q= for search) and only changes the page.
    function searchFor(p: number) {
        const next = new URLSearchParams(params);
        if (p === 1) next.delete('page');
        else next.set('page', String(p));
        const s = next.toString();
        return s ? `?${s}` : '';
    }

    return (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
            {page > 1 ? (
                <Link to={{ search: searchFor(page - 1) }} className={`${base} hover:bg-line`} aria-label="Previous page">
                    ←
                </Link>
            ) : (
                <span className={`${base} text-muted/40`}>←</span>
            )}

            {pageList(page, totalPages).map((p, i) =>
                p === '…' ? (
                    <span key={`gap-${i}`} className={`${base} text-muted`}>…</span>
                ) : (
                    <Link
                        key={p}
                        to={{ search: searchFor(p) }}
                        aria-current={p === page ? 'page' : undefined}
                        className={`${base} ${p === page ? 'bg-ink text-paper' : 'hover:bg-line'}`}
                    >
                        {p}
                    </Link>
                ),
            )}

            {page < totalPages ? (
                <Link to={{ search: searchFor(page + 1) }} className={`${base} hover:bg-line`} aria-label="Next page">
                    →
                </Link>
            ) : (
                <span className={`${base} text-muted/40`}>→</span>
            )}
        </nav>
    );
}