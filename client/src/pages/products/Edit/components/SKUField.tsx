import { Form, Input } from 'antd';

export default function SKUField({ name = 0 }: { name?: number }) {
    return (
        <Form.Item
            label="SKU"
            rules={[{ required: true, message: 'Please enter the SKU!' }, { max: 100 }]}
            name={[name, 'sku']}
        >
            <Input />
        </Form.Item>
    );
}
