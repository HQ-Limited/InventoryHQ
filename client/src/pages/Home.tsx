import { Button } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../Routes';

const Home = () => {
    return (
        <div className="home-grid">
            {routes!.map((page) => (
                <Link key={page.key} to={page.url} className="home-link">
                    <Button type="primary" block className="home-button">
                        {page.icon}
                        <span>{page.label}</span>
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default Home;
