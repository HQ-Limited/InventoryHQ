import {
    Button,
    Empty,
    Form,
    FormItemProps,
    FormProps,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
} from 'antd';
import { Location, InventoryUnit, Variation, Package } from '../types/EditProductTypes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import { QuantityInputField } from './QuantityField';
import DescriptionField from './DescriptionField';
import { LOCATIONS_ENABLED } from '../../../../global';
import { Context } from '../Context';
import AddButtonTable from '../../../../components/AddButtonTable';

const LocationField = ({
    name,
    locations,
    label = '',
    props,
}: {
    name: (number | string)[];
    locations: Location[];
    label?: string;
    props?: FormItemProps;
}) => {
    return (
        <Form.Item
            {...props}
            name={[...name, 'location']}
            label={label}
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
                allowClear
                showSearch
                placeholder="None"
                optionFilterProp="label"
                options={locations!.map((location) => ({
                    label: location.name,
                    value: location.id,
                }))}
            />
        </Form.Item>
    );
};

export default function PackagesTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(undefined);
    const [createPackageForm] = Form.useForm();
    const form = Form.useFormInstance();
    const variations = Form.useWatch('variations');
    const { locations, isVariable } = useContext(Context);

    const showModal = () => {
        createPackageForm.resetFields();

        // Set all variations
        createPackageForm.setFieldsValue({
            packagesAmount: 1,
            inventoryUnits: variations.map((variation: Variation) => ({
                variation: {
                    sku: variation.sku,
                    id: variation.id,
                },
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
                            styles={{
                                body: {
                                    paddingTop: 20,
                                },
                            }}
                        >
                            <Form
                                layout="vertical"
                                form={createPackageForm}
                                onFinish={handleAddPackageForm}
                            >
                                {LOCATIONS_ENABLED && (
                                    <LocationField
                                        name={[]}
                                        locations={locations}
                                        label="Location"
                                    />
                                )}

                                <Form.Item name="label" label="Label">
                                    <Input />
                                </Form.Item>

                                <DescriptionField />

                                <PriceField label="Price" name={['price']} />

                                <Form.List name="inventoryUnits">
                                    {(inventoryUnits) => {
                                        if (!isVariable) {
                                            return (
                                                <QuantityInputField
                                                    name={[0]}
                                                    label="Quantity in package"
                                                />
                                            );
                                        }

                                        return (
                                            <Table
                                                dataSource={inventoryUnits}
                                                pagination={false}
                                                sticky
                                                bordered
                                            >
                                                <Column
                                                    dataIndex={'sku'}
                                                    title="SKU"
                                                    render={(value, row) => {
                                                        return createPackageForm.getFieldValue([
                                                            'inventoryUnits',
                                                            row.name,
                                                            'variation',
                                                            'sku',
                                                        ]);
                                                    }}
                                                />
                                                <Column
                                                    dataIndex="quantity"
                                                    title="Quantity in package"
                                                    render={(value, row) => {
                                                        return (
                                                            <QuantityInputField
                                                                name={[row.name]}
                                                                label=""
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Table>
                                        );
                                    }}
                                </Form.List>

                                <Form.Item
                                    name="packagesAmount"
                                    label="Packages to create"
                                    style={{ marginTop: 20 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Packages amount is required.',
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} step={1} />
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Table
                            dataSource={packages}
                            pagination={false}
                            size="small"
                            sticky
                            bordered
                            locale={{
                                emptyText: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="This product has no packages"
                                    ></Empty>
                                ),
                            }}
                        >
                            <Column
                                dataIndex={'id'}
                                title={'ID'}
                                width={50}
                                render={(_, row) => {
                                    return form.getFieldValue(['packages', row.name, 'id']);
                                }}
                            />
                            {LOCATIONS_ENABLED && (
                                <Column
                                    width={200}
                                    dataIndex={'location'}
                                    title={'Location'}
                                    render={(_, row) => {
                                        if (editingIndex !== row.name)
                                            return form.getFieldValue([
                                                'packages',
                                                row.name,
                                                'location',
                                                'name',
                                            ]);

                                        return (
                                            <LocationField
                                                props={{
                                                    style: { marginBottom: 0 },
                                                }}
                                                name={[row.name]}
                                                locations={locations}
                                            />
                                        );
                                    }}
                                />
                            )}
                            <Column
                                width={200}
                                dataIndex={'label'}
                                title={'Label'}
                                render={(_, row) => {
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue(['packages', row.name, 'label']);

                                    return (
                                        <Form.Item
                                            style={{ marginBottom: 0 }}
                                            name={[row.name, 'label']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    );
                                }}
                            />
                            <Column
                                width={250}
                                dataIndex={'description'}
                                title={'Description'}
                                render={(_, row) => {
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue([
                                            'packages',
                                            row.name,
                                            'description',
                                        ]);

                                    return (
                                        <DescriptionField
                                            rows={1}
                                            props={{
                                                style: { marginBottom: 0 },
                                            }}
                                            name={[row.name, 'description']}
                                            label=""
                                        />
                                    );
                                }}
                            />
                            <Column
                                width={150}
                                dataIndex={'price'}
                                title={'Price'}
                                render={(_, row) => {
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                form.getFieldValue(['packages', row.name, 'price'])}

                                            <PriceField
                                                props={{
                                                    hidden: editingIndex !== row.name,
                                                    style: { marginBottom: 0 },
                                                }}
                                                name={[row.name, 'price']}
                                                label=""
                                            />
                                        </>
                                    );
                                }}
                            />
                            <Column
                                dataIndex={'inventoryUnits'}
                                title={isVariable ? 'Contents' : 'Quantity'}
                                render={(_, row) => {
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                (isVariable ? (
                                                    <Space>
                                                        {form
                                                            .getFieldValue([
                                                                'packages',
                                                                row.name,
                                                                'inventoryUnits',
                                                            ])
                                                            .map(
                                                                (
                                                                    unit: InventoryUnit,
                                                                    iuIndex: number
                                                                ) => (
                                                                    <Tag key={iuIndex}>
                                                                        {unit.variation.sku} (
                                                                        {unit.quantity})
                                                                    </Tag>
                                                                )
                                                            )}
                                                    </Space>
                                                ) : (
                                                    form.getFieldValue([
                                                        'packages',
                                                        row.name,
                                                        'inventoryUnits',
                                                        0,
                                                    ]).quantity
                                                ))}

                                            <Form.List name={[row.name, 'inventoryUnits']}>
                                                {(inventoryUnits) => (
                                                    <Space>
                                                        {inventoryUnits.map((unit) => (
                                                            <QuantityInputField
                                                                props={{
                                                                    hidden:
                                                                        editingIndex !== row.name,
                                                                }}
                                                                key={unit.key}
                                                                name={[unit.name]}
                                                                label={
                                                                    isVariable
                                                                        ? form.getFieldValue([
                                                                              'packages',
                                                                              row.name,
                                                                              'inventoryUnits',
                                                                              unit.name,
                                                                              'variation',
                                                                              'sku',
                                                                          ])
                                                                        : ''
                                                                }
                                                            />
                                                        ))}
                                                    </Space>
                                                )}
                                                {/* TODO: Possibly add the option to add new content? Currently, when a new variation is added, the contents are not added automatically. */}
                                            </Form.List>
                                        </>
                                    );
                                }}
                            />
                            <Column
                                width={100}
                                title={'Action'}
                                render={(_, row) => {
                                    return (
                                        <Space size="middle">
                                            <Button
                                                icon={<EditOutlined />}
                                                variant="solid"
                                                color="primary"
                                                shape={'circle'}
                                                onClick={() =>
                                                    editingIndex === row.name
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

                        <AddButtonTable onClick={showModal} />
                    </>
                );
            }}
        </Form.List>
    );
}
