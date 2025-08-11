import { Form, FormItemProps, Select } from 'antd';
import { useContext } from 'react';
import { InventoryUnit } from '../../../../types/ProductTypes';
import { Context } from '../Context';

export default function LocationField({
    name,
    required = false,
    label = 'Locations',
    showLabel = true,
    props,
}: {
    name: (number | string)[];
    required?: boolean;
    label?: string;
    showLabel?: boolean;
    props?: FormItemProps;
}) {
    const { locations, isVariable } = useContext(Context);

    const prevLocations = Form.useWatch([
        ...(isVariable ? ['variations'] : []),
        ...name,
        'inventoryUnits',
    ]);

    return (
        <Form.Item
            {...props}
            label={showLabel ? label : undefined}
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
            rules={required ? [{ required: true, message: 'Location/s is required.' }] : []}
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
}
