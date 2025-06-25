import { Button, Card, Checkbox, Form, Select, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ProductAttribute, VariationAttribute } from '../../../../types/ProductTypes';

export default function AttributeValuesField({
    name,
    attributes,
    onRemove,
    showVariationCheckbox = false,
    removeAttributeFromVariations,
    addAttributeToVariations,
    createNewAttributeValue,
}: {
    name: number;
    attributes: ProductAttribute[];
    onRemove: (id: number) => void;
    showVariationCheckbox?: boolean;
    removeAttributeFromVariations: (id: number) => void;
    addAttributeToVariations: (id: number) => void;
    createNewAttributeValue: ({ id, value }: { id: number; value: string }) => Promise<void>;
}) {
    const form = Form.useFormInstance();

    const currentAttribute: ProductAttribute = form.getFieldValue('attributes')[name];
    const availableValues = attributes.find((x) => x.id == currentAttribute?.id)?.values || [];
    const prevValues = Form.useWatch(['attributes', name, 'values']);

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
                            // Remove attribute from all variations
                            const variations = form.getFieldValue('variations') || [];
                            if (variations.length > 0) {
                                const updatedVariations = variations.map((variation: any) => {
                                    const attrs = (variation.attributes || []).filter(
                                        (a: any) => a.id !== currentAttribute?.id
                                    );
                                    return { ...variation, attributes: attrs };
                                });
                                form.setFieldValue('variations', updatedVariations);
                            }
                            onRemove(name);
                        }}
                    />
                </Tooltip>
            }
            style={{ width: 300 }}
        >
            <Form.Item
                name={[name, 'values']}
                label="Values"
                rules={[{ required: true, message: 'Please select at least one value' }]}
                getValueFromEvent={(values: (number | string)[]) => {
                    if (values.length == 0) {
                        return [];
                    }
                    // find out which value was added/removed
                    const added = values.find((v) => !prevValues.find((a) => a.id == v));
                    const removed = prevValues.find((a) => !values.find((v) => v == a.id));

                    if (removed) {
                        return prevValues.filter((a: VariationAttribute) => a.id != removed.id);
                    }

                    const attribute = attributes.find((a) => a.id == currentAttribute?.id)!;

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
                        value: value.map((v: { id: number; value: string }) => v.id),
                    };
                }}
            >
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="label"
                    options={availableValues.map((v) => ({
                        label: v.value,
                        value: v.id,
                    }))}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item name={[name, 'isVariational']} valuePropName="checked">
                    <Checkbox
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            const attributes = form.getFieldValue('attributes');
                            const attribute = attributes[name];

                            if (isChecked) {
                                addAttributeToVariations(attribute.id);
                            } else {
                                removeAttributeFromVariations(attribute.id);
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
