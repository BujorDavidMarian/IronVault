export default function StockBadge({ stock }: { stock: number }) {
  const [label, dot] =
    stock === 0
      ? ['Sold out', 'bg-stone-400']
      : stock <= 5
        ? [`${stock} left`, 'bg-amber-500']
        : ['In stock', 'bg-emerald-600'];

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted">
      <span className={`size-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}