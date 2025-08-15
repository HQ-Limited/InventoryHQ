import { Button, Empty, Form, Select, Space, Table, Tag, Tooltip } from 'antd';
import {
    AttributeValue,
    InventoryUnit,
    Package,
    ProductAttribute,
    VariationAttribute,
} from '../types/EditProductTypes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import Column from 'antd/es/table/Column';
import PriceField from './PriceField';
import QuantityField from './QuantityField';
import { LOCATIONS_ENABLED } from '../../../../global';
import SKUField from './SKUField';
import BarcodeField from './BarcodeField';
import AddButtonTable from '../../../../components/AddButtonTable';
import MinStockField from './MinStockField';
import { generateEmptyInventoryUnits } from './shared_functions';
import { Context } from '../Context';

export default function VariationsTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();
    const attributes = Form.useWatch('attributes') || [];
    const isDisabled =
        attributes.length === 0 || !attributes.find((a: ProductAttribute) => a.isVariational);

    const { locations } = useContext(Context);

    function onRemove(name: number, remove: (name: number) => void) {
        // remove from packages
        const variation = form.getFieldValue(['variations', name]);
        const packages = form.getFieldValue('packages');
        packages.forEach((pkg: Package) => {
            pkg.inventoryUnits = pkg.inventoryUnits.filter(
                (iu: InventoryUnit) => iu.variation.id !== variation.id
            );
        });
        form.setFieldValue('packages', packages);
        remove(name);
    }

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
                                }}
                            />

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

                                                            const attributeValues =
                                                                form
                                                                    .getFieldValue('attributes')
                                                                    .find(
                                                                        (a: ProductAttribute) =>
                                                                            a.attributeId ===
                                                                            variationAttribute.attributeId
                                                                    )?.values || [];

                                                            return (
                                                                <Form.Item
                                                                    key={attrKey}
                                                                    name={[attrField.name, 'value']}
                                                                    hidden={
                                                                        editingIndex !== row.name
                                                                    }
                                                                    label={
                                                                        variationAttribute.attributeName
                                                                    }
                                                                    getValueFromEvent={(
                                                                        value: number
                                                                    ) => {
                                                                        return attributeValues.find(
                                                                            (v: AttributeValue) =>
                                                                                v.id === value
                                                                        );
                                                                    }}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            validator: (
                                                                                _,
                                                                                record
                                                                            ) => {
                                                                                if (!record.value)
                                                                                    return Promise.reject(
                                                                                        new Error(
                                                                                            'Value is required.'
                                                                                        )
                                                                                    );

                                                                                return Promise.resolve();
                                                                            },
                                                                            message:
                                                                                'Attribute value is required.',
                                                                        },
                                                                    ]}
                                                                    layout="horizontal"
                                                                >
                                                                    <Select
                                                                        showSearch
                                                                        placeholder="Select value"
                                                                        optionFilterProp="label"
                                                                        options={attributeValues}
                                                                        fieldNames={{
                                                                            label: 'value',
                                                                            value: 'id',
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </Form.List>
                                        </>
                                    );
                                }}
                            />

                            <Column
                                dataIndex={'minStock'}
                                title="Min. Stock"
                                render={(_, row) => {
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                form.getFieldValue([
                                                    'variations',
                                                    row.name,
                                                    'minStock',
                                                ])}

                                            <MinStockField
                                                label=""
                                                props={{
                                                    style: {
                                                        marginBottom: 0,
                                                    },
                                                    hidden: editingIndex !== row.name,
                                                }}
                                                name={[row.name]}
                                            />
                                        </>
                                    );
                                }}
                            />

                            <Column
                                dataIndex={'inventoryUnits'}
                                title="Quantity"
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
                                                          .map(
                                                              (
                                                                  unit: InventoryUnit,
                                                                  index: number
                                                              ) => {
                                                                  return (
                                                                      <Tag key={index}>
                                                                          {unit.location!.name} (
                                                                          {unit.quantity})
                                                                      </Tag>
                                                                  );
                                                              }
                                                          )
                                                    : form.getFieldValue([
                                                          'variations',
                                                          row.name,
                                                          'inventoryUnits',
                                                      ])[0]?.quantity)}

                                            <QuantityField
                                                props={{
                                                    style: {
                                                        marginBottom: LOCATIONS_ENABLED
                                                            ? undefined
                                                            : 0,
                                                    },
                                                    hidden: editingIndex !== row.name,
                                                }}
                                                name={[row.name]}
                                                quantity={{
                                                    layout: 'horizontal',
                                                    label: !LOCATIONS_ENABLED ? '' : undefined,
                                                }}
                                            />
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
                                                onClick={() => onRemove(row.name, remove)}
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
                                            inventoryUnits: generateEmptyInventoryUnits(locations),
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
