import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Parolele introduse nu coincid.');
            return;
        }

        if (password.length < 6) {
            setError('Parola trebuie să aibă minimum 6 caractere.');
            return;
        }

        setIsSubmitting(true);
        try {
            await register(name, email, password);
            navigate('/account');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Înregistrarea a eșuat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md py-6 sm:py-12">
            <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-8">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                        Alătură-te Comunității
                    </span>
                    <h1 className="text-3xl font-bold font-display uppercase tracking-wide">
                        Creare Cont Nou
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Completează formularul pentru a comanda echipamente și accesorii de forță.
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
                            Nume și Prenume
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ex: Andrei Popescu"
                            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            Adresă Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="andrei@exemplu.ro"
                            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            Parolă (min. 6 caractere)
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

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            Confirmă Parola
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-xs"
                    >
                        {isSubmitting ? 'Se creează contul...' : 'Înregistrează-te'}
                    </button>
                </form>

                <div className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
                    Ai deja un cont deschis?{' '}
                    <Link to="/login" className="font-semibold text-accent hover:underline">
                        Conectează-te aici
                    </Link>
                </div>
            </div>
        </div>
    );
}
