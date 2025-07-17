import { Form, Input } from 'antd';

export default function SKUField({
    name = ['variations', 0],
    label = 'SKU',
}: {
    name?: (string | number)[];
    label?: string;
}) {
    return (
        <Form.Item
            label={label}
            rules={[{ required: true, message: 'Please enter the SKU!' }, { max: 100 }]}
            name={[...name, 'sku']}
        >
            <Input />
        </Form.Item>
    );
}
