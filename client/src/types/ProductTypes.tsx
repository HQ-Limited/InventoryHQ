export type ProductAttribute = {
    id: number; // id of attribute name
    name: string;
    values: {
        id: number;
        value: string;
    }[]; // id of attribute name + value (from attribute_values table)
    isVariational: boolean;
};

export type AttributeValue = {
    id: number;
    value: string;
};

export type VariationAttribute = {
    id: number; // id of attribute name
    name: string;
    value: AttributeValue; // id of attribute name + value (from attribute_values table)
};

export type Product = {
    id: number;
    name: string;
    description?: string;
    categories: Category[];
    attributes: ProductAttribute[];
    variations: Variation[];
    isVariable: boolean;
};

export type Variation = {
    id: number;
    retailPrice: number;
    wholesalePrice?: number;
    quantity: number;
    manageQuantity: boolean;
    sku: string;
    attributes: VariationAttribute[];
};

export type Category = {
    id: number;
    name: string;
    parentId?: number;
    parent?: Category;
    children?: Category[];
};
