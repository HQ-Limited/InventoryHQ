import { Form, Input } from 'antd';

export default function NameField() {
    return (
        <Form.Item
            label="Name"
            name="name"
            rules={[
                { required: true, message: 'Please enter the name of the product!' },
                { max: 100 },
            ]}
        >
            <Input />
        </Form.Item>
    );
}
