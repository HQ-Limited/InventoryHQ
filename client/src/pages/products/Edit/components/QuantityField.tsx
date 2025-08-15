import { Form, FormItemProps, InputNumber } from 'antd';
import { LOCATIONS_ENABLED } from '../../../../global';

export const QuantityInputField = ({
    name,
    label = 'Quantity',
    layout = 'vertical',
    props,
}: {
    name: (number | string)[];
    label?: string;
    layout?: 'vertical' | 'horizontal';
    props?: FormItemProps;
}) => {
    return (
        <Form.Item
            {...props}
            label={label}
            name={[...name, 'quantity']}
            rules={[
                {
                    required: true,
                    message: 'Quantity is required.',
                },
            ]}
            layout={layout}
        >
            <InputNumber style={{ width: '100%' }} min={0} inputMode="decimal" />
        </Form.Item>
    );
};

export default function QuantityField({
    name,
    quantity,
    props,
}: {
    name: (number | string)[];
    quantity?: {
        layout?: 'vertical' | 'horizontal';
        label?: string;
    };
    props?: FormItemProps;
}) {
    const form = Form.useFormInstance();

    return (
        <>
            <Form.List name={[...name, 'inventoryUnits']}>
                {(fields) =>
                    fields.map((field) => {
                        const inventoryUnit = form.getFieldValue([
                            ...(name.includes('variations') ? [] : ['variations']),
                            ...name,
                            'inventoryUnits',
                            field.name,
                        ]);

                        if (inventoryUnit.package) return;

                        return (
                            <QuantityInputField
                                key={field.key}
                                name={[field.name]}
                                label={
                                    quantity?.label !== undefined
                                        ? quantity.label
                                        : LOCATIONS_ENABLED
                                          ? `${inventoryUnit.location.name}`
                                          : 'Quantity'
                                }
                                layout={quantity?.layout}
                                props={props}
                            />
                        );
                    })
                }
            </Form.List>
        </>
    );
}
