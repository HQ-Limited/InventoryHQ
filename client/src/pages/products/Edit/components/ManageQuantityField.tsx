import { Checkbox, CheckboxChangeEvent, Form } from 'antd';

export default function ManageQuantityField({
    onChange,
    name = 0,
}: {
    onChange?: (e: CheckboxChangeEvent) => void;
    name?: number;
}) {
    return (
        <Form.Item name={[name, 'manage_quantity']} valuePropName="checked">
            <Checkbox onChange={onChange}>Manage quantity</Checkbox>
        </Form.Item>
    );
}
