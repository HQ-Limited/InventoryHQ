import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';

type Route = {
    key: number;
    icon: (style?: CSSProperties) => JSX.Element;
    label: string;
    url: string;
    pinned: boolean;
};

const routes: Route[] = [
    {
        key: 1,
        icon: (style?: CSSProperties) => <HomeOutlined style={{ ...style }} />,
        label: 'Home',
        url: '/',
        pinned: true,
    },
    {
        key: 2,
        icon: (style?: CSSProperties) => <ProductOutlined style={{ ...style }} />,
        label: 'Products',
        url: '/products',
        pinned: true,
    },
];

export default routes;
