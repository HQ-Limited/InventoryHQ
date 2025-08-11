import { Form, FormItemProps, Input } from 'antd';

export default function SKUField({
    name = ['variations', 0],
    label = 'SKU',
    props,
}: {
    name?: (string | number)[];
    label?: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item label={label} rules={[{ max: 100 }]} name={[...name, 'sku']} {...props}>
            <Input />
        </Form.Item>
    );
}
