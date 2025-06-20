import React from 'react';
import { HomeOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

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
        label: <Link to="/products">Products</Link>,
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: <Link to="/partners">Partners</Link>,
    },
];

interface Props {
    children: React.ReactNode;
}

const MainLayout = (props: Props) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout hasSider>
            <Sider style={siderStyle} collapsible>
                <Menu theme="dark" mode="inline" items={items} />
            </Sider>
            <Layout style={{ backgroundColor: colorBgContainer }}>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    {props.children}
                </Content>
                <Footer style={{ textAlign: 'center', backgroundColor: colorBgContainer }}>
                    VendingHQ ©{new Date().getFullYear()} Created by HQ Limited
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
