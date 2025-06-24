import { Button, Card, Checkbox, Form, Select, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ProductAttribute } from '../../../../types/ProductTypes';

export default function AttributeValuesField({
    name,
    attributes,
    onRemove,
    showVariationCheckbox = false,
}: {
    name: number;
    attributes: ProductAttribute[];
    onRemove: (id: number) => void;
    showVariationCheckbox?: boolean;
}) {
    const form = Form.useFormInstance();

    const currentAttribute: ProductAttribute = form.getFieldValue('attributes')[name];
    const availableValues = attributes.find((x) => x.id == currentAttribute?.id)?.values || [];

    return (
        <Card
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
            >
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="value"
                    options={availableValues}
                    // No value prop!
                    onChange={(selectedValues) => {
                        // Map selected string values back to the original objects
                        const selectedObjects = availableValues
                            .filter((av) => selectedValues.includes(av.value))
                            .map(({ id, value }) => ({ id, value }));
                        form.setFieldValue(['attributes', name, 'values'], selectedObjects);

                        // Remove values from all variations that are not in selectedValues
                        const attributeId = currentAttribute?.id;
                        const variations = form.getFieldValue('variations') || [];
                        const updatedVariations = variations.map((variation: any) => {
                            const attrs = (variation.attributes || []).map((attr: any) => {
                                if (
                                    attr.id === attributeId &&
                                    attr.value &&
                                    !selectedValues.includes(attr.value.value)
                                ) {
                                    return { ...attr, value: {} };
                                }
                                return attr;
                            });
                            return { ...variation, attributes: attrs };
                        });
                        form.setFieldValue('variations', updatedVariations);
                    }}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item name={[name, 'isVariational']} valuePropName="checked">
                    <Checkbox
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            const attributes = form.getFieldValue('attributes');
                            const attribute = attributes[name];
                            const variations = form.getFieldValue('variations') || [];
                            if (variations.length > 0) {
                                const updatedVariations = variations.map((variation: any) => {
                                    let attrs = variation.attributes || [];
                                    if (isChecked) {
                                        // Add attribute if not present
                                        if (!attrs.some((a: any) => a.id === attribute.id)) {
                                            attrs = [...attrs, { id: attribute.id, value: '' }];
                                        }
                                    } else {
                                        // Remove attribute if present
                                        attrs = attrs.filter((a: any) => a.id !== attribute.id);
                                    }
                                    return { ...variation, attributes: attrs };
                                });
                                form.setFieldValue('variations', updatedVariations);
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
