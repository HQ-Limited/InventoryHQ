export type ProductAttribute = {
    id: number; // id of attribute name
    name: string;
    values: {
        id: number;
        value: string;
    }[]; // id of attribute name + value (from attribute_values table)
    isVariational: boolean;

    // Used in Forms to bind data correctly
    selectedAttributes?: number[];
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

    // Used in forms to bind data correctly
    selectedCategories?: number[];
    selectedAttributes?: number[];
};

export type Variation = {
    id: number;
    retailPrice: number;
    wholesalePrice?: number;
    quantity: number;
    manage_quantity: boolean;
    sku: string;
    attributes: VariationAttribute[];
};

export type Category = {
    id: number;
    name: string;
    parent?: Category;
};

export type CategoriesTree = {
    // Used in Forms Select elements
    value: number;
    title: string;
    children: CategoriesTree[];
};
