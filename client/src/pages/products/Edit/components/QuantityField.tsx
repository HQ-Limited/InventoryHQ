import { Checkbox, Form, InputNumber } from 'antd';

export default function QuantityField({
    name = ['variations', 0],
    variation = false,
}: {
    name?: (number | string)[];
    variation?: boolean;
}) {
    const { getFieldValue } = Form.useFormInstance();
    const manage_quantity = variation
        ? getFieldValue(['variations', ...name, 'manage_quantity'])
        : getFieldValue([...name, 'manage_quantity']);

    return (
        <>
            <Form.Item name={[...name, 'manage_quantity']} valuePropName="checked">
                <Checkbox>Manage quantity</Checkbox>
            </Form.Item>
            {manage_quantity && (
                <Form.Item
                    label="Quantity"
                    name={[...name, 'quantity']}
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
            )}
        </>
    );
}
