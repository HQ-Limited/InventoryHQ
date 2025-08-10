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

const LocationField = ({
    name,
    locations,
    isVariable,
    required = false,
}: {
    name: (number | string)[];
    locations: Location[];
    isVariable: boolean;
    required?: boolean;
}) => {
    const prevLocations = Form.useWatch([
        ...(isVariable ? ['variations'] : []),
        ...name,
        'inventoryUnits',
    ]);

    return (
        <Form.Item
            label="Locations"
            name={[...name, 'inventoryUnits']}
            getValueFromEvent={(values: (number | string)[]) => {
                if (values.length == 0) {
                    return [];
                }
                // find out which value was added/removed
                const added = values.find(
                    (v) =>
                        !prevLocations?.find(
                            (inventoryUnit: InventoryUnit) => inventoryUnit.location.id == v
                        )
                );

                if (added) {
                    return [
                        ...(prevLocations || []),
                        {
                            location: {
                                id: added,
                                name: locations!.find((l) => l.id == added)!.name,
                            },
                        },
                    ];
                }

                const removed = prevLocations?.find(
                    (inventoryUnit: InventoryUnit) =>
                        !values.find((v) => v == inventoryUnit.location.id)
                );

                if (removed) {
                    return prevLocations.filter(
                        (a: InventoryUnit) => a.location.id != removed.location.id
                    );
                }

                return prevLocations;
            }}
            getValueProps={(inventoryUnits: InventoryUnit[]) => {
                return {
                    value: inventoryUnits
                        ?.filter((l: InventoryUnit) => !l.package)
                        .map((l: InventoryUnit) => l.location.id),
                };
            }}
            rules={required ? [{ required: true, message: 'Please select location/s' }] : []}
        >
            <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Select location/s"
                optionFilterProp="label"
                fieldNames={{ label: 'name', value: 'id' }}
                options={locations}
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
