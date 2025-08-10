import { Form, Checkbox } from 'antd';

export default function ManageQuantityCheckbox() {
    return (
        <Form.Item name="manageQuantity" valuePropName="checked">
            <Checkbox>Manage quantity</Checkbox>
        </Form.Item>
    );
}
