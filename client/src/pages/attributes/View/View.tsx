import { App, Button, Col, Flex, Form, FormProps, Input, Row, Space, Table, Tag, Grid } from 'antd';
import { Attribute, AttributeValue } from '../../../types/AttributeTypes';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import attributeService from '../../../services/attributeService';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Column from 'antd/es/table/Column';
import { TextFilter } from '../../../components/TableTextFilter';
import { AxiosError } from 'axios';

const { useBreakpoint } = Grid;

const View: React.FC = () => {
    const { message } = App.useApp();
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [createAttributeLoading, setCreateAttributeLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
    const [deleteAttributeValueLoading, setDeleteAttributeValueLoading] = useState<number[]>([]);
    const [deleteAttributeLoading, setDeleteAttributeLoading] = useState<number[]>([]);
    const [formHidden, setFormHidden] = useState(true);
    const screens = useBreakpoint();

    useEffect(() => {
        if (editingIndex) {
            const attribute = attributes.find((attribute) => attribute.id === editingIndex);
            form.setFieldsValue(attribute);
        } else form.resetFields();
    }, [editingIndex]);

    const onFinish: FormProps<Attribute>['onFinish'] = async (values: Attribute) => {
        // Check for duplicate values and mark them in the form
        const attributeValues = values.values;
        if (attributeValues) {
            const valueCount: Record<string, number> = {};
            attributeValues.forEach((value) => {
                valueCount[value.value] = (valueCount[value.value] || 0) + 1;
            });
            const duplicateIds = attributeValues
                .filter((value) => valueCount[value.value] > 1)
                .map((value) => value.id);

            if (duplicateIds.length > 0) {
                // Mark duplicate ids in the form
                const errors = attributeValues
                    .map((value, idx) =>
                        duplicateIds.includes(value.id)
                            ? {
                                  name: ['values', idx, 'value'],
                                  errors: ['Duplicate value'],
                              }
                            : null
                    )
                    .filter(Boolean);

                form.setFields(errors as any);
                message.error('All values must be unique');
                return setCreateAttributeLoading(false);
            }
        }

        try {
            setCreateAttributeLoading(true);
            const attribute = values.id
                ? await attributeService.updateAttribute(values)
                : await attributeService.createAttribute({
                      name: values.name,
                      values: values.values,
                  });

            setAttributes([...attributes, attribute]);
            setEditingIndex(undefined);
            setFormHidden(true);
            form.resetFields();
        } catch (e) {
            const err = e as AxiosError;
            message.error(
                (err.response?.data as string) ||
                    `Failed to ${values.id ? 'update' : 'create'} attribute`
            );
        } finally {
            setCreateAttributeLoading(false);
        }
    };

    const onFinishFailed: FormProps<Attribute>['onFinishFailed'] = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0]);
    };

    const onDeleteAttribute = async (id: number) => {
        try {
            setDeleteAttributeLoading([...deleteAttributeLoading, id]);
            await attributeService.deleteAttribute(id);
            setAttributes(attributes.filter((attribute) => attribute.id !== id));
        } catch (e) {
            const err = e as AxiosError;
            message.error(err.response?.data as string);
        } finally {
            setDeleteAttributeLoading(deleteAttributeLoading.filter((id) => id !== id));
        }
    };

    const onDeleteAttributeValue = async (
        index: number,
        removeFromTable: (index: number) => void
    ) => {
        const attributeId = editingIndex!;
        const valueId: number = form.getFieldValue(['values', index]).id;

        try {
            setDeleteAttributeValueLoading([...deleteAttributeValueLoading, index]);
            await attributeService.deleteAttributeValue(attributeId, valueId);
            removeFromTable(index);
        } catch (e) {
            const err = e as AxiosError;
            message.error(err.response?.data as string);
        } finally {
            setDeleteAttributeValueLoading(
                deleteAttributeValueLoading.filter((id) => id !== index)
            );
        }
    };

    const columns: ColumnsType<Attribute> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Values',
            dataIndex: 'values',
            render: (values: AttributeValue[]) =>
                values.map((value) => <Tag key={value.id}>{value.value}</Tag>),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        variant="solid"
                        color="primary"
                        shape={'circle'}
                        onClick={() => {
                            if (editingIndex === record.id) {
                                setEditingIndex(undefined);
                                setFormHidden(true);
                            } else {
                                setEditingIndex(record.id);
                                setFormHidden(false);
                            }
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        shape={'circle'}
                        variant="solid"
                        color="danger"
                        loading={deleteAttributeLoading.includes(record.id)}
                        onClick={() => onDeleteAttribute(record.id)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoading(true);
            const response = await attributeService.getAttributes({ includeValues: true });
            setAttributes(response);
            setLoading(false);
        };
        fetchAttributes();
    }, []);

    // TODO: Check whats the best way to use filters: frontend or backend
    const filters = TextFilter<AttributeValue>();

    return (
        <Row gutter={32}>
            <Col
                xl={6}
                style={{ borderRight: screens.lg ? '1px solid #333' : 'none', marginBottom: 16 }}
            >
                {!screens.lg && formHidden ? (
                    <Button type="primary" onClick={() => setFormHidden(false)}>
                        Create attribute
                    </Button>
                ) : (
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item label="ID" name="id" hidden></Form.Item>
                        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="values">
                            {(fields, { add, remove }) => (
                                <>
                                    <Table
                                        dataSource={fields}
                                        pagination={false}
                                        scroll={{ y: 500 }}
                                    >
                                        <Column
                                            // {...filters}
                                            dataIndex={'value'}
                                            title={'Value'}
                                            render={(value, row) => {
                                                const attributeValue: AttributeValue =
                                                    form.getFieldValue(['values', row.name]);

                                                if (!attributeValue.id)
                                                    return (
                                                        <Form.Item
                                                            name={[row.name, 'value']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Value is required',
                                                                },
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    );

                                                return attributeValue.value;
                                            }}
                                        />
                                        <Column
                                            align="center"
                                            width={80}
                                            dataIndex={'actions'}
                                            title={'Actions'}
                                            render={(value, row) => {
                                                return (
                                                    <Button
                                                        variant="solid"
                                                        color="danger"
                                                        shape="circle"
                                                        icon={<DeleteOutlined />}
                                                        loading={deleteAttributeValueLoading.includes(
                                                            row.name
                                                        )}
                                                        onClick={() =>
                                                            onDeleteAttributeValue(row.name, remove)
                                                        }
                                                    />
                                                );
                                            }}
                                        />
                                    </Table>
                                    <Button
                                        variant="outlined"
                                        style={{
                                            width: '100%',
                                            borderTopLeftRadius: 0,
                                            borderTopRightRadius: 0,
                                        }}
                                        icon={<PlusOutlined />}
                                        onClick={() => add({})}
                                    >
                                        Add value
                                    </Button>
                                </>
                            )}
                        </Form.List>
                        <Flex justify="end" gap={16} style={{ marginTop: 16 }}>
                            {(!screens.lg || editingIndex) && (
                                <Button
                                    onClick={() => {
                                        setEditingIndex(undefined);
                                        setFormHidden(true);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createAttributeLoading}
                            >
                                {editingIndex ? 'Save' : 'Create'} attribute
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Col>
            <Col xs={24} xl={18}>
                <Table columns={columns} dataSource={attributes} rowKey="id" loading={loading} />
            </Col>
        </Row>
    );
};

export default View;
