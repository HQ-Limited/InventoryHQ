import { Form, FormItemProps, InputNumber } from 'antd';
import { LOCATIONS_ENABLED } from '../../../../global';

export const QuantityInputField = ({
    name,
    required = true,
    label = 'Quantity',
    layout = 'vertical',
    props,
    onChange,
}: {
    name: (number | string)[];
    required?: boolean;
    label?: string;
    layout?: 'vertical' | 'horizontal';
    props?: FormItemProps;
    onChange?: (value: number | null) => void;
}) => {
    return (
        <Form.Item
            {...props}
            label={label}
            name={[...name, 'quantity']}
            rules={[
                {
                    required: required,
                    message: 'Quantity is required.',
                },
            ]}
            layout={layout}
        >
            <InputNumber
                style={{ width: '100%' }}
                min={0}
                inputMode="decimal"
                controls={false}
                onChange={onChange}
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
    props,
    onChange,
}: {
    name: (number | string)[];
    quantity?: {
        layout?: 'vertical' | 'horizontal';
        label?: string;
    };
    props?: FormItemProps;
    onChange?: (value: number | null) => void;
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
                                onChange={onChange}
                            />
                        );
                    })
                }
            </Form.List>
        </>
    );
}
