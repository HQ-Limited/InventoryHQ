import { FormInstance } from 'antd';
import { Variation, VariationAttribute } from '../types/EditProductTypes';

export function removeAttributeFromVariations(id: number, form: FormInstance) {
    const variations = form.getFieldValue('variations') || [];
    if (variations.length === 0) return;

    console.log(id);
    const updatedVariations = variations.map((variation: Variation) => {
        const attrs = (variation.attributes || []).filter(
            (a: VariationAttribute) => a.attributeId !== id
        );
        return { ...variation, attributes: attrs };
    });
    form.setFieldValue('variations', updatedVariations);
}
