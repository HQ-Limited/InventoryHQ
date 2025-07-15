import { Form, Checkbox } from 'antd';

const ManageQuantityCheckbox = () => (
    <Form.Item name="manageQuantity" valuePropName="checked">
        <Checkbox>Manage quantity</Checkbox>
    </Form.Item>
);

export default ManageQuantityCheckbox;
