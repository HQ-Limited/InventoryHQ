import { HomeOutlined, ProductOutlined } from '@ant-design/icons';

const routes = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: 'Home',
        url: '/',
        pinned: true,
    },
    {
        key: '2',
        icon: <ProductOutlined />,
        label: 'Products',
        url: '/products',
        pinned: true,
    },
];

export default routes;
