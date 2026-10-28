import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <div className="py-20 text-center">
            <p className="font-display text-7xl font-bold">404</p>
            <p className="mt-2 text-muted">This page doesn't exist.</p>
            <Link
                to="/"
                className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
                Back to the store
            </Link>
        </div>
    );
}