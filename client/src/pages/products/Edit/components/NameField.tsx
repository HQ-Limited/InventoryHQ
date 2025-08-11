import { Form, Input } from 'antd';

export default function NameField() {
    return (
        <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Product name is required.' }, { max: 100 }]}
        >
            <Input />
        </Form.Item>
    );
}
