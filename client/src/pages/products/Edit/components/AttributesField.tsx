import { Form, Select } from 'antd';
import { Attribute, ProductAttribute } from '../types/EditProductTypes';
import { removeAttributeFromVariations } from './shared_functions';

export default function AttributesField({
    attributes,
    fetchValues,
    required = false,
    createNewAttribute,
}: {
    attributes: Attribute[];
    fetchValues: (id: number) => void;
    required?: boolean;
    createNewAttribute: (name: string) => Promise<void>;
}) {
    const prevAttributes: ProductAttribute[] = Form.useWatch('attributes');
    const form = Form.useFormInstance();

    return (
        <>
            <Form.Item
                label="Attributes"
                name="attributes"
                rules={[
                    {
                        required,
                        message: 'Select at least one attribute',
                    },
                ]}
                getValueFromEvent={(values: (number | string)[]) => {
                    if (values.length == 0) {
                        removeAttributeFromVariations(prevAttributes[0].attributeId, form);
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
                        removeAttributeFromVariations(removed.attributeId, form);
                        return prevAttributes.filter(
                            (a: ProductAttribute) => a.attributeId != removed.attributeId
                        );
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
                    options={attributes}
                    fieldNames={{
                        label: 'name',
                        value: 'id',
                    }}
                />
            </Form.Item>
        </>
    );
}
