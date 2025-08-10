import { Form, Input } from 'antd';

export default function UnitOfMeasureField({
    name = [],
    label = 'Unit of Measure',
    style,
}: {
    name?: (string | number)[];
    label?: string;
    style?: React.CSSProperties;
}) {
    return (
        <Form.Item
            label={label}
            rules={[{ max: 10 }]}
            name={[...name, 'unitOfMeasure']}
            style={style}
        >
            <Input placeholder="example: pcs, kg, m, etc." />
        </Form.Item>
    );
}
