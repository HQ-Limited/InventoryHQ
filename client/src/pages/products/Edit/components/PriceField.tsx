import { Form, InputNumber } from 'antd';

export default function PriceField({
    fieldName = ['variations', 0, 'retailPrice'],
    label = 'Price',
}: {
    fieldName?: string | (string | number)[];
    label?: string;
}) {
    return (
        <Form.Item
            label={label}
            name={fieldName}
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
