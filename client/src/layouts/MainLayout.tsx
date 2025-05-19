import React from 'react';
import { HomeOutlined, PlusOutlined, ProductOutlined, TableOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const items: MenuProps['items'] = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: <Link to="/">Home</Link>,
    },
    {
        key: '2',
        icon: <ProductOutlined />,
        label: 'Products',
        children: [
            {
                key: '3',
                icon: <TableOutlined />,
                label: <Link to="/products">All Products</Link>,
            },
            {
                key: '4',
                icon: <PlusOutlined />,
                label: <Link to="/products/create">Create</Link>,
            },
        ],
    },
];

interface Props {
    children: React.ReactNode;
}

const MainLayout = (props: Props) => {
    return (
        <Layout hasSider>
            <Sider style={siderStyle} collapsible>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    {props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    VendingHQ ©{new Date().getFullYear()} Created by HQ Limited
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
