export type ProductAttributeType = {
    id: number; // id of attribute name
    name: string;
    values: {
        id: number;
        value: string;
    }[]; // id of attribute name + value (from attribute_values table)
    isVariational?: boolean;
};

export type VariationAttributeType = {
    id: number; // id of attribute name
    name: string;
    value: {
        id: number;
        value: string;
    }; // id of attribute name + value (from attribute_values table)
};

export type SimpleProductType = {
    id: number;
    name: string;
    description?: string;
    price: number;
    wholesalePrice?: number;
    quantity: number;
    manage_quantity: boolean;
    sku: string;
    categories: Category[];
    attributes: ProductAttributeType[];
};

export type Product = {
    id: number;
    name: string;
    description?: string;
    categories: Category[];
    attributes: ProductAttributeType[];
    variations: Variation[];
};

export type Variation = {
    id: number;
    price: number;
    wholesalePrice?: number;
    quantity: number;
    manage_quantity: boolean;
    sku: string;
    attributes: VariationAttributeType[];
};

export type Category = {
    id: number;
    name: string;
    parent?: Category;
};
