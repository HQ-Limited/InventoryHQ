import { Form, FormItemProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default function DescriptionField({
    name = ['description'],
    label = 'Description',
    rows = 6,
    props,
}: {
    name?: (number | string)[];
    label?: string;
    rows?: number;
    props?: FormItemProps;
}) {
    return (
        <Form.Item label={label} name={[...name]} rules={[{ max: 1000 }]} {...props}>
            <TextArea rows={rows} />
        </Form.Item>
    );
}
