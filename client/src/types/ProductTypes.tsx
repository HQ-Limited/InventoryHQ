export type Package = {
    id: number;
    label?: string;
    price: number;
    location: Location;
    description?: string;
};

export type Location = {
    id: number;
    name: string;
    description?: string;
};

export type InventoryUnit = {
    id: number;
    quantity: number;
    package?: Package;
    location: Location;
};

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
    manageQuantity: boolean;
    categories: Category[];
    attributes: ProductAttribute[];
    variations: Variation[];
    isVariable: boolean;
};

export type Variation = {
    id: number;
    sku: string;
    retailPrice: number;
    wholesalePrice?: number;
    description?: string;
    attributes?: VariationAttribute[];
    inventoryUnits?: InventoryUnit[];
};

export type Category = {
    id: number;
    name: string;
    parentId?: number;
    parent?: Category;
    children?: Category[];
};
