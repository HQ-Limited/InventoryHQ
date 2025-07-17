import {
    Button,
    Form,
    FormProps,
    Input,
    InputNumber,
    Menu,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';
import { Location, InventoryUnit, Variation, Product, Package } from '../types/EditProductTypes';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import { QuantityInputField } from './QuantityField';
import DescriptionField from './DescriptionField';

const LocationField = ({
    name,
    locations,
    disabled = false,
    label = '',
}: {
    name: (number | string)[];
    locations: Location[];
    disabled?: boolean;
    label?: string;
}) => {
    return (
        <Form.Item
            name={[...name, 'location']}
            label={label}
            rules={[{ required: true, message: 'Please select a location' }]}
            getValueFromEvent={(value: number) => {
                return locations.find((l) => l.id == value);
            }}
            getValueProps={(values) => {
                return {
                    value: values?.id,
                };
            }}
        >
            <Select
                disabled={disabled}
                showSearch
                placeholder="Select location"
                optionFilterProp="label"
                options={locations!.map((location) => ({
                    label: location.name,
                    value: location.id,
                }))}
            />
        </Form.Item>
    );
};

export default function PackagesTable({ locations }: { locations: Location[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(undefined);
    const [createPackageForm] = Form.useForm();
    const form = Form.useFormInstance();

    const showModal = () => {
        const variations = form.getFieldValue('variations') || [];
        createPackageForm.resetFields();

        // Set all variations
        createPackageForm.setFieldsValue({
            packagesAmount: 1,
            inventoryUnits: variations.map((variation: Variation) => ({
                variation: variation,
            })),
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Form.List name="packages">
            {(packages, { add, remove }) => {
                const handleAddPackageForm: FormProps<Package>['onFinish'] = async (values) => {
                    const packagesAmount = createPackageForm.getFieldValue('packagesAmount');
                    for (let i = 0; i < packagesAmount; i++) {
                        add({
                            location: values.location,
                            label: values.label,
                            description: values.description,
                            price: values.price,
                            inventoryUnits: values.inventoryUnits,
                        });
                    }
                    handleCancel();
                };
                return (
                    <>
                        <Modal
                            title="Add Packages"
                            closable={{ 'aria-label': 'Custom Close Button' }}
                            open={isModalOpen}
                            onOk={() => createPackageForm.submit()}
                            okText="Add"
                            okButtonProps={{
                                type: 'primary',
                                htmlType: 'submit',
                            }}
                            onCancel={handleCancel}
                            centered
                        >
                            <Form
                                preserve={false}
                                layout="vertical"
                                form={createPackageForm}
                                onFinish={handleAddPackageForm}
                            >
                                <LocationField name={[]} locations={locations} label="Location" />
                                <Form.Item name="label" label="Label">
                                    <Input />
                                </Form.Item>
                                <DescriptionField />
                                <PriceField label="Price" name={['price']} />
                                <Form.List name="inventoryUnits">
                                    {(inventoryUnits, { add, remove }) => (
                                        <Table
                                            dataSource={inventoryUnits}
                                            pagination={false}
                                            sticky
                                            bordered
                                        >
                                            <Column
                                                dataIndex={'sku'}
                                                title="SKU"
                                                render={(value, row, index) => {
                                                    return createPackageForm.getFieldValue([
                                                        'inventoryUnits',
                                                        index,
                                                        'variation',
                                                        'sku',
                                                    ]);
                                                }}
                                            />
                                            <Column
                                                dataIndex="quantity"
                                                title="Quantity"
                                                render={(value, row, index) => {
                                                    return (
                                                        <QuantityInputField
                                                            name={[index]}
                                                            label=""
                                                        />
                                                    );
                                                }}
                                            />
                                        </Table>
                                    )}
                                </Form.List>

                                <Form.Item
                                    name="packagesAmount"
                                    label="Package to create"
                                    style={{ marginTop: 20 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the packages amount',
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} step={1} />
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Menu
                            mode="horizontal"
                            items={[
                                {
                                    key: 'add-package',
                                    label: (
                                        <Button type="primary" icon={<PlusOutlined />}>
                                            Add Packages
                                        </Button>
                                    ),
                                    onClick: showModal,
                                },
                            ]}
                            selectable={false}
                        />

                        <Table
                            dataSource={packages}
                            pagination={false}
                            size="small"
                            sticky
                            bordered
                        >
                            <Column
                                dataIndex={'id'}
                                title={'ID'}
                                width={50}
                                render={(value, row, index) => {
                                    return form.getFieldValue(['packages', index, 'id']);
                                }}
                            />
                            <Column
                                width={200}
                                dataIndex={'location'}
                                title={'Location'}
                                render={(value, row, index) => {
                                    if (editingIndex !== index)
                                        return form.getFieldValue([
                                            'packages',
                                            index,
                                            'location',
                                            'name',
                                        ]);

                                    return (
                                        <LocationField
                                            name={[index]}
                                            locations={locations}
                                            disabled={editingIndex !== index}
                                        />
                                    );
                                }}
                            />
                            <Column
                                width={200}
                                dataIndex={'label'}
                                title={'Label'}
                                render={(value, row, index) => {
                                    if (editingIndex !== index)
                                        return form.getFieldValue(['packages', index, 'label']);

                                    return (
                                        <Form.Item name={[index, 'label']}>
                                            <Input />
                                        </Form.Item>
                                    );
                                }}
                            />
                            <Column
                                width={250}
                                dataIndex={'description'}
                                title={'Description'}
                                render={(value, row, index) => {
                                    if (editingIndex !== index)
                                        return form.getFieldValue([
                                            'packages',
                                            index,
                                            'description',
                                        ]);

                                    return (
                                        <DescriptionField name={[index, 'description']} label="" />
                                    );
                                }}
                            />
                            <Column
                                width={150}
                                dataIndex={'price'}
                                title={'Price'}
                                render={(value, row, index) => {
                                    if (editingIndex !== index)
                                        return form.getFieldValue(['packages', index, 'price']);

                                    return <PriceField name={[index, 'price']} label="" />;
                                }}
                            />
                            <Column
                                dataIndex={'inventoryUnits'}
                                title={'Contents'}
                                render={(value, row, index) => {
                                    if (editingIndex !== index) {
                                        return (
                                            <Space>
                                                {form
                                                    .getFieldValue([
                                                        'packages',
                                                        index,
                                                        'inventoryUnits',
                                                    ])
                                                    .map((unit: InventoryUnit, iuIndex: number) => (
                                                        <Tag key={iuIndex}>
                                                            {unit.variation.sku} ({unit.quantity})
                                                        </Tag>
                                                    ))}
                                            </Space>
                                        );
                                    }

                                    return (
                                        <Form.List name={[index, 'inventoryUnits']}>
                                            {(inventoryUnits, { add, remove }) => (
                                                <>
                                                    {inventoryUnits.map((unit, iuIndex) => (
                                                        <QuantityInputField
                                                            key={iuIndex}
                                                            name={[iuIndex]}
                                                            label={form.getFieldValue([
                                                                'packages',
                                                                index,
                                                                'inventoryUnits',
                                                                iuIndex,
                                                                'variation',
                                                                'sku',
                                                            ])}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                            {/* TODO: Possibly add the option to add new content? Currently, when a new variation is added, the contents are not added automatically. */}
                                        </Form.List>
                                    );
                                }}
                            />
                            <Column
                                width={100}
                                title={'Action'}
                                render={(value, row, index) => {
                                    return (
                                        <Space size="middle">
                                            <Button
                                                icon={<EditOutlined />}
                                                variant="solid"
                                                color="primary"
                                                shape={'circle'}
                                                onClick={() =>
                                                    editingIndex === index
                                                        ? setEditingIndex(undefined)
                                                        : setEditingIndex(row.name)
                                                }
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                shape={'circle'}
                                                variant="solid"
                                                color="danger"
                                                onClick={() => remove(row.name)}
                                            />
                                        </Space>
                                    );
                                }}
                            />
                        </Table>
                    </>
                );
            }}
        </Form.List>
    );
}
