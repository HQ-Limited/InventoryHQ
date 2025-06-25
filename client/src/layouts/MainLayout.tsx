import React from 'react';
import { Button, Layout, Menu } from 'antd';
import routes from '../Routes';
import { Link, useLocation } from 'react-router-dom';
import { MoonFilled, SunFilled } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface Props {
    children: React.ReactNode;
    isDark: boolean;
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
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
            <Layout
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Header className="mainlayout-header" style={{ paddingRight: '0px' }}>
                    <Link
                        to="/"
                        style={{
                            all: 'unset',
                            transition: 'color 0.2s',
                            textDecoration: 'none',
                            fontSize: '22px',
                            letterSpacing: '1px',
                            userSelect: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            style={{
                                color: 'var(--ant-primary-color)',
                                fontWeight: 700,
                                marginRight: '5px',
                            }}
                        >
                            HQ
                        </span>
                        <span style={{ color: 'var(--ant-color-text-secondary)' }}>Limited</span>
                    </Link>
                    <Menu
                        className="mainlayout-links"
                        mode="horizontal"
                        items={[
                            ...items,
                            {
                                key: 'theme',
                                label: (
                                    <Button
                                        type="link"
                                        style={{
                                            padding: 0,
                                            color: 'var(--ant-color-text-secondary)',
                                        }}
                                        icon={props.isDark ? <SunFilled /> : <MoonFilled />}
                                        onClick={() => props.setIsDark(!props.isDark)}
                                    ></Button>
                                ),
                            },
                        ]}
                        style={{ flex: 1, minWidth: 0, justifyContent: 'end' }}
                        selectable={false}
                    />
                </Header>
                <Content
                    style={{
                        padding: '24px 16px',
                        flex: '1 1 auto',
                        overflow: 'auto',
                    }}
                >
                    {props.children}
                </Content>
                <Footer
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 1,
                        width: '100%',
                        textAlign: 'center',
                    }}
                    className="mainlayout-footer"
                >
                    <div className="hq-footer-info">
                        InventoryHQ ©{new Date().getFullYear()} Created by
                        <strong> HQ Limited</strong>
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

export default MainLayout;
