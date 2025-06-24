import React from 'react';
import { Layout, Menu } from 'antd';
import routes from '../Routes';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface Props {
    children: React.ReactNode;
}

const MainLayout = (props: Props) => {
    const location = useLocation();
    const items = routes
        .filter((route) => route.pinned)
        .map((route) => ({
            key: route.url,
            icon: route.icon,
            label: <Link to={route.url}>{route.label}</Link>,
        }));
    return (
        <>
            <Layout className="mainlayout-root">
                <Header className="mainlayout-header">
                    <span className="mainlayout-logo">
                        <Link to="/">
                            <span className="mainlayout-logo-hq">HQ</span>
                            <span className="mainlayout-logo-limited">Limited</span>
                        </Link>
                    </span>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={items}
                        style={{ flex: 1, minWidth: 0, justifyContent: 'end' }}
                        selectable={false}
                    />
                </Header>
                <Content className="mainlayout-content">{props.children}</Content>
                <Footer className="mainlayout-footer">
                    <div className="hq-footer-info">
                        InventoryHQ ©{new Date().getFullYear()} Created by{' '}
                        <strong>HQ Limited</strong>
                    </div>
                    <div className="bottom-navigation">
                        <Menu
                            mode="horizontal"
                            className="mainlayout-bottom-nav"
                            selectedKeys={[location.pathname]}
                            style={{ justifyContent: 'center' }}
                            items={routes
                                .filter((route) => route.pinned)
                                .map((route) => ({
                                    key: route.url,
                                    icon: route.icon,
                                    label: <Link to={route.url}>{route.label}</Link>,
                                }))}
                        />
                    </div>
                </Footer>
            </Layout>
        </>
    );
};

/* const MainLayout = (props: Props) => {
    const location = useLocation();
    return (
        <>
            <Layout className="mainlayout-root">
                <Header className="mainlayout-header">
                    <span className="mainlayout-logo">
                        <Link to="/">
                            <span className="mainlayout-logo-hq">HQ</span>
                            <span className="mainlayout-logo-limited">Limited</span>
                        </Link>
                    </span>
                    <div className="mainlayout-links">
                        {routes
                            .filter((route) => route.pinned)
                            .map((route) => (
                                <Link
                                    key={route.url}
                                    to={route.url}
                                    className="mainlayout-link"
                                    style={{
                                        color: location.pathname.match(
                                            new RegExp(`^${route.url}(/|$)`)
                                        )
                                            ? 'var(--ant-primary-color)'
                                            : 'var(--ant-color-text-secondary)',
                                        fontWeight: location.pathname.match(
                                            new RegExp(`^${route.url}(/|$)`)
                                        )
                                            ? 700
                                            : 400,
                                    }}
                                >
                                    {route.label}
                                </Link>
                            ))}
                    </div>
                </Header>
                <Content className="mainlayout-content">{props.children}</Content>
                <Footer className="mainlayout-footer">
                    <div className="hq-footer-info">
                        InventoryHQ ©{new Date().getFullYear()} Created by{' '}
                        <strong>HQ Limited</strong>
                    </div>
                    <div className="bottom-navigation">
                        <Menu
                            mode="horizontal"
                            className="mainlayout-bottom-nav"
                            selectedKeys={[location.pathname]}
                            style={{ justifyContent: 'center' }}
                        >
                            {routes
                                .filter((route) => route.pinned)
                                .map((route) => (
                                    <Menu.Item key={route.url} icon={route.icon}>
                                        <Link to={route.url}>{route.label}</Link>
                                    </Menu.Item>
                                ))}
                        </Menu>
                    </div>
                </Footer>
            </Layout>
        </>
    );
}; */

export default MainLayout;
