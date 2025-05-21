import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import View from './pages/products/View';
import Create from './pages/products/Create';

function App() {
    return (
        <BrowserRouter>
            {/* <MainLayout> */}
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/products" element={<View />} />
                <Route path="/products/create" element={<Create />} />
            </Routes>
            {/* </MainLayout> */}
        </BrowserRouter>
    );
}

export default App;
