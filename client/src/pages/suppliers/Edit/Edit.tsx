import { useEffect, useState } from 'react';
import { App, Button, Form, FormProps, Input, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Supplier } from '../types/Supplier';
import supplierService from '../../../services/supplier';
import { checkVAT } from '../../functions/form';

const Update: React.FC = () => {
    const { message } = App.useApp();
    const params = useParams();
    const id = params.id;
    const [form] = Form.useForm();
    const [values, setValues] = useState<Partial<Supplier>>({});
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            const supplier = await supplierService.getSupplierById(Number(id));
            setValues(supplier);
            form.setFieldsValue(supplier);
            setLoading(false);
        };

        fetchData();
    }, [form, id]);

    const onFinish: FormProps<Supplier>['onFinish'] = async (values) => {
        setSaving(true);

        try {
            if (id) {
                await supplierService.updateSupplier({ ...values, id: Number(id) });
                message.success('Supplier successfully updated!');
            } else {
                const createdId = await supplierService.createSupplier(values);
                message.success('Supplier successfully created!');
                navigate(`/suppliers/${createdId}`);
            }

            setSaving(false);
        } catch {
            setSaving(false);
            message.error('Failed to update supplier');
        }
    };

    const onFinishFailed: FormProps<Supplier>['onFinishFailed'] = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0]);
        console.log('Failed:', errorInfo);
    };

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
                                <Button
                                    icon={<SearchOutlined />}
                                    type="primary"
                                    onClick={() => checkVAT(form, message)}
                                >
                                    Search
                                </Button>
                            </Space.Compact>
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
                            Save supplier
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default Update;
