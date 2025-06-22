import { Button } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../Routes';

const Home = () => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                padding: 24,
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            {routes!.map((page) => (
                <Link key={page.key} to={page.url} style={{ textDecoration: 'none' }}>
                    <Button
                        type="primary"
                        block
                        style={{
                            minHeight: 48,
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {page.icon}
                        <span>{page.label}</span>
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default Home;
