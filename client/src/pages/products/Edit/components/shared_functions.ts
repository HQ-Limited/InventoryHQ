import { FormInstance } from 'antd';
import { InventoryUnit, Location, Variation, VariationAttribute } from '../types/EditProductTypes';
import { LOCATIONS_ENABLED } from '../../../../global';

export function removeAttributeFromVariations(id: number, form: FormInstance) {
    const variations = form.getFieldValue('variations') || [];
    if (variations.length === 0) return;

    const updatedVariations = variations.map((variation: Variation) => {
        const attrs = (variation.attributes || []).filter(
            (a: VariationAttribute) => a.attributeId !== id
        );
        return { ...variation, attributes: attrs };
    });
    form.setFieldValue('variations', updatedVariations);
}

export function generateEmptyInventoryUnits(locations: Location[]): Partial<InventoryUnit>[] {
    if (!LOCATIONS_ENABLED) {
        return [
            {
                location: locations[0],
                quantity: 0,
            },
        ];
    }

    return locations.map((l) => ({
        location: l,
        quantity: 0,
    }));
}
