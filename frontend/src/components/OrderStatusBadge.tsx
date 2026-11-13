import type { OrderStatus } from '../types';

const styles: Record<OrderStatus, [string, string]> = {
    unpaid: ['Așteaptă plata', 'bg-amber-100 text-amber-800'],
    paid: ['Plătită', 'bg-emerald-100 text-emerald-800'],
    shipped: ['Expediată', 'bg-sky-100 text-sky-800'],
    delivered: ['Livrată', 'bg-stone-200 text-stone-700'],
    cancelled: ['Anulată', 'bg-red-100 text-red-800'],
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const [label, colors] = styles[status];
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${colors}`}>
            {label}
        </span>
    );
}