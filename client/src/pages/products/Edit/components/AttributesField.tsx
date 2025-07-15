import { Form, Select } from 'antd';
import { Attribute, ProductAttribute } from '../types/EditProductTypes';

export default function AttributesField({
    attributes,
    fetchValues,
    required = false,
    removeAttributeFromVariations,
    createNewAttribute,
}: {
    attributes: Attribute[];
    removeAttributeFromVariations: (id: number) => void;
    fetchValues: (id: number) => void;
    required?: boolean;
    createNewAttribute: (name: string) => Promise<void>;
}) {
    const prevAttributes: ProductAttribute[] = Form.useWatch('attributes');

    return (
        <>
            <Form.Item
                label="Attributes"
                name="attributes"
                rules={[
                    {
                        required,
                    },
                ]}
                getValueFromEvent={(values: (number | string)[]) => {
                    if (values.length == 0) {
                        return [];
                    }
                    // find out which value was added/removed
                    const added = values.find(
                        (v) => !prevAttributes.find((a) => a.attributeId == v)
                    );
                    const removed = prevAttributes.find(
                        (a) => !values.find((v) => v == a.attributeId)
                    );

                    if (removed) {
                        removeAttributeFromVariations(removed.id);
                        return prevAttributes.filter((a: ProductAttribute) => a.id != removed.id);
                    }

                    if (added) {
                        if (typeof added === 'string') {
                            createNewAttribute(added);
                            return [
                                ...prevAttributes,
                                {
                                    name: added,
                                    values: [],
                                    isVariational: false,
                                },
                            ];
                        }

                        const attribute = attributes.find((a) => a.id == added)!;

                        if (attribute.values.length === 0) fetchValues(attribute.id);

                        return [
                            ...prevAttributes,
                            {
                                attributeId: attribute.id,
                                name: attribute.name,
                                values: [],
                                isVariational: false,
                            },
                        ];
                    }
                }}
                getValueProps={(value) => {
                    return {
                        value: value.map((v: ProductAttribute) => v.attributeId),
                    };
                }}
            >
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    options={attributes.map((v) => ({
                        label: v.name!,
                        value: v.id!,
                    }))}
                />
            </Form.Item>
        </>
    );
}
