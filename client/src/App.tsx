import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ConfigProvider, theme } from 'antd';
import ProductsView from './pages/products/View';
import ProductsCreateEdit from './pages/products/CreateEdit';
import PartnersView from './pages/partners/View';
import PartnersCreateEdit from './pages/partners/CreateEdit';
import Page404 from './pages/404';

function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            <BrowserRouter>
                {/* <MainLayout> */}
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/products" element={<ProductsView />} />
                    <Route path="/products/new" element={<ProductsCreateEdit />} />
                    <Route path="/products/:id" element={<ProductsCreateEdit />} />

                    <Route path="/partners" element={<PartnersView />} />
                    <Route path="/partners/new" element={<PartnersCreateEdit />} />
                    <Route path="/partners/:id" element={<PartnersCreateEdit />} />

                    <Route path="*" element={<Page404 />} />
                </Routes>
                {/* </MainLayout> */}
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
