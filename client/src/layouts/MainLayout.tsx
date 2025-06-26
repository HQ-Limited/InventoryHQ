import React from 'react';
import { Button, Flex, Layout, Menu } from 'antd';
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
            icon: route.icon ? route.icon() : null,
            label: route.label,
        }));

    return (
        <>
            <Layout
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Header
                    className="mainlayout-header"
                    style={{
                        position: 'sticky',
                        top: 0,
                        gap: '8px',
                    }}
                >
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
                    <Flex
                        className="mainlayout-links"
                        flex={1}
                        justify={'end'}
                        align={'center'}
                        gap={'10px'}
                    >
                        {items.map((item) => (
                            <Link key={item.key} to={item.key}>
                                <Button color={'default'} variant={'link'} icon={item.icon}>
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </Flex>
                    <Button
                        className="header-darkModeButton"
                        color={'default'}
                        variant={'link'}
                        size="large"
                        style={{
                            padding: 0,
                            color: 'var(--ant-color-text-secondary)',
                        }}
                        icon={props.isDark ? <SunFilled /> : <MoonFilled />}
                        onClick={() => props.setIsDark(!props.isDark)}
                    ></Button>
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
                            style={{
                                justifyContent: 'space-evenly',
                                backgroundColor: 'var(--ant-layout-header-bg)',
                            }}
                            items={routes
                                .filter((route) => route.pinned)
                                .map((route) => ({
                                    key: route.url,
                                    label: (
                                        <Link to={route.url}>
                                            <Flex
                                                vertical
                                                align={'center'}
                                                style={{
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                }}
                                            >
                                                {route.icon({ fontSize: '1.6rem' })}
                                                <div
                                                    style={{ fontSize: '12px', lineHeight: '25px' }}
                                                >
                                                    {route.label}
                                                </div>
                                            </Flex>
                                        </Link>
                                    ),
                                }))}
                        />
                    </div>
                </Footer>
            </Layout>
        </>
    );
};

export default MainLayout;
