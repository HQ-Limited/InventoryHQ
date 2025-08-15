import { Button, Card, Checkbox, Form, Select, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
    Attribute,
    ProductAttribute,
    Variation,
    AttributeValue,
    VariationAttribute,
} from '../types/EditProductTypes';
import { useContext } from 'react';
import { Context } from '../Context';
import { removeAttributeFromVariations } from './shared_functions';

export default function AttributeValuesField({
    name,
    attributes,
    remove,
    showVariationCheckbox = false,
    createNewAttributeValue,
}: {
    name: number;
    attributes: Attribute[];
    remove: (id: number) => void;
    showVariationCheckbox?: boolean;
    createNewAttributeValue: ({ id, value }: { id: number; value: string }) => Promise<void>;
}) {
    const { isVariable } = useContext(Context);
    const form = Form.useFormInstance();

    const currentAttribute: ProductAttribute = form.getFieldValue('attributes')[name];
    const availableValues =
        attributes.find((x) => x.id == currentAttribute.attributeId)?.values || [];
    const prevValues: AttributeValue[] = Form.useWatch(['attributes', name, 'values']);

    function addAttributeToVariations(id: number) {
        // Add to all variations with empty value
        const variations = form.getFieldValue('variations') || [];
        const attribute = attributes.find((a) => a.id === id)!;

        if (variations.length > 0) {
            const updatedVariations = variations.map((variation: Variation) => ({
                ...variation,
                attributes: [
                    ...(variation.attributes || []),
                    {
                        attributeName: attribute.name,
                        attributeId: attribute.id,
                        value: {},
                    },
                ],
            }));
            form.setFieldValue('variations', updatedVariations);
        }
    }

    function removeAttributeValuesFromVariations(attributeId: number, valueId: number) {
        const variations = form.getFieldValue('variations') || [];
        const updatedVariations = variations.map((variation: Variation) => ({
            ...variation,
            attributes: (variation.attributes || []).map((a: VariationAttribute) => {
                if (a.attributeId === attributeId && a.value.id === valueId) {
                    return { ...a, value: {} };
                }
                return a;
            }),
        }));
        form.setFieldValue('variations', updatedVariations);
    }

    return (
        <Card
            key={name}
            title={currentAttribute?.name || 'Attribute'}
            extra={
                <Tooltip title="Remove">
                    <Button
                        danger
                        type="text"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            if (isVariable)
                                removeAttributeFromVariations(currentAttribute.attributeId, form);
                            remove(name);
                        }}
                    />
                </Tooltip>
            }
            style={{ width: 300 }}
        >
            <Form.Item
                name={[name, 'values']}
                label="Values"
                rules={[{ required: true, message: 'At least one value is required.' }]}
                getValueFromEvent={(values: (number | string)[]) => {
                    if (values.length == 0) {
                        if (isVariable)
                            removeAttributeValuesFromVariations(
                                currentAttribute.attributeId,
                                prevValues[0].id
                            );
                        return [];
                    }
                    // find out which value was added/removed
                    const added = values.find((v) => !prevValues.find((a) => a.id == v));
                    const removed = prevValues.find((a) => !values.find((v) => v == a.id));

                    if (removed) {
                        if (isVariable)
                            removeAttributeValuesFromVariations(
                                currentAttribute.attributeId,
                                removed.id
                            );

                        return prevValues.filter((a: AttributeValue) => a.id != removed.id);
                    }

                    const attribute = attributes.find(
                        (a) => a.id == currentAttribute?.attributeId
                    )!;

                    if (added) {
                        if (typeof added === 'string') {
                            createNewAttributeValue({ id: attribute.id, value: added });
                            return [
                                ...prevValues,
                                {
                                    value: added,
                                },
                            ];
                        }

                        return [
                            ...prevValues,
                            {
                                id: added,
                                value: attribute.values.find((v) => v.id == added)?.value,
                            },
                        ];
                    }
                }}
                getValueProps={(value) => {
                    return {
                        value: value.map((v: AttributeValue) => v.id),
                    };
                }}
            >
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="label"
                    options={availableValues}
                    fieldNames={{
                        label: 'value',
                        value: 'id',
                    }}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item name={[name, 'isVariational']} valuePropName="checked">
                    <Checkbox
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            const attributes = form.getFieldValue('attributes');
                            const attribute: ProductAttribute = attributes[name];

                            if (isChecked) {
                                addAttributeToVariations(attribute.attributeId);
                            } else {
                                removeAttributeFromVariations(attribute.attributeId, form);
                            }
                        }}
                    >
                        Used for variations
                    </Checkbox>
                </Form.Item>
            )}
        </Card>
    );
}
