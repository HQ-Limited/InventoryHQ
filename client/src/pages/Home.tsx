import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const pages = [
    {
        name: 'Products',
        path: '/products',
    },
    {
        name: 'Partners',
        path: '/partners',
    },
];
const Home = () => {
    return (
        <>
            <Row gutter={16}>
                {pages.map((page, index) => (
                    <Col key={index} span={6}>
                        <Link to={page.path}>
                            <Button
                                type="primary"
                                style={{ width: '100%', height: '120px', fontSize: '2rem' }}
                            >
                                {page.name}
                            </Button>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Home;
