import { Button, Empty, Form, FormItemProps, Select, Space, Table, Tag, Tooltip } from 'antd';
import { InventoryUnit, ProductAttribute, VariationAttribute } from '../types/EditProductTypes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import QuantityField from './QuantityField';
import { LOCATIONS_ENABLED } from '../../../../global';
import { DefaultOptionType } from 'antd/es/select';
import SKUField from './SKUField';
import BarcodeField from './BarcodeField';
import AddButtonTable from '../../../../components/AddButtonTable';

function SelectField({
    name,
    options,
    attributeName,
    props,
}: {
    name: (number | string)[];
    options: DefaultOptionType[];
    attributeName: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item
            {...props}
            name={[...name, 'value']}
            label={attributeName}
            rules={[{ required: true, message: 'Value is required.' }]}
            layout="horizontal"
        >
            <Select placeholder="Select value" optionFilterProp="label" options={options} />
        </Form.Item>
    );
}

export default function VariationsTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();
    const attributes = Form.useWatch('attributes') || [];
    const manageQuantity = Form.useWatch('manageQuantity');
    const isDisabled =
        attributes.length === 0 || !attributes.find((a: ProductAttribute) => a.isVariational);

    return (
        <Form.List
            name="variations"
            rules={[
                {
                    validator: (_, value) => {
                        if (!value || value.length === 0) {
                            return Promise.reject(new Error('At least one variation is required.'));
                        }
                        return Promise.resolve();
                    },
                },
            ]}
        >
            {(variations, { add, remove }) => {
                return (
                    <>
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
                                    ></Empty>
                                ),
                            }}
                        >
                            <Column
                                dataIndex={'id'}
                                title={'ID'}
                                width={50}
                                render={(_, row) => {
                                    return form.getFieldValue(['variations', row.name, 'id']);
                                }}
                            />

                            <Column
                                dataIndex={'sku'}
                                title={'SKU'}
                                width={150}
                                render={(_, row) => {
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue(['variations', row.name, 'sku']);
                                    return (
                                        <SKUField
                                            props={{
                                                style: { marginBottom: 0 },
                                            }}
                                            name={[row.name]}
                                            label=""
                                        />
                                    );
                                }}
                            />

                            <Column
                                dataIndex={'barcode'}
                                title={'Barcode'}
                                width={150}
                                render={(_, row) => {
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue([
                                            'variations',
                                            row.name,
                                            'barcode',
                                        ]);
                                    return (
                                        <BarcodeField
                                            props={{
                                                style: { marginBottom: 0 },
                                            }}
                                            name={[row.name]}
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
                                                form.getFieldValue([
                                                    'variations',
                                                    row.name,
                                                    'retailPrice',
                                                ])}

                                            <PriceField
                                                props={{
                                                    hidden: editingIndex !== row.name,
                                                    style: { marginBottom: 0 },
                                                }}
                                                name={[row.name, 'retailPrice']}
                                                label=""
                                            />
                                        </>
                                    );
                                    if (editingIndex !== row.name)
                                        return form.getFieldValue([
                                            'variations',
                                            row.name,
                                            'retailPrice',
                                        ]);

                                    return;
                                }}
                            />

                            {/* TODO: Decide if all products should be in one column or every attribute should be in a separate column */}
                            <Column
                                dataIndex={'attributes'}
                                title={'Attributes'}
                                render={(_, row) => {
                                    const attributes = form.getFieldValue([
                                        'variations',
                                        row.name,
                                        'attributes',
                                    ]);
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                attributes.map((a: VariationAttribute) => {
                                                    return (
                                                        <Tag key={a.attributeId}>
                                                            {a.attributeName} (
                                                            {a.value.value || 'None'})
                                                        </Tag>
                                                    );
                                                })}

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
                                                                    props={{
                                                                        hidden:
                                                                            editingIndex !==
                                                                            row.name,
                                                                    }}
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
                                        </>
                                    );
                                }}
                            />

                            {attributes
                                .filter((a: ProductAttribute) => a.isVariational)
                                .map((attribute: ProductAttribute) => (
                                    <Column
                                        dataIndex={attribute.name}
                                        title={attribute.name}
                                        render={(_, row) => {
                                            const variationAttributes = form.getFieldValue([
                                                'variations',
                                                row.name,
                                                'attributes',
                                            ]);

                                            const attributeValue = variationAttributes.find(
                                                (a: VariationAttribute) =>
                                                    a.attributeId === attribute.attributeId
                                            ).value.value;

                                            return (
                                                <>
                                                    {editingIndex !== row.name && attributeValue}

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
                                                        props={{
                                                            style: { marginBottom: 0 },
                                                            hidden: editingIndex !== row.name,
                                                        }}
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                ))}

                            {(manageQuantity || LOCATIONS_ENABLED) && (
                                <Column
                                    dataIndex={'inventoryUnits'}
                                    title={manageQuantity ? 'Quantity' : 'Locations'}
                                    render={(_, row) => {
                                        return (
                                            <>
                                                {editingIndex !== row.name &&
                                                    (LOCATIONS_ENABLED
                                                        ? form
                                                              .getFieldValue([
                                                                  'variations',
                                                                  row.name,
                                                                  'inventoryUnits',
                                                              ])
                                                              .map((unit: InventoryUnit) => {
                                                                  return (
                                                                      <Tag key={unit.id}>
                                                                          {unit.location!.name}{' '}
                                                                          {manageQuantity
                                                                              ? `(${unit.quantity})`
                                                                              : ''}
                                                                      </Tag>
                                                                  );
                                                              })
                                                        : form.getFieldValue([
                                                              'variations',
                                                              row.name,
                                                              'inventoryUnits',
                                                          ])[0].quantity)}

                                                <QuantityField
                                                    quantityProps={{
                                                        style: {
                                                            marginBottom: LOCATIONS_ENABLED
                                                                ? undefined
                                                                : 0,
                                                        },
                                                        hidden: editingIndex !== row.name,
                                                    }}
                                                    locationProps={{
                                                        hidden: editingIndex !== row.name,
                                                    }}
                                                    name={[row.name]}
                                                    showLocationLabel={manageQuantity}
                                                    locationRequired={false}
                                                    quantity={{
                                                        layout: 'horizontal',
                                                        label: !LOCATIONS_ENABLED ? '' : undefined,
                                                    }}
                                                />
                                            </>
                                        );
                                    }}
                                />
                            )}

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

                        <Tooltip
                            title={
                                isDisabled
                                    ? 'Mark at least one attribute as variational'
                                    : undefined
                            }
                        >
                            <>
                                <AddButtonTable
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
                                            inventoryUnits: [],
                                        })
                                    }
                                />
                            </>
                        </Tooltip>
                    </>
                );
            }}
        </Form.List>
    );
}
