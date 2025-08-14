import { HomeOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import React, { CSSProperties } from 'react';
import Home from './pages/Home';
import ProductsView from './pages/products/View/View';
import CustomersView from './pages/customers/View/View';
import ProductsEdit from './pages/products/Edit/Edit';
import CustomersEdit from './pages/customers/Edit/Edit';

type Route = {
    icon?: (style?: CSSProperties) => React.ReactNode;
    label?: string;
    url: string;
    pinned?: boolean;
    showOnHome?: boolean;
    children?: Route[];
    page: React.ReactNode;
};

const routes: Route[] = [
    {
        icon: (style) => <HomeOutlined style={{ ...style }} />,
        label: 'Home',
        url: '/',
        pinned: true,
        page: <Home />,
    },
    {
        icon: (style) => <ProductOutlined style={{ ...style }} />,
        label: 'Products',
        url: '/products',
        pinned: true,
        showOnHome: true,
        page: <ProductsView />,
    },
    {
        url: '/products/new',
        page: <ProductsEdit />,
    },
    {
        url: '/products/:id',
        page: <ProductsEdit />,
    },
    {
        icon: (style) => <UserOutlined style={{ ...style }} />,
        label: 'Customers',
        url: '/customers',
        showOnHome: true,
        page: <CustomersView />,
    },
    {
        url: '/customers/new',
        showOnHome: false,
        page: <CustomersEdit />,
    },
    {
        url: '/customers/:id',
        page: <CustomersEdit />,
    },
];

export default routes;
