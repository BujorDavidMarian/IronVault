import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import { CartProvider } from './context/CartProvider';

export default function App() {
    return (
        <CartProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<CatalogPage />} />
                    <Route path="category/:slug" element={<CatalogPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </CartProvider>
    );
}
