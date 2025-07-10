import { Button, Card, Flex, Form, Select, Tooltip } from 'antd';
import PriceField from './PriceField';
import SKUField from './SKUField';
import QuantityField from './QuantityField';
import { WHOLESALE_ENABLED } from '../../../../global';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
import {
    InventoryUnit,
    Location,
    Package,
    ProductAttribute,
    Variation,
} from '../../../../types/ProductTypes';

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
export default function PackagesCard({ locations }: { locations: Location[] }) {
    const form = Form.useFormInstance();

    // 1. Grab all variations
    // 2. Grab all inventoryUnits
    // 3. Find all inventoryunits that have the same package.id and add them to the array: filteredPackages
    // 4. Render the packages

    const variations: Variation[] = form.getFieldValue('variations') || [];

    const packages: {
        location?: Location;
        pack: Package;
        content: {
            variation: Variation;
            inventoryUnit: InventoryUnit;
        }[];
    }[] = [];

    variations.forEach((variation) => {
        const inventoryUnits = variation.inventoryUnits;

        if (!inventoryUnits) return;

        inventoryUnits.forEach((inventoryUnit) => {
            const pack = inventoryUnit.package;

            if (!pack) return;

            const foundPackage = packages.find((p) => p.pack.id == pack.id);

            if (!foundPackage) {
                packages.push({
                    location: inventoryUnit.location,
                    pack,
                    content: [
                        {
                            variation,
                            inventoryUnit,
                        },
                    ],
                });
            } else {
                foundPackage.content.push({
                    variation,
                    inventoryUnit,
                });
            }
        });
    });

    return packages.map((pack) => {
        return (
            <Card key={pack.pack.id} title={`Package #${pack.pack.id}`}>
                Location: {pack.location?.name}
                <br></br>
                Quantities:<br></br>
                {pack.content.map((content) => {
                    return (
                        <div>
                            Variation ID {content.variation.id}: {content.inventoryUnit.quantity}
                        </div>
                    );
                })}
                {/* <PriceField name={[field.name, 'retailPrice']} /> */}
            </Card>
        );
    });
}
