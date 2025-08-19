export type Product = {
    id: number;
    name: string;
    description?: string;
    unitsOfMeasurement: UnitOfMeasurement[];
    isVariable: boolean;
    vat?: number;
    attributes?: ProductAttribute[];
    categories?: Category[];
    variations: Variation[];
    packages?: Package[];
};

export type UnitOfMeasurement = {
    id: number;
    name?: string;
    abbreviation: string;
    multiplier?: number;
    isDefault: boolean;
    isBase: boolean;
    barcode?: string;
};

export type Category = {
    id: number;
    name: string;
    parentId?: number;
    children?: Category[];
};

export type Variation = {
    id: number;
    sku?: string;
    retailPrice: number;
    minStock?: number;
    description?: string;
    attributes?: VariationAttribute[];
    inventoryUnits: InventoryUnit[];
    barcode?: string;
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
    location?: Location;
};

export type Package = {
    id: number;
    label?: string;
    price: number;
    description?: string;
    location?: Location;
    inventoryUnits: InventoryUnit[];
    expirationDate?: Date;
    lotNumber?: string;
};

export type Location = {
    id: number;
    name: string;
    description?: string;
};
