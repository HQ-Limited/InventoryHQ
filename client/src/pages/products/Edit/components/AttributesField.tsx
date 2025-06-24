import { Form, message, Select } from 'antd';
import { StoreValue } from 'antd/es/form/interface';
import { ProductAttribute } from '../../../../types/ProductTypes';
import attributeService from '../../../../services/attributeService';

export default function AttributesField({
    attributes,
    onAdd,
    onRemove,
    fetchValues,
    required = false,
}: {
    attributes: ProductAttribute[];
    onAdd: (defaultValue?: StoreValue) => void;
    onRemove: (index: number) => void;
    fetchValues: (id: number) => void;
    required?: boolean;
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const form = Form.useFormInstance();

    return (
        <Form.Item
            label="Attributes"
            rules={[
                {
                    required /* TODO: Add required validation, because it currently doesnt work since we dont have a "name" property on the Form.Item */,
                },
            ]}
        >
            <Select
                mode="tags"
                allowClear
                showSearch
                optionFilterProp="value"
                value={form.getFieldValue('attributes').map((a) => a.id)}
                onSelect={async (value: number | string) => {
                    if (typeof value == 'string') {
                        // Create attribute
                        try {
                            const id: number = await attributeService.createAttribute(value);

                            onAdd({
                                id: id,
                                name: value,
                                values: [],
                                isVariational: false,
                            });

                            // Add to all variations with empty value
                            const variations = form.getFieldValue('variations') || [];
                            const updatedVariations = variations.map((variation: any) => ({
                                ...variation,
                                attributes: [
                                    ...(variation.attributes || []),
                                    {
                                        id,
                                        name: value,
                                        value: {},
                                    },
                                ],
                            }));
                            form.setFieldValue('variations', updatedVariations);

                            return;
                        } catch (e) {
                            messageApi.error('Failed to create attribute');
                            return;
                        }
                    }

                    const attr = attributes.find((a) => a.id == value)!;
                    if (attr.values.length == 0) fetchValues(attr.id);

                    onAdd({
                        ...attr,
                        values: [],
                    });

                    // Add to all variations with empty value
                    const variations = form.getFieldValue('variations') || [];
                    const updatedVariations = variations.map((variation: any) => ({
                        ...variation,
                        attributes: [
                            ...(variation.attributes || []),
                            {
                                id: attr.id,
                                name: attr.name,
                                value: {},
                            },
                        ],
                    }));
                    form.setFieldValue('variations', updatedVariations);
                }}
                onDeselect={(value: number) => {
                    const index = form
                        .getFieldValue('attributes')
                        .findIndex((a: ProductAttribute) => a.id === value);
                    onRemove(index);

                    // Remove this attribute from all variations' attributes
                    const variations = form.getFieldValue('variations') || [];
                    const updatedVariations = variations.map((variation: any) => ({
                        ...variation,
                        attributes: (variation.attributes || []).filter(
                            (attr: any) => attr.id !== value
                        ),
                    }));
                    form.setFieldValue('variations', updatedVariations);

                    // If no attributes left, remove all variations
                    const remainingAttributes = form.getFieldValue('attributes') || [];
                    if (remainingAttributes.length === 0) {
                        form.setFieldValue('variations', []);
                    }
                }}
                onClear={() => {
                    form.setFieldValue('attributes', []);
                }}
                options={attributes.map((v) => ({
                    label: v.name!,
                    value: v.id!,
                }))}
            />
        </Form.Item>
    );
}
