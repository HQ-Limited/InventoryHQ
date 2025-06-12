import { Card, Form, Select } from 'antd';
import {
    Attribute,
    ProductAttributes,
    Variation,
    VariationAttributeType,
} from '../../../types/ProductTypes';
import PriceField from './PriceField';
import React from 'react';
import SKUField from './SKUField';
import ManageQuantityField from './ManageQuantityField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../global';

function SelectField({
    attribute,
    variationKey,
    attributeKey,
    onSelect,
}: {
    attribute: Attribute;
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
    attributes: Attribute[];
    selectedAttributes: ProductAttributes[];
    functions: {
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
        <Card title={`Variation ${variationKey + 1}`}>
            {selectedAttributes
                .filter((a) => a.isVariational === true)
                .map((attr, i) => {
                    const attribute = attributes.find((a) => a.id === attr.id)!;
                    return (
                        <React.Fragment key={i}>
                            <SelectField
                                variationKey={variationKey}
                                attribute={attribute}
                                attributeKey={i}
                                onSelect={functions.attribute.onSelect}
                            />
                        </React.Fragment>
                    );
                })}
            <SKUField fieldName={['variations', variationKey, 'sku']} />

            <PriceField fieldName={['variations', variationKey, 'price']} />

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
