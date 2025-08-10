import { Form, Input } from 'antd';

export default function BarcodeField({
    name = ['variations', 0],
    label = 'Barcode',
}: {
    name?: (number | string)[];
    label?: string;
}) {
    return (
        <Form.Item label={label} name={[...name, 'barcode']} rules={[{ max: 50 }]}>
            <Input />
        </Form.Item>
    );
}
