import { useEffect, useState } from 'react';
import { App, Button, Form, FormProps, Input, InputNumber, Select, Space, Spin } from 'antd';
import { useParams } from 'react-router-dom';

import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Customer, CustomerGroup } from '../types/Customer';
import customerService from '../../../services/customerService';
import customerGroupService from '../../../services/customerGroupService';
import vatService from '../../../services/external/vatService';

const Update: React.FC = () => {
    const { message } = App.useApp();
    const params = useParams();
    const id = params.id;
    const [form] = Form.useForm();
    const [values, setValues] = useState<Partial<Customer>>({});
    const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const customerGroups = await customerGroupService.getCustomerGroups();
            setCustomerGroups(customerGroups);

            if (!id) return;
            setLoading(true);
            const customer = await customerService.getCustomerById(Number(id));
            setValues(customer);
            form.setFieldsValue(customer);
            setLoading(false);
        };

        fetchData();
    }, [form, id]);

    const onFinish: FormProps<Customer>['onFinish'] = async (values) => {
        setSaving(true);

        try {
            if (id) {
                await customerService.updateCustomer({ ...values, id: Number(id) });
                message.success('Customer successfully updated!');
            } else {
                await customerService.createCustomer(values);
                message.success('Customer successfully created!');
            }

            setSaving(false);
        } catch {
            setSaving(false);
            message.error('Failed to update customer');
        }
    };

    const onFinishFailed: FormProps<Customer>['onFinishFailed'] = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0]);
        console.log('Failed:', errorInfo);
    };

    async function checkVAT() {
        const vat = form.getFieldValue('taxVAT');

        if (!vat) return;

        const pattern = /^(?<Prefix>[a-zA-Z]+)(?<Number>\d+)$/;

        const match = vat.match(pattern);

        if (!match || !match.groups) return message.error('Invalid VAT number.');

        const countryCode = match.groups['Prefix'].toUpperCase();
        const vatNumber = match.groups['Number'];

        const response = await vatService.checkVAT({ countryCode, vatNumber });

        console.log(response);
        // TODO: fix CORS error
    }

    return (
        <Form
            form={form}
            style={{ padding: '20px' }}
            layout="vertical"
            variant="filled"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            scrollToFirstError
            initialValues={values}
        >
            {loading ? (
                <Spin size="large" fullscreen />
            ) : (
                <>
                    <Space style={{ display: 'block' }}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Name is required.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="pmr"
                            label="Person materially responsible (PMR)"
                            rules={[{ required: true, message: 'PMR is required.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="customerGroup"
                            label="Customer group"
                            getValueFromEvent={(value: number) => {
                                return customerGroups.find((g) => g.id == value);
                            }}
                            getValueProps={(userGroup: CustomerGroup) => {
                                return {
                                    value: userGroup?.id,
                                };
                            }}
                        >
                            <Select
                                allowClear
                                fieldNames={{ label: 'name', value: 'id' }}
                                options={customerGroups}
                            />
                        </Form.Item>

                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email', message: 'Invalid email address.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="vat"
                            label="VAT"
                            rules={[
                                { required: true, message: 'VAT is required.' },
                                { pattern: /^[0-9]+$/, message: 'VAT must be a number.' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="taxVAT" label="Tax VAT">
                            <Space.Compact style={{ width: '100%' }}>
                                <Input />
                                <Button icon={<SearchOutlined />} type="primary" onClick={checkVAT}>
                                    Search
                                </Button>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item name="address" label="Address">
                            <Input />
                        </Form.Item>

                        <Form.Item name="deliveryAddress" label="Delivery address">
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="discount"
                            label="Discount (%)"
                            help="If set, it will be used instead of the Customer Group discount."
                        >
                            <InputNumber style={{ width: '100%' }} min={0} max={100} />
                        </Form.Item>
                    </Space>

                    <Form.Item style={{ textAlign: 'center', marginTop: 50 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size={'large'}
                            icon={<SaveOutlined />}
                            loading={saving}
                        >
                            Save customer
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default Update;
