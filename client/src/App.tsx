import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ConfigProvider, theme } from 'antd';
import ProductsView from './pages/products/View/View';
import ProductsEdit from './pages/products/Edit/Edit';
import PartnersView from './pages/partners/View';
import PartnersCreateEdit from './pages/partners/CreateEdit';
import Home from './pages/Home';
import { useState } from 'react';

function App() {
    const [isDark, setIsDark] = useState(true);
    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerBg: isDark ? '#141414' : '#fff',
                    },
                },
                cssVar: true,
                hashed: false,
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorBgBase: isDark ? '#111' : '#fff',
                },
            }}
        >
            <BrowserRouter>
                <MainLayout isDark={isDark} setIsDark={setIsDark}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductsView />} />
                        <Route path="/products/new" element={<ProductsEdit />} />
                        <Route path="/products/:id" element={<ProductsEdit />} />
                        <Route path="/partners" element={<PartnersView />} />
                        <Route path="/partners/new" element={<PartnersCreateEdit />} />
                        <Route path="/partners/:id" element={<PartnersCreateEdit />} />
                    </Routes>
                </MainLayout>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
