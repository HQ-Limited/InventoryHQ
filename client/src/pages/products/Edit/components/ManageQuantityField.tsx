import { Checkbox, CheckboxChangeEvent, Form } from 'antd';

export default function ManageQuantityField({ name = 0 }: { name?: number }) {
    return (
        <Form.Item name={[name, 'manage_quantity']} valuePropName="checked">
            <Checkbox>Manage quantity</Checkbox>
        </Form.Item>
    );
}
