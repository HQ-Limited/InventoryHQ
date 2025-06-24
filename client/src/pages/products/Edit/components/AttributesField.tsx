import { Form, message, Select } from 'antd';
import { StoreValue } from 'antd/es/form/interface';
import { ProductAttribute } from '../../../../types/ProductTypes';
import attributeService from '../../../../services/attributeService';

export default function AttributesField({
    attributes,
    onAdd,
    fetchValues,
    required = false,
}: {
    attributes: ProductAttribute[];
    onAdd: (defaultValue?: StoreValue) => void;
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
                            });
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
                }}
                options={attributes.map((v) => ({
                    label: v.name!,
                    value: v.id!,
                }))}
            />
        </Form.Item>
    );
}
