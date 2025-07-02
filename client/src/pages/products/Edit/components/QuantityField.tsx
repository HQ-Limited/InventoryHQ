import { Checkbox, Form, InputNumber } from 'antd';

export default function QuantityField({
    name = ['variations', 0],
    variation = false,
}: {
    name?: (number | string)[];
    variation?: boolean;
}) {
    const manageQuantity = Form.useWatch(
        variation ? ['variations', ...name, 'manageQuantity'] : [...name, 'manageQuantity']
    );

    return (
        <>
            <Form.Item name={[...name, 'manageQuantity']} valuePropName="checked">
                <Checkbox>Manage quantity</Checkbox>
            </Form.Item>
            {manageQuantity && (
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
