import { Link, Navigate, useParams } from 'react-router';
import { getOrder } from '../api/orders';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../hooks/useAuth';
import { shippingMethodsFor } from '../lib/shipping';
import { formatAddress } from '../lib/format';
import OrderBreakdown from '../components/OrderBreakdown';
import OrderStatusBadge from '../components/OrderStatusBadge';
import NotFoundPage from './NotFoundPage';

const dateFormat = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long', timeStyle: 'short' });

export default function OrderPage() {
    const { id = '' } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const { data: order, loading } = useAsync(`order:${id}`, () => getOrder(id));

    if (!authLoading && !user) return <Navigate to={`/login?next=/order/${id}`} replace />;
    // Unknown order, or someone else's: show 404 rather than revealing it exists.
    if (!authLoading && !loading && (order === null || (order && order.userId !== user?.id))) return <NotFoundPage />;
    if (authLoading || !order || order.id !== id) {
        return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-xl bg-line" aria-hidden="true" />;
    }

    const shippingName = shippingMethodsFor(order.subtotalCents).find((m) => m.id === order.shippingMethod)?.name;

    return (
        <article className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-muted">{dateFormat.format(new Date(order.createdAt))}</p>
                    <h1 className="mt-1 font-display text-3xl font-bold uppercase sm:text-4xl">Comanda {order.id}</h1>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Livrare la</h2>
                    <p className="mt-2 font-medium">{order.address.fullName}</p>
                    <p className="text-muted">{formatAddress(order.address)}</p>
                    <p className="text-muted tabular-nums">{order.address.phone}</p>
                </div>
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Metoda de livrare</h2>
                    <p className="mt-2 font-medium">{shippingName}</p>
                </div>
            </div>

            <div className="mt-8">
                <OrderBreakdown
                    items={order.items}
                    subtotalCents={order.subtotalCents}
                    shippingCents={order.shippingCents}
                />
            </div>

            <Link to="/" className="mt-6 inline-block rounded-full border border-ink px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper">
                Continuă cumpărăturile
            </Link>
        </article>
    );
}