import { useParams } from 'react-router';

export default function ProductPage() {
    const { slug } = useParams();
    return <h1 className="font-display text-4xl font-bold uppercase">Product: {slug}</h1>;
}