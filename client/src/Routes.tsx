import { FolderOutlined, HomeOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import Home from './pages/Home';
import ProductsView from './pages/products/View/View';
import CategoriesView from './pages/categories/View/View';
import ProductsEdit from './pages/products/Edit/Edit';
import PartnersView from './pages/partners/View';
import PartnersCreateEdit from './pages/partners/CreateEdit';

type Route = {
    icon?: (style?: CSSProperties) => React.ReactElement;
    label?: string;
    url: string;
    pinned?: boolean;
    hidden?: boolean;
    children?: Route[];
    element?: React.ReactNode;
};

const routes: Route[] = [
    {
        icon: (style?: CSSProperties) => <HomeOutlined style={{ ...style }} />,
        label: 'Home',
        url: '/',
        pinned: true,
        element: <Home />,
    },
    {
        icon: (style?: CSSProperties) => <ProductOutlined style={{ ...style }} />,
        label: 'Products',
        url: '/products',
        pinned: true,
        element: <ProductsView />,
    },
    {
        url: '/products/new',
        element: <ProductsEdit />,
        hidden: true,
    },
    {
        url: '/products/:id',
        element: <ProductsEdit />,
        hidden: true,
    },
    {
        icon: (style?: CSSProperties) => <FolderOutlined style={{ ...style }} />,
        label: 'Categories',
        url: '/categories',
        pinned: false,
        element: <CategoriesView />,
    },
    {
        icon: (style?: CSSProperties) => <UserOutlined style={{ ...style }} />,
        label: 'Partners',
        url: '/partners',
        element: <PartnersView />,
    },
    {
        url: '/partners/new',
        element: <PartnersCreateEdit />,
        hidden: true,
    },
    {
        url: '/partners/:id',
        element: <PartnersCreateEdit />,
        hidden: true,
    },
];

export default routes;
