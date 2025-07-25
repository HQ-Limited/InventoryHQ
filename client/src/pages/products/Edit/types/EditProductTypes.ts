export type Product = {
    id: number;
    name: string;
    description?: string;
    isVariable: boolean;
    manageQuantity: boolean;
    attributes?: ProductAttribute[];
    categories?: Category[];
    variations: Variation[];
    packages?: Package[];
};

export type Category = {
    id: number;
    name: string;
    parentId?: number;
    children?: Category[];
};

export type Variation = {
    id: number;
    sku: string;
    retailPrice: number;
    description?: string;
    attributes?: VariationAttribute[];
    inventoryUnits?: InventoryUnit[];
};

export type VariationAttribute = {
    id: number;
    attributeName: string;
    attributeId: number;
    value: AttributeValue;
};

export type Attribute = {
    id: number;
    name: string;
    values: AttributeValue[];
};

export type ProductAttribute = {
    id: number;
    attributeId: number;
    name: string;
    values: AttributeValue[];
    isVariational?: boolean;
};

export type AttributeValue = {
    id: number;
    value: string;
};

export type InventoryUnit = {
    id: number;
    quantity: number;
    variation: Variation;
    package?: Package;
    location: Location;
};

export type Package = {
    id: number;
    label?: string;
    price: number;
    description?: string;
    location: Location;
    inventoryUnits: InventoryUnit[];
};

export type Location = {
    id: number;
    name: string;
    description?: string;
};
