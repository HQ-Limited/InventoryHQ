import React, { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, InputNumber, Select } from 'antd';

type FieldType = {
    company?: string;
    legalRepresentative?: string;
    city?: string;
    address?: string;
    uic?: string;
    vat?: string;
    phone?: string;
    email?: string;
    bank?: string;
    bic?: string;
    iban?: string;
    discount?: number;
    priceGroup?: string;
    type?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CreateEdit: React.FC = () => {
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState({
        company: '',
        legalRepresentative: '',
        city: '',
        address: '',
        uic: '',
        vat: '',
        phone: '',
        email: '',
        bank: '',
        bic: '',
        iban: '',
        discount: 0,
        priceGroup: 'wholesale',
        type: 'customer',
    });

    // TODO: Create a function to get the data from the API if id is not null

    return (
        <Form
            layout="vertical"
            variant="filled"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            scrollToFirstError
            initialValues={values}
        >
            <Form.Item<FieldType>
                label="Company"
                name="company"
                rules={[
                    { required: true, message: 'Please enter the name of the company!' },
                    { max: 100 },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Legal Representative"
                name="legalRepresentative"
                rules={[{ max: 100 }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType> label="City" name="city" rules={[{ max: 50 }]}>
                <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Address" name="address" rules={[{ max: 100 }]}>
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Unified Identification Code (UIC)"
                name="uic"
                rules={[
                    { max: 20 },
                    { pattern: /^[0-9]+$/, message: 'UIC must consist of numbers only' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType> label="VAT Number" name="vat" rules={[{ max: 20 }]}>
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
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

            <Form.Item<FieldType>
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

            <Form.Item<FieldType> label="Bank" name="bank" rules={[{ max: 50 }]}>
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
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

            <Form.Item<FieldType>
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

            <Form.Item<FieldType>
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

            <Form.Item<FieldType>
                label="Price group"
                name="priceGroup"
                rules={[{ required: true, message: 'Please select a price group!' }]}
            >
                <Select>
                    <Select.Option value="retail">Retail</Select.Option>
                    <Select.Option value="wholesale">Wholesale</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item<FieldType>
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please select a type!' }]}
            >
                <Select>
                    <Select.Option value="customer">Customer</Select.Option>
                    <Select.Option value="supplier">Supplier</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEdit;
