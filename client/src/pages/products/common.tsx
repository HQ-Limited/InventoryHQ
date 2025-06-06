// Used in Forms

type ProductAttributes = {
    id: number; // id of attribute name
    values?: number[]; // id of attribute name + value (from attribute_values table)
    isVariational?: boolean;
};

export type SimpleProductType = {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    wholesalePrice?: number;
    quantity?: number;
    manage_quantity: boolean;
    sku?: string;
    categories?: number[];
    attributes: ProductAttributes[];
};

export type VariableProductType = {
    id?: number;
    name?: string;
    description?: string;
    categories?: number[];
    attributes: ProductAttributes[];
    variations: Variation[];
};

export type Variation = {
    id?: number;
    price?: number;
    wholesalePrice?: number;
    quantity?: number;
    manage_quantity: boolean;
    sku?: string;
    attributes: ProductAttributes[];
};

export type Category = {
    id: number;
    name: string;
    parent?: number;
};

export type CategoriesTree = {
    value: number;
    title: string;
    children: CategoriesTree[];
};

export type Attribute = {
    id: number; // id of attribute name
    name: string;
    values?: {
        id: number; // id of attribute name + value (from attribute_values table)
        value: string;
    }[];
};
