import { Button, Empty, Form, Menu, Select, Tooltip, Space, Table, Tag } from 'antd';

import {
    Location,
    InventoryUnit,
    Variation,
    ProductAttribute,
    VariationAttribute,
} from '../types/EditProductTypes';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import QuantityField from './QuantityField';
import { LOCATIONS_ENABLED } from '../../../../global';
import { DefaultOptionType } from 'antd/es/select';
import SKUField from './SKUField';

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

    const AddVariationButton = ({ add }: { add: (variation: Partial<Variation>) => void }) => {
        const isDisabled = isVariable && variations.length === 0;
        return (
            <Tooltip title={isDisabled ? 'Create at least one variation first' : undefined}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={isDisabled}
                    onClick={() =>
                        add({
                            attributes: attributes
                                .filter((a: ProductAttribute) => a.isVariational)
                                .map((a: ProductAttribute) => ({
                                    attributeId: a.attributeId,
                                    attributeName: a.name,
                                    value: {},
                                })),
                        })
                    }
                >
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
                                    label: <AddVariationButton add={add} />,
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
                                        <AddVariationButton add={add} />
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
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue(['variations', row.name, 'sku']);
                                    return <SKUField name={[row.name]} label="" />;
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
                                    if (editingIndex !== row.name) {
                                        if (LOCATIONS_ENABLED)
                                            return form
                                                .getFieldValue([
                                                    'variations',
                                                    row.name,
                                                    'inventoryUnits',
                                                ])
                                                .map((unit: InventoryUnit) => {
                                                    return (
                                                        <Tag>
                                                            {unit.location.name} ({unit.quantity})
                                                        </Tag>
                                                    );
                                                });
                                        return form.getFieldValue([
                                            'variations',
                                            row.name,
                                            'inventoryUnits',
                                        ])[0].quantity;
                                    }

                                    return (
                                        <QuantityField
                                            name={[row.name]}
                                            locations={locations}
                                            quantity={{
                                                layout: 'horizontal',
                                                label: !LOCATIONS_ENABLED ? '' : undefined,
                                            }}
                                        />
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
