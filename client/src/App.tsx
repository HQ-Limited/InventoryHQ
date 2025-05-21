import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ConfigProvider, theme } from 'antd';
import ProductsView from './pages/products/View';
import ProductsCreate from './pages/products/Create';
import PartnersView from './pages/partners/View';
import PartnersCreateEdit from './pages/partners/CreateEdit';

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
                    <Route path="/products/create" element={<ProductsCreate />} />

                    <Route path="/partners" element={<PartnersView />} />
                    <Route path="/partners/new" element={<PartnersCreateEdit />} />
                    <Route path="/partners/:id" element={<PartnersCreateEdit />} />
                </Routes>
                {/* </MainLayout> */}
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
