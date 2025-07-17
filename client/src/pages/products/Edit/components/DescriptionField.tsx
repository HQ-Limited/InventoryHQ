import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default function DescriptionField({
    name = ['description'],
    label = 'Description',
}: {
    name?: (number | string)[];
    label?: string;
}) {
    return (
        <Form.Item label={label} name={[...name]} rules={[{ max: 1000 }]}>
            <TextArea rows={6} />
        </Form.Item>
    );
}
