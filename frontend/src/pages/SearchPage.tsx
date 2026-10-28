import { useSearchParams } from 'react-router';

export default function SearchPage() {
    const [params] = useSearchParams();
    return <h1 className="font-display text-4xl font-bold uppercase">Search: {params.get('q')}</h1>;
}