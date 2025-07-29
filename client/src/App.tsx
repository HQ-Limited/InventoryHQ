import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ConfigProvider, theme, App } from 'antd';
import { useState } from 'react';
import Page404 from './pages/404';
import routes from './Routes';

function MainApp() {
    // get from local storage
    const [isDark, setIsDark] = useState(localStorage.getItem('isDark') === 'true');

    useEffect(() => {
        localStorage.setItem('isDark', isDark.toString());
    }, [isDark]);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerBg: isDark ? '#141414' : '#fff',
                    },
                },
                cssVar: true,
                hashed: false,
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorBgBase: isDark ? '#111' : '#fff',
                },
            }}
        >
            <BrowserRouter>
                <App style={{ height: '100%' }}>
                    <MainLayout isDark={isDark} setIsDark={setIsDark}>
                        <Routes>
                            {routes.map((route) => (
                                <Route key={route.url} path={route.url} element={route.element} />
                            ))}
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </MainLayout>
                </App>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default MainApp;
