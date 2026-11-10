import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import { CartProvider } from './context/CartProvider';
import { AuthProvider } from './context/AuthProvider';

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<CatalogPage />} />
                        <Route path="category/:slug" element={<CatalogPage />} />
                        <Route path="product/:slug" element={<ProductPage />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}
