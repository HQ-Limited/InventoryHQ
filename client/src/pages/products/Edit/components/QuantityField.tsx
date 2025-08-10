import { Form, InputNumber } from 'antd';
import { LOCATIONS_ENABLED } from '../../../../global';
import LocationField from './LocationField';
import { Context } from '../Context';
import { useContext } from 'react';

export const QuantityInputField = ({
    name,
    label = 'Quantity',
    layout = 'vertical',
}: {
    name: (number | string)[];
    label?: string;
    layout?: 'vertical' | 'horizontal';
}) => {
    return (
        <Form.Item
            label={label}
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
            layout={layout}
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
};

export default function QuantityField({
    name,
    quantity,
    showLocationLabel,
    locationRequired = true,
}: {
    name: (number | string)[];
    showLocationLabel?: boolean;
    quantity?: {
        layout?: 'vertical' | 'horizontal';
        label?: string;
    };
    locationRequired?: boolean;
}) {
    const form = Form.useFormInstance();
    const manageQuantity = Form.useWatch('manageQuantity');
    const { isVariable } = useContext(Context);

    return (
        <>
            {LOCATIONS_ENABLED && (
                <LocationField
                    name={name}
                    required={locationRequired}
                    showLabel={showLocationLabel}
                />
            )}
            {manageQuantity && (
                <Form.List name={[...name, 'inventoryUnits']}>
                    {(fields) =>
                        fields.map((field) => {
                            const inventoryUnit = form.getFieldValue([
                                ...(isVariable ? ['variations'] : []),
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
                                />
                            );
                        })
                    }
                </Form.List>
            )}
        </>
    );
}
