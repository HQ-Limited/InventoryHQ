import { FolderOutlined, HomeOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import Home from './pages/Home';
import ProductsView from './pages/products/View/View';
import CategoriesView from './pages/categories/View/View';
import ProductsEdit from './pages/products/Edit/Edit';
import CustomersView from './pages/customers/View/View';
import CustomersEdit from './pages/customers/Edit/Edit';
import SuppliersView from './pages/suppliers/View/View';
import SuppliersEdit from './pages/suppliers/Edit/Edit';

type Route = {
    icon?: (style?: CSSProperties) => React.ReactElement;
    label?: string;
    url: string;
    pinned?: boolean;
    children?: Route[];
    showOnHome?: boolean;
    page: React.ReactNode;
};

const categoriesRoutes: Route[] = [
    {
        icon: (style?: CSSProperties) => <FolderOutlined style={{ ...style }} />,
        label: 'Categories',
        url: '/categories',
        showOnHome: true,
        page: <CategoriesView />,
    },
];

const productsRoutes: Route[] = [
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
    ...categoriesRoutes,
];

export default routes;
