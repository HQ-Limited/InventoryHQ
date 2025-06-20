// Used in Forms

export type ProductAttributeDB = {
    id: number; // id of attribute name
    values: number[]; // id of attribute name + value (from attribute_values table)
    isVariational?: boolean;
};

export type VariationAttributeTypeDB = {
    id: number; // id of attribute name
    value: number; // id of attribute name + value (from attribute_values table)
};

export type SimpleProductTypeDB = {
    id: number;
    name: string;
    description?: string;
    price: number;
    wholesalePrice?: number;
    quantity: number;
    manage_quantity: boolean;
    sku: string;
    categories: number[];
    attributes: ProductAttributeDB[];
    selectedAttributes?: number[]; // All selected attributes ids (used to bind AttributesField)
};

export type VariableProductTypeDB = {
    id: number;
    name: string;
    description?: string;
    categories: number[];
    attributes: ProductAttributeDB[];
    variations: VariationDB[];
    selectedAttributes?: number[]; // All selected attributes ids (used to bind AttributesField)
};

export type VariationDB = {
    id: number;
    price: number;
    wholesalePrice?: number;
    quantity: number;
    manage_quantity: boolean;
    sku: string;
    attributes: VariationAttributeTypeDB[];
};

export type CategoryDB = {
    id: number;
    name: string;
    parent?: number;
};

export type CategoriesTree = {
    value: number;
    title: string;
    children: CategoriesTree[];
};

export type AttributeDB = {
    id: number; // id of attribute name
    name: string;
    values?: {
        id: number; // id of attribute name + value (from attribute_values table)
        value: string;
    }[];
};
