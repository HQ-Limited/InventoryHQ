import {
    Button,
    Empty,
    Form,
    FormProps,
    Input,
    InputNumber,
    Menu,
    Modal,
    Select,
    Tooltip,
    Space,
    Table,
    Tag,
} from 'antd';

import {
    Location,
    InventoryUnit,
    Variation,
    Package,
    ProductAttribute,
    VariationAttribute,
} from '../types/EditProductTypes';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import { QuantityInputField } from './QuantityField';
import DescriptionField from './DescriptionField';
import { LOCATIONS_ENABLED } from '../../../../global';
import { DefaultOptionType } from 'antd/es/select';

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

function SelectField({
    name,
    options,
    attributeName,
}: {
    name: (number | string)[];
    options: DefaultOptionType[];
    attributeName: string;
}) {
    return (
        <Form.Item
            name={[...name, 'value']}
            label={attributeName}
            rules={[{ required: true, message: 'Select a value' }]}
            layout="horizontal"
        >
            <Select placeholder="Select value" optionFilterProp="label" options={options} />
        </Form.Item>
    );
}

export default function VariationsTable({ locations }: { locations: Location[] }) {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();
    const isVariable = Form.useWatch('isVariable');
    const variations = Form.useWatch('variations');
    const attributes = Form.useWatch('attributes') || [];

    const AddVariationButton = () => {
        const isDisabled = isVariable && variations.length === 0;
        return (
            <Tooltip title={isDisabled ? 'Create at least one variation first' : undefined}>
                <Button type="primary" icon={<PlusOutlined />} disabled={isDisabled}>
                    Add Variation
                </Button>
            </Tooltip>
        );
    };

    return (
        <Form.List name="variations">
            {(variations, { add, remove }) => {
                return (
                    <>
                        <Menu
                            mode="horizontal"
                            items={[
                                {
                                    key: 'add-variation',
                                    label: <AddVariationButton />,
                                },
                            ]}
                            selectable={false}
                        />

                        <Table
                            dataSource={variations}
                            pagination={false}
                            size="small"
                            sticky
                            bordered
                            locale={{
                                emptyText: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="This product has no variations"
                                    >
                                        <AddVariationButton />
                                    </Empty>
                                ),
                            }}
                        >
                            <Column
                                dataIndex={'id'}
                                title={'ID'}
                                width={50}
                                render={(value, row) => {
                                    return form.getFieldValue(['variations', row.name, 'id']);
                                }}
                            />
                            <Column
                                dataIndex={'sku'}
                                title={'SKU'}
                                width={150}
                                render={(value, row) => {
                                    return form.getFieldValue(['variations', row.name, 'sku']);
                                }}
                            />
                            <Column
                                width={150}
                                dataIndex={'price'}
                                title={'Price'}
                                render={(value, row) => {
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue([
                                            'variations',
                                            row.name,
                                            'retailPrice',
                                        ]);

                                    return <PriceField name={[row.name, 'retailPrice']} label="" />;
                                }}
                            />
                            <Column
                                dataIndex={'attributes'}
                                title={'Attributes'}
                                render={(value, row) => {
                                    const attributes = form.getFieldValue([
                                        'variations',
                                        row.name,
                                        'attributes',
                                    ]);
                                    if (editingIndex !== row.name) {
                                        return attributes.map((a: VariationAttribute) => {
                                            return (
                                                <Tag>
                                                    {a.attributeName} ({a.value.value})
                                                </Tag>
                                            );
                                        });
                                    }

                                    return (
                                        <Form.List name={[row.name, 'attributes']}>
                                            {(fields) => (
                                                <>
                                                    {fields.map((attrField, attrKey) => {
                                                        const variationAttribute =
                                                            form.getFieldValue([
                                                                'variations',
                                                                row.name,
                                                                'attributes',
                                                                attrField.name,
                                                            ]);

                                                        const options = form
                                                            .getFieldValue('attributes')
                                                            .find(
                                                                (a: ProductAttribute) =>
                                                                    a.attributeId ===
                                                                    variationAttribute.attributeId
                                                            )?.values;

                                                        return (
                                                            <SelectField
                                                                key={attrKey}
                                                                name={[attrField.name]}
                                                                options={options || []}
                                                                attributeName={
                                                                    variationAttribute.attributeName
                                                                }
                                                            />
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </Form.List>
                                    );
                                }}
                            />

                            {attributes
                                .filter((a: ProductAttribute) => a.isVariational)
                                .map((attribute: ProductAttribute) => (
                                    <Column
                                        dataIndex={attribute.name}
                                        title={attribute.name}
                                        render={(value, row) => {
                                            const variationAttributes = form.getFieldValue([
                                                'variations',
                                                row.name,
                                                'attributes',
                                            ]);

                                            const attributeValue = variationAttributes.find(
                                                (a: VariationAttribute) =>
                                                    a.attributeId === attribute.attributeId
                                            ).value.value;

                                            if (editingIndex !== row.name) return attributeValue;

                                            return (
                                                <SelectField
                                                    name={[
                                                        row.name,
                                                        'attributes',
                                                        variationAttributes.findIndex(
                                                            (a: VariationAttribute) =>
                                                                a.attributeId ===
                                                                attribute.attributeId
                                                        ),
                                                    ]}
                                                    options={attribute.values.map((v) => ({
                                                        label: v.value,
                                                        value: v.id,
                                                    }))}
                                                    attributeName={''}
                                                />
                                            );
                                        }}
                                    />
                                ))}

                            <Column
                                dataIndex={'inventoryUnits'}
                                title="Quantity"
                                render={(value, row) => {
                                    return (
                                        <Form.List name={[row.name, 'inventoryUnits']}>
                                            {(iU, { remove }) => {
                                                if (!LOCATIONS_ENABLED) {
                                                    if (editingIndex !== row.name)
                                                        return form.getFieldValue([
                                                            'variations',
                                                            row.name,
                                                            'inventoryUnits',
                                                            0,
                                                            'quantity',
                                                        ]);
                                                    return (
                                                        <QuantityInputField name={[0]} label="" />
                                                    );
                                                }
                                                return (
                                                    <>
                                                        {iU.map((iu) => {
                                                            if (editingIndex !== row.name) {
                                                                const inv = form.getFieldValue([
                                                                    'variations',
                                                                    row.name,
                                                                    'inventoryUnits',
                                                                    iu.name,
                                                                ]);
                                                                return (
                                                                    <Tag>
                                                                        {inv.location.name} (
                                                                        {inv.quantity})
                                                                    </Tag>
                                                                );
                                                            }

                                                            return (
                                                                <QuantityInputField
                                                                    name={[iu.name]}
                                                                    label={form.getFieldValue([
                                                                        'variations',
                                                                        row.name,
                                                                        'inventoryUnits',
                                                                        iu.name,
                                                                        'location',
                                                                        'name',
                                                                    ])}
                                                                    layout="horizontal"
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                );
                                            }}
                                        </Form.List>
                                    );
                                }}
                            />
                            <Column
                                width={100}
                                title={'Action'}
                                render={(value, row) => {
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
                    </>
                );
            }}
        </Form.List>
    );
}
