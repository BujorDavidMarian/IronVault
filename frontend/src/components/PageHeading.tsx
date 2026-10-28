type Props = { title: string; count?: number };

export default function PageHeading({ title, count }: Props) {
    return (
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h1 className="font-display text-3xl font-bold uppercase leading-none sm:text-4xl">{title}</h1>
            {count !== undefined && (
                <span className="shrink-0 text-sm text-muted tabular-nums">
                    {count} {count === 1 ? 'product' : 'products'}
                </span>
            )}
        </div>
    );
}