import { Button, Card, Flex, Form, Select, Tooltip } from 'antd';
import { ProductAttribute } from '../../../../types/ProductTypes';
import PriceField from './PriceField';
import React from 'react';
import SKUField from './SKUField';
import ManageQuantityField from './ManageQuantityField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../../global';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';

function SelectField({ name, options }: { name: number; options: DefaultOptionType[] }) {
    return (
        <Form.Item name={[name, 'value']} rules={[{ required: true }]}>
            <Select
                allowClear
                placeholder="Select value"
                optionFilterProp="value"
                options={options}
            />
        </Form.Item>
    );
}

export default function VariationsCards() {
    const { getFieldValue } = Form.useFormInstance();
    const attributes: ProductAttribute[] = getFieldValue('attributes') || [];

    return (
        <Form.List name="variations">
            {(fields, { add, remove }) => (
                <>
                    <Flex style={{ paddingBottom: '20px' }} gap={10}>
                        <Tooltip
                            title={
                                attributes!.length === 0
                                    ? 'Add attributes first'
                                    : !attributes!.find((a) => a.isVariational === true)
                                      ? 'Select at least one attribute as variational'
                                      : !attributes!.find(
                                              (a) =>
                                                  a.values!.length > 0 && a.isVariational === true
                                          )
                                        ? 'Select atleast one value for variational attribute'
                                        : ''
                            }
                        >
                            <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                                Add Variation
                            </Button>
                        </Tooltip>
                    </Flex>
                    <Flex gap={20} wrap="wrap">
                        {fields.map((field, variationKey) => (
                            <Card
                                key={field.key}
                                title={`Variation ${variationKey + 1}`}
                                extra={
                                    <Tooltip title="Remove variation" color="red">
                                        <Button
                                            type="text"
                                            danger
                                            icon={<CloseOutlined />}
                                            onClick={() => remove(field.name)}
                                        />
                                    </Tooltip>
                                }
                            >
                                <Form.List name={[field.name, 'attributes']}>
                                    {(fields) => (
                                        <>
                                            {fields.map((field, attributeKey) => {
                                                return (
                                                    <SelectField
                                                        key={field.key}
                                                        name={attributeKey}
                                                        options={attributes[attributeKey].values}
                                                    />
                                                );
                                            })}
                                        </>
                                    )}
                                </Form.List>
                                <SKUField name={field.name} />

                                <PriceField name={[field.name, 'retailPrice']} />

                                {WHOLESALE_ENABLED && (
                                    <PriceField
                                        name={[field.name, 'wholesalePrice']}
                                        label="Wholesale Price"
                                    />
                                )}

                                <ManageQuantityField name={field.name} />

                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prev, curr) =>
                                        prev.variations?.[variationKey]?.manage_quantity !==
                                        curr.variations?.[variationKey]?.manage_quantity
                                    }
                                >
                                    {({ getFieldValue }) => {
                                        const manage_quantity = getFieldValue([
                                            'variations',
                                            variationKey,
                                            'manage_quantity',
                                        ]);
                                        return (
                                            manage_quantity && <QuantityField name={field.name} />
                                        );
                                    }}
                                </Form.Item>
                            </Card>
                        ))}
                    </Flex>
                </>
            )}
        </Form.List>
    );
}
