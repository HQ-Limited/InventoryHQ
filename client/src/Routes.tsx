import { HomeOutlined, ProductOutlined, TableOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';

type Route = {
    key: number;
    icon?: (style?: CSSProperties) => JSX.Element;
    label: string;
    url: string;
    pinned?: boolean;
    children?: Route[];
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
    {
        key: 3,
        icon: (style?: CSSProperties) => <TableOutlined style={{ ...style }} />,
        label: 'Attributes',
        url: '/attributes',
    },
];

export default routes;
