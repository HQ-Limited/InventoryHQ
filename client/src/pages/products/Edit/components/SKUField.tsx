import { Form, Input } from 'antd';

export default function SKUField({
    fieldName = 'sku',
}: {
    fieldName?: string | (string | number)[];
}) {
    return (
        <Form.Item
            label="SKU"
            name={fieldName}
            rules={[{ required: true, message: 'Please enter the SKU!' }, { max: 100 }]}
        >
            <Input />
        </Form.Item>
    );
}
