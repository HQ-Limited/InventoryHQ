import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../Routes';

const Home = () => {
    return (
        <Row gutter={[32, { xs: 30, sm: 40, md: 40, lg: 50 }]}>
            {routes!
                .filter((page) => page.url !== '/' && page.showOnHome)
                .map((page, i) => (
                    <Col
                        key={i}
                        className="gutter-row"
                        xs={{ flex: '100%' }}
                        sm={{ flex: '50%' }}
                        md={{ flex: '33%' }}
                        lg={{ flex: '20%' }}
                    >
                        <Link key={page.url} to={page.url}>
                            <Button
                                style={{
                                    display: 'flex',
                                    minHeight: '48px',
                                }}
                                type="primary"
                                block
                                className="home-button"
                            >
                                {page.icon && page.icon()}
                                <span>{page.label!}</span>
                            </Button>
                        </Link>
                    </Col>
                ))}
        </Row>
    );
};

export default Home;
