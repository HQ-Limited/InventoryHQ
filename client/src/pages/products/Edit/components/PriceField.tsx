import { Form, InputNumber } from 'antd';

export default function PriceField({
    name = ['variations', 0, 'retailPrice'],
    label = 'Price',
}: {
    name?: (number | string)[];
    label?: string;
}) {
    return (
        <Form.Item
            label={label}
            name={[...name]}
            rules={[
                {
                    required: true,
                    message: 'Please enter the price!',
                },
                {
                    validator: (_, value) => {
                        if (value <= 0) {
                            return Promise.reject('Price must be greater than 0!');
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
