import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function UserNav() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-9 w-20 animate-pulse rounded-md bg-line/50" />
        );
    }

    if (user) {
        return (
            <Link
                to="/account"
                className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-line/40 transition-colors"
                title={`Autentificat ca ${user.name}`}
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                </span>
                <span className="hidden md:inline max-w-[120px] truncate font-medium">
                    {user.name}
                </span>
            </Link>
        );
    }

    return (
        <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-line/40 transition-colors"
        >
            <svg
                className="h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
            <span className="hidden sm:inline">Autentificare</span>
        </Link>
    );
}
