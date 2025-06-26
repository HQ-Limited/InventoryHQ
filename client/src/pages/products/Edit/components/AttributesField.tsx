import { Form, Select } from 'antd';
import { ProductAttribute } from '../../../../types/ProductTypes';

export default function AttributesField({
    attributes,
    fetchValues,
    required = false,
    removeAttributeFromVariations,
    createNewAttribute,
}: {
    attributes: ProductAttribute[];
    removeAttributeFromVariations: (id: number) => void;
    fetchValues: (id: number) => void;
    required?: boolean;
    createNewAttribute: (name: string) => Promise<void>;
}) {
    const prevAttributes = Form.useWatch('attributes');

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
                    const added = values.find((v) => !prevAttributes.find((a) => a.id == v));
                    const removed = prevAttributes.find((a) => !values.find((v) => v == a.id));

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
                                id: attribute.id,
                                name: attribute.name,
                                values: [],
                                isVariational: false,
                            },
                        ];
                    }
                }}
                getValueProps={(value) => {
                    return {
                        value: value.map((v: ProductAttribute) => v.id),
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
