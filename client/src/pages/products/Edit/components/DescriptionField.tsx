import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default function DescriptionField() {
    return (
        <Form.Item label="Description" name="description" rules={[{ max: 1000 }]}>
            <TextArea rows={6} />
        </Form.Item>
    );
}
