import { Form, InputNumber, Select } from 'antd';
import { LOCATIONS_ENABLED } from '../../../../global';
import { InventoryUnit, Location } from '../../../../types/ProductTypes';

export const QuantityInputField = ({
    name,
    label = 'Quantity',
}: {
    name: (number | string)[];
    label?: string;
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
}: {
    name: (number | string)[];
    locations: Location[];
    isVariable: boolean;
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
        >
            <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Select location/s"
                optionFilterProp="label"
                options={locations!.map((location) => ({
                    label: location.name,
                    value: location.id,
                }))}
            />
        </Form.Item>
    );
};

export default function QuantityField({
    name,
    locations,
}: {
    name: (number | string)[];
    locations?: Location[];
}) {
    const form = Form.useFormInstance();
    const manageQuantity = Form.useWatch('manageQuantity');
    const isVariable = Form.useWatch('isVariable');

    return (
        <>
            {manageQuantity && (
                <>
                    {LOCATIONS_ENABLED && (
                        <LocationField name={name} locations={locations!} isVariable={isVariable} />
                    )}
                    <Form.List name={[...name, 'inventoryUnits']}>
                        {(fields) =>
                            fields.map((field) => {
                                const inventoryUnit = form.getFieldValue([
                                    ...(isVariable ? ['variations'] : []),
                                    ...name,
                                    'inventoryUnits',
                                    field.name,
                                ]);

                                const location = inventoryUnit.location;

                                if (inventoryUnit.package) return;

                                return (
                                    <QuantityInputField
                                        key={field.key}
                                        name={[field.name]}
                                        label={
                                            LOCATIONS_ENABLED
                                                ? `${location.name} quantity`
                                                : undefined
                                        }
                                    />
                                );
                            })
                        }
                    </Form.List>
                </>
            )}
        </>
    );
}
