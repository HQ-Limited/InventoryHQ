import { Form, FormItemProps, Input } from 'antd';

export default function LotNumberField({
    name = ['lotNumber'],
    label = 'Lot Number',
    props,
}: {
    name?: (number | string)[];
    label?: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item label={label} name={[...name]} rules={[{ max: 100 }]} {...props}>
            <Input />
        </Form.Item>
    );
}
