import { Button, Card, Flex, Form, Select, Tooltip } from 'antd';
import PriceField from './PriceField';
import SKUField from './SKUField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../../global';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
import { InventoryUnit, Location, ProductAttribute } from '../../../../types/ProductTypes';

function SelectField({
    name,
    options,
    variationFieldName,
    attributeFieldName,
}: {
    name: number;
    options: DefaultOptionType[];
    variationFieldName: number;
    attributeFieldName: number;
}) {
    const form = Form.useFormInstance();

    return (
        <Form.Item
            name={[name, 'value']}
            label={form.getFieldValue([
                'variations',
                variationFieldName,
                'attributes',
                attributeFieldName,
                'name',
            ])}
            rules={[{ required: true, message: 'Select a value' }]}
        >
            <Select
                placeholder="Select value"
                optionFilterProp="value"
                options={options}
                onChange={(selectedValue) => {
                    const selectedObj = options.find((opt) => opt.value === selectedValue);
                    form.setFieldValue(
                        [
                            'variations',
                            variationFieldName,
                            'attributes',
                            attributeFieldName,
                            'value',
                        ],
                        selectedObj
                    );
                    form.validateFields([
                        [
                            'variations',
                            variationFieldName,
                            'attributes',
                            attributeFieldName,
                            'value',
                        ],
                    ]);
                }}
            />
        </Form.Item>
    );
}
export default function VariationsCards({ locations }: { locations: Location[] }) {
    const form = Form.useFormInstance();
    const attributes = Form.useWatch('attributes') || [];

    return (
        <Form.List
            name={['variations']}
            rules={[
                {
                    validator: (_, value) => {
                        if (!value || value.length === 0) {
                            return Promise.reject(new Error('At least one variation is required.'));
                        }
                        return Promise.resolve();
                    },
                },
            ]}
        >
            {(fields, { add, remove }) => (
                <>
                    <Flex style={{ paddingBottom: '20px' }} gap={10}>
                        {(() => {
                            let tooltipTitle: string | undefined = undefined;
                            if (attributes.length === 0) {
                                tooltipTitle = 'Add an attribute first';
                            } else if (!attributes.find((a) => a.isVariational === true)) {
                                tooltipTitle = 'Select at least one attribute as variational';
                            } else if (
                                !attributes.find(
                                    (a) => a.values?.length > 0 && a.isVariational === true
                                )
                            ) {
                                tooltipTitle =
                                    'Select at least one value for variational attribute';
                            }

                            const isDisabled =
                                !attributes.length ||
                                !attributes.find((a) => a.isVariational === true) ||
                                !attributes.find(
                                    (a) => a.values?.length > 0 && a.isVariational === true
                                );

                            if (tooltipTitle) {
                                return (
                                    <Tooltip color="red" title={tooltipTitle}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            disabled={isDisabled}
                                        >
                                            Add Variation
                                        </Button>
                                    </Tooltip>
                                );
                            }
                            return (
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        add({
                                            attributes: attributes
                                                .filter((a) => a.isVariational)
                                                .map((a: ProductAttribute) => ({
                                                    id: a.id,
                                                    name: a.name,
                                                    value: {},
                                                })),
                                        })
                                    }
                                    icon={<PlusOutlined />}
                                    disabled={isDisabled}
                                >
                                    Add Variation
                                </Button>
                            );
                        })()}
                    </Flex>
                    <Flex gap={20} wrap="wrap">
                        {fields.map((field, variationKey) => (
                            <Card
                                key={field.key}
                                title={`Variation ${variationKey + 1}`}
                                extra={
                                    <Tooltip title="Remove variation" color="red">
                                        <Button
                                            type="text"
                                            danger
                                            icon={<CloseOutlined />}
                                            onClick={() => remove(field.name)}
                                        />
                                    </Tooltip>
                                }
                            >
                                <Form.List name={[field.name, 'attributes']}>
                                    {(fields) => (
                                        <>
                                            {fields.map((attrField, attrKey) => {
                                                const variationAttribute = form.getFieldValue([
                                                    'variations',
                                                    field.name,
                                                    'attributes',
                                                    attrField.name,
                                                ]);
                                                const globalAttribute = attributes.find(
                                                    (a) => a.id === variationAttribute?.id
                                                );

                                                return (
                                                    <SelectField
                                                        key={attrKey}
                                                        name={attrField.name}
                                                        options={globalAttribute?.values || []}
                                                        variationFieldName={field.name}
                                                        attributeFieldName={attrField.name}
                                                    />
                                                );
                                            })}
                                        </>
                                    )}
                                </Form.List>
                                <SKUField name={[field.name]} />
                                <PriceField name={[field.name, 'retailPrice']} />
                                {WHOLESALE_ENABLED && (
                                    <PriceField
                                        name={[field.name, 'wholesalePrice']}
                                        label="Wholesale Price"
                                    />
                                )}
                                {/* <Form.Item
                                    label="Locations"
                                    name={[field.name, 'inventoryUnits']}
                                    getValueFromEvent={(values: (number | string)[]) => {
                                        const prevLocations = form.getFieldValue([
                                            'variations',
                                            field.name,
                                            'inventoryUnits',
                                        ]);
                                        console.log({ prevLocations });
                                        if (values.length == 0) {
                                            return [];
                                        }
                                        // find out which value was added/removed
                                        const added = values.find(
                                            (v) =>
                                                !prevLocations?.find(
                                                    (inventoryUnit: InventoryUnit) =>
                                                        inventoryUnit.location.id == v
                                                )
                                        );

                                        if (added) {
                                            return [
                                                ...(prevLocations || []),
                                                {
                                                    location: {
                                                        id: added,
                                                        name: locations!.find((l) => l.id == added)!
                                                            .name,
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
                                                (a: InventoryUnit) =>
                                                    a.location.id != removed.location.id
                                            );
                                        }

                                        return prevLocations;
                                    }}
                                    getValueProps={(inventoryUnits) => {
                                        console.log({ inventoryUnits });
                                        return {
                                            value: inventoryUnits?.map(
                                                (l: InventoryUnit) => l.location.id
                                            ),
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
                                </Form.Item> */}
                                <QuantityField name={[field.name]} locations={locations} />
                            </Card>
                        ))}
                    </Flex>
                </>
            )}
        </Form.List>
    );
}
