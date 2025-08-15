import { Form, FormItemProps, InputNumber } from 'antd';

export default function MinStockField({
    name = ['variations', 0],
    label = 'Min. Stock',
    props,
}: {
    name?: (number | string)[];
    label?: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item
            {...props}
            label={label}
            name={[...name, 'minStock']}
            rules={[
                {
                    validator: (_, value) => {
                        if (value <= 0) {
                            return Promise.reject('Min. Stock must be greater than 0.');
                        }
                        return Promise.resolve();
                    },
                },
            ]}
        >
            <InputNumber
                style={{ width: '100%' }}
                precision={2}
                step={0.01}
                min={0.01}
                inputMode="decimal"
            />
        </Form.Item>
    );
}
