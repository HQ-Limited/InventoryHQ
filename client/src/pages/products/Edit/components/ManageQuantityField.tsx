import { Checkbox, CheckboxChangeEvent, Form } from 'antd';

export default function ManageQuantityField({
    onChange,
    fieldName = ['variations', 0, 'manage_quantity'],
}: {
    onChange?: (e: CheckboxChangeEvent) => void;
    fieldName?: string | (string | number)[];
}) {
    return (
        <Form.Item name={fieldName} valuePropName="checked">
            <Checkbox onChange={onChange}>Manage quantity</Checkbox>
        </Form.Item>
    );
}
