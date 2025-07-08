import { Form, InputNumber, Select } from 'antd';
import { LOCATIONS_ENABLED } from '../../../../global';
import { InventoryUnit, Location } from '../../../../types/ProductTypes';

const QuantityInputField = ({
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

export default function QuantityField({
    name,
    locations,
}: {
    name: (number | string)[];
    locations?: Location[];
}) {
    const form = Form.useFormInstance();
    const manageQuantity = Form.useWatch('manageQuantity');
    const prevLocations = Form.useWatch([...name, 'inventoryUnits']);

    const isVariable = Form.useWatch('isVariable');

    return (
        <>
            {manageQuantity && (
                <>
                    {LOCATIONS_ENABLED && (
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
                                        !prevLocations.find(
                                            (inventoryUnit: InventoryUnit) =>
                                                inventoryUnit.location.id == v
                                        )
                                );

                                if (added) {
                                    return [
                                        ...prevLocations,
                                        {
                                            location: {
                                                id: added,
                                                name: locations!.find((l) => l.id == added)!.name,
                                            },
                                        },
                                    ];
                                }

                                const removed = prevLocations.find(
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
                            getValueProps={(variations) => {
                                return {
                                    value: variations?.map((l) => l.location.id),
                                };
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select at least one location!',
                                },
                            ]}
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
                    )}

                    <Form.List name={[...name, 'inventoryUnits']}>
                        {(fields) => {
                            if (LOCATIONS_ENABLED == false) {
                                return <QuantityInputField name={[...name]} />;
                            }

                            return fields.map((field) => {
                                const location = form.getFieldValue([
                                    ...(isVariable ? ['variations'] : []),
                                    ...name,
                                    'inventoryUnits',
                                    field.name,
                                    'location',
                                ]);
                                return (
                                    <QuantityInputField
                                        name={[field.name]}
                                        label={`${location.name} quantity`}
                                    />
                                );
                            });
                        }}
                    </Form.List>
                </>
            )}
        </>
    );
}
