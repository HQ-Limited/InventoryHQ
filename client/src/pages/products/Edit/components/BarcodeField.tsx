import { Form, FormItemProps, Input } from 'antd';

export default function BarcodeField({
    props,
    name = ['variations', 0],
    label = 'Barcode',
}: {
    name?: (number | string)[];
    label?: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item label={label} name={[...name, 'barcode']} rules={[{ max: 50 }]} {...props}>
            <Input />
        </Form.Item>
    );
}
