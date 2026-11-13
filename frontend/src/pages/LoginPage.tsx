import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    // Where to go after logging in, e.g. ?next=/checkout. Only paths inside the store are allowed.
    const next = params.get('next');
    const destination = next?.startsWith('/') && !next.startsWith('//') ? next : '/account';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate(destination, { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Autentificarea a eșuat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFillDemo = () => {
        setEmail('athlete@ironvault.ro');
        setPassword('ironvault2026');
        setError(null);
    };

    return (
        <div className="mx-auto max-w-md py-6 sm:py-12">
            <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-8">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                        Contul Tău IronVault
                    </span>
                    <h1 className="text-3xl font-bold font-display uppercase tracking-wide">
                        Autentificare
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Intră în cont pentru a gestiona adresele de livrare și comenzile.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            Adresă Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nume@exemplu.ro"
                            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            Parolă
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-xs"
                    >
                        {isSubmitting ? 'Se verifică...' : 'Conectare în Cont'}
                    </button>
                </form>

                {/* Demo Quick Fill Box */}
                <div className="mt-6 rounded-lg border border-line/60 bg-line/20 p-3.5 text-xs text-muted">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">💡 Cont demonstrativ:</span>
                        <button
                            type="button"
                            onClick={handleFillDemo}
                            className="font-medium text-accent hover:underline"
                        >
                            Completează automat
                        </button>
                    </div>
                    <div className="mt-1">
                        <code>athlete@ironvault.ro</code> | Parolă: <code>ironvault2026</code>
                    </div>
                </div>

                <div className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
                    Nu ai încă un cont?{' '}
                    <Link to="/register" className="font-semibold text-accent hover:underline">
                        Înregistrează-te acum
                    </Link>
                </div>
            </div>
        </div>
    );
}
