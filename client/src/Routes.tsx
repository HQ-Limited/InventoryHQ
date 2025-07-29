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

const productsRoutes: Route[] = [
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

const customersRoutes: Route[] = [
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

const suppliersRoutes: Route[] = [
    {
        icon: (style) => <UserOutlined style={{ ...style }} />,
        label: 'Suppliers',
        url: '/suppliers',
        showOnHome: true,
        page: <SuppliersView />,
    },
    {
        url: '/suppliers/new',
        page: <SuppliersEdit />,
    },
    {
        url: '/suppliers/:id',
        page: <SuppliersEdit />,
    },
];

const routes: Route[] = [
    {
        icon: (style) => <HomeOutlined style={{ ...style }} />,
        label: 'Home',
        url: '/',
        pinned: true,
        page: <Home />,
    },
    ...productsRoutes,
    ...customersRoutes,
    ...suppliersRoutes,
];

export default routes;
