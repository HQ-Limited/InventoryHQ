import { Button, Empty, Form, Menu, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
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
import AddButtonTable from '../../../../components/Table/AddButtonTable';
import MinStockField from './MinStockField';
import { generateEmptyInventoryUnits } from './shared_functions';
import { Context } from '../Context';

function generateAttributesCombinations(
    attributes: ProductAttribute[]
): Partial<VariationAttribute>[][] {
    const variational = attributes.filter((attr) => attr.isVariational);

    const valueSets = variational.map((attr) => attr.values.map((val) => ({ attr, val })));

    // Iterative cartesian product (faster than reduce + flatMap)
    let combos: { attr: ProductAttribute; val: AttributeValue }[][] = [[]];

    for (const set of valueSets) {
        const newCombos: typeof combos = [];
        for (const combo of combos) {
            for (const item of set) {
                // push instead of spread
                newCombos.push([...combo, item]);
            }
        }
        combos = newCombos;
    }

    // Transform into your VariationAttribute shape
    return combos.map((combo) =>
        combo.map(({ attr, val }) => ({
            attributeName: attr.name,
            attributeId: attr.attributeId,
            value: val,
        }))
    );
}

export default function VariationsTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();
    const attributes = Form.useWatch('attributes') || [];
    const isAddBtnDisabled =
        attributes.length === 0 || !attributes.find((a: ProductAttribute) => a.isVariational);

    const { locations, variationAttributeErrors, setVariationAttributeErrors } =
        useContext(Context);

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

    const [open, setOpen] = useState(false);
    function generateVariations() {
        const combinations = generateAttributesCombinations(attributes);
        const newVariations = combinations.map((combination) => {
            return {
                attributes: combination,
                inventoryUnits: generateEmptyInventoryUnits(locations),
            };
        });
        form.setFieldValue('variations', newVariations);
    }

    const handleMenuOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setOpen(newOpen);
            return;
        }
        if (form.getFieldValue('variations').length === 0) {
            generateVariations();
        } else {
            setOpen(newOpen);
        }
    };

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
                        <Menu
                            mode="horizontal"
                            items={[
                                {
                                    key: 'generate-combinations',
                                    label: (
                                        <Popconfirm
                                            title="Warning"
                                            description="This will remove all existing variations. Do you want to continue?"
                                            open={open}
                                            onOpenChange={handleMenuOpenChange}
                                            onConfirm={generateVariations}
                                            okText="Yes"
                                            okType="danger"
                                        >
                                            <Tooltip
                                                title={
                                                    isAddBtnDisabled
                                                        ? 'Mark at least one attribute as variational'
                                                        : undefined
                                                }
                                            >
                                                <Button disabled={isAddBtnDisabled}>
                                                    Generate variations
                                                </Button>
                                            </Tooltip>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
                        />
                        <Table
                            virtual
                            rowClassName={(_, index) => {
                                return variationAttributeErrors.find(
                                    (error) => error.index === index
                                )
                                    ? 'error-row'
                                    : '';
                            }}
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
                                                                        onChange={() => {
                                                                            const error =
                                                                                variationAttributeErrors.find(
                                                                                    (error) =>
                                                                                        error.index ===
                                                                                        row.name
                                                                                );

                                                                            if (!error) return;

                                                                            form.setFields(
                                                                                error.errorFieldNames.map(
                                                                                    (
                                                                                        fieldName
                                                                                    ) => ({
                                                                                        name: fieldName,
                                                                                        errors: [],
                                                                                    })
                                                                                )
                                                                            );

                                                                            setVariationAttributeErrors(
                                                                                variationAttributeErrors.filter(
                                                                                    (i) =>
                                                                                        i.index !==
                                                                                        row.name
                                                                                )
                                                                            );
                                                                        }}
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
                                isAddBtnDisabled
                                    ? 'Mark at least one attribute as variational'
                                    : undefined
                            }
                        >
                            <>
                                <AddButtonTable
                                    disabled={isAddBtnDisabled}
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
