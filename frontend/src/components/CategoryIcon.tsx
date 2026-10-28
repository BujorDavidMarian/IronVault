import type { ReactNode } from 'react';

const paths: Record<string, ReactNode> = {
    'free-weights': <path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" />,
    'lifting-accessories': (
        <>
            <rect x="3" y="9" width="18" height="6" rx="2" />
            <rect x="13" y="7" width="5" height="10" rx="1" />
        </>
    ),
    apparel: <path d="M8 4 3 7l2 4 3-1v10h8V10l3 1 2-4-5-3c-1 1.5-2.3 2-4 2s-3-.5-4-2Z" />,
    nutrition: (
        <>
            <rect x="5" y="3" width="14" height="4" rx="1" />
            <path d="M6 7h12l-1 13H7Z" />
        </>
    ),
};

type Props = { slug: string; className?: string };

export default function CategoryIcon({ slug, className }: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            {paths[slug]}
        </svg>
    );
}