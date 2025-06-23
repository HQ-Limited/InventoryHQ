import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { CreatePartnerType } from '../../types/PartnerTypes';
import axios from 'axios';

const onFinish: FormProps<CreatePartnerType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<CreatePartnerType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CreateEdit: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState<CreatePartnerType>({
        company: '',
        discount: 0,
        priceGroup: 'wholesale',
        type: 'customer',
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const req = await axios.get(`/api/partners/${id}`);
                    if (req.status === 200) {
                        setValues(req.data);
                    } else {
                        navigate('/404');
                    }
                } catch (e) {
                    navigate('/404');
                }
            };
            fetchData();
        }
    });

    // TODO: Create a function to get the data from the API if id is not null

    return (
        <Form
            style={{ padding: '20px' }}
            layout="vertical"
            variant="filled"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            scrollToFirstError
            initialValues={values}
        >
            <Form.Item<CreatePartnerType>
                label="Company"
                name="company"
                rules={[
                    { required: true, message: 'Please enter the name of the company!' },
                    { max: 100 },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Legal Representative"
                name="legalRepresentative"
                rules={[{ max: 100 }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType> label="City" name="city" rules={[{ max: 50 }]}>
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType> label="Address" name="address" rules={[{ max: 100 }]}>
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Unified Identification Code (UIC)"
                name="uic"
                rules={[
                    { max: 20 },
                    { pattern: /^[0-9]+$/, message: 'UIC must consist of numbers only' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType> label="VAT Number" name="vat" rules={[{ max: 20 }]}>
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Phone Number"
                name="phone"
                rules={[
                    { max: 30 },
                    {
                        pattern: /^\+?[0-9]+$/,
                        message:
                            'Phone number must start with "+" or a number and consist of numbers only.',
                    },
                ]}
            >
                <Input type="tel" />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Email"
                name="email"
                rules={[
                    { max: 50 },
                    {
                        type: 'email',
                        message: 'Invalid email!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType> label="Bank" name="bank" rules={[{ max: 50 }]}>
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="BIC"
                name="bic"
                rules={[
                    {
                        pattern: /^[a-zA-Z]{6}[0-9]+$/,
                        message: 'BIC must start with 6 letters followed by numbers!',
                    },
                    {
                        validator: (_, value) => {
                            if (value.length !== 0 && value.length !== 8 && value.length !== 11) {
                                return Promise.reject(
                                    'BIC must be either 8 or 11 characters long!'
                                );
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="IBAN"
                name="iban"
                rules={[
                    { max: 34, min: 15 },
                    {
                        pattern: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/,
                        message: 'IBAN must start with 2 letters followed by 2 numbers!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Discount %"
                name="discount"
                rules={[
                    {
                        required: true,
                        message: 'Please enter the discount percentage!',
                    },
                    {
                        validator: (_, value) => {
                            if (value < 0 || value > 100) {
                                return Promise.reject('Discount must be between 0 and 100!');
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    step={0.01}
                    min={0}
                    max={100}
                />
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Price group"
                name="priceGroup"
                rules={[{ required: true, message: 'Please select a price group!' }]}
            >
                <Select>
                    <Select.Option value="retail">Retail</Select.Option>
                    <Select.Option value="wholesale">Wholesale</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item<CreatePartnerType>
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please select a type!' }]}
            >
                <Select>
                    <Select.Option value="customer">Customer</Select.Option>
                    <Select.Option value="supplier">Supplier</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }} label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEdit;
