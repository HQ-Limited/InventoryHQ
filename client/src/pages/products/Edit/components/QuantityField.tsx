import { Form, InputNumber } from 'antd';

export default function QuantityField({
    fieldName = 'quantity',
}: {
    fieldName?: string | (string | number)[];
}) {
    return (
        <Form.Item
            label="Quantity"
            name={fieldName}
            rules={[
                {
                    required: true,
                    message: 'Please enter quantity!',
                },
                {
                    validator: (_, value) => {
                        if (value <= 0) {
                            return Promise.reject('Quantity must be greater than 0!');
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
