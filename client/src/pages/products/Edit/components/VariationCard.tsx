import { Button, Card, Form, Select, Tooltip } from 'antd';
import {
    AttributeDB,
    VariationDB,
    VariationAttributeTypeDB,
} from '../../../../types/ProductTypesDB';
import { ProductAttribute } from '../../../../types/ProductTypes';
import PriceField from './PriceField';
import React from 'react';
import SKUField from './SKUField';
import ManageQuantityField from './ManageQuantityField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../../global';
import { CloseOutlined } from '@ant-design/icons';

function SelectField({
    attribute,
    variationKey,
    attributeKey,
    onSelect,
}: {
    attribute: ProductAttribute;
    variationKey: number;
    attributeKey: number;
    onSelect: ({
        id,
        parent,
        variation,
    }: {
        id: number;
        parent: number;
        variation: number;
    }) => void;
}) {
    const options = attribute.values!.map((v) => ({
        label: v.value,
        value: v.id,
    }));

    return (
        <Form.Item
            label={attribute.name}
            name={['variations', variationKey, 'attributes', attributeKey, 'value']}
            rules={[{ required: true }]}
        >
            <Select
                allowClear
                placeholder="Select value"
                optionFilterProp="value"
                /* onSelect={(id: number) =>
                    onSelect({ id, parent: attribute.id, variation: variationKey })
                } */
                // onDeselect={(id: number) => onDeselect({ id, parent: parentId })}
                // onClear={() => onClear()}
                options={options}
            />
        </Form.Item>
    );
}

export default function VariationCard({
    manage_quantity,
    variationKey,
    attributes,
    selectedAttributes,
    functions,
}: {
    manage_quantity: boolean;
    variationKey: number;
    attributes: Partial<ProductAttribute>[];
    selectedAttributes: Partial<ProductAttribute>[];
    functions: {
        variation: {
            onVariationRemove: (variationKey: number) => void;
        };
        attribute: {
            onSelect: ({
                id,
                parent,
                variation,
            }: {
                id: number;
                parent: number;
                variation: number;
            }) => void;
        };
    };
}) {
    return (
        <Card
            title={`Variation ${variationKey + 1}`}
            extra={
                <Tooltip title="Remove variation" color="red">
                    <Button
                        type="text"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => functions.variation.onVariationRemove(variationKey)}
                    />
                </Tooltip>
            }
        >
            {selectedAttributes
                .filter((a) => a.isVariational === true)
                .map((attr, i) => {
                    const attribute = attributes.find((a) => a.id === attr.id)!;
                    return (
                        <React.Fragment key={i}>
                            <SelectField
                                variationKey={variationKey}
                                attribute={attribute as ProductAttribute}
                                attributeKey={i}
                                onSelect={functions.attribute.onSelect}
                            />
                        </React.Fragment>
                    );
                })}
            <SKUField fieldName={['variations', variationKey, 'sku']} />

            <PriceField fieldName={['variations', variationKey, 'retailPrice']} />

            {WHOLESALE_ENABLED && (
                <PriceField
                    fieldName={['variations', variationKey, 'wholesalePrice']}
                    label="Wholesale Price"
                />
            )}

            <ManageQuantityField fieldName={['variations', variationKey, 'manage_quantity']} />

            {manage_quantity && (
                <QuantityField fieldName={['variations', variationKey, 'quantity']} />
            )}
        </Card>
    );
}
