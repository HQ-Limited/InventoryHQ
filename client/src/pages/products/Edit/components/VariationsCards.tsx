import { Button, Card, Flex, Form, Select, Tooltip } from 'antd';
import PriceField from './PriceField';
import SKUField from './SKUField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../../global';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
import { Location, ProductAttribute } from '../types/EditProductTypes';

function SelectField({
    name,
    options,
    attributeName,
}: {
    name: number;
    options: DefaultOptionType[];
    attributeName: string;
}) {
    return (
        <Form.Item
            name={[name, 'value']}
            label={attributeName}
            rules={[{ required: true, message: 'Select a value' }]}
        >
            <Select placeholder="Select value" optionFilterProp="label" options={options} />
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
                            } else if (
                                !attributes.find((a: ProductAttribute) => a.isVariational === true)
                            ) {
                                tooltipTitle = 'Select at least one attribute as variational';
                            } else if (
                                !attributes.find(
                                    (a: ProductAttribute) =>
                                        a.values?.length > 0 && a.isVariational === true
                                )
                            ) {
                                tooltipTitle =
                                    'Select at least one value for variational attribute';
                            }

                            const isDisabled =
                                !attributes.length ||
                                !attributes.find(
                                    (a: ProductAttribute) => a.isVariational === true
                                ) ||
                                !attributes.find(
                                    (a: ProductAttribute) =>
                                        a.values?.length > 0 && a.isVariational === true
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
                                                .filter((a: ProductAttribute) => a.isVariational)
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
                                                const options = attributes.find(
                                                    (a: ProductAttribute) =>
                                                        a.id === variationAttribute.attributeId
                                                )?.values;

                                                return (
                                                    <SelectField
                                                        key={attrKey}
                                                        name={attrField.name}
                                                        options={options || []}
                                                        attributeName={
                                                            variationAttribute.attributeName
                                                        }
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
                                <QuantityField name={[field.name]} locations={locations} />
                            </Card>
                        ))}
                    </Flex>
                </>
            )}
        </Form.List>
    );
}
