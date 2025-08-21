export type Product = {
    id: number;
    name: string;
    description?: string;
    isVariable: boolean;
    quantity: number;
    attributes?: ProductAttribute[];
    categories?: Category[];
    variations: Variation[];
};

export type Category = {
    id: number;
    name: string;
};

export type Variation = {
    id: number;
    sku?: string;
    retailPrice: number;
    minStock?: number;
    attributes?: VariationAttribute[];
    inventoryUnits: InventoryUnit[];
    barcode?: string;
};

export type VariationAttribute = {
    name: string;
    value: string;
};

export type ProductAttribute = {
    id: number;
    name: string;
    values: string[];
};

export type InventoryUnit = {
    id: number;
    quantity: number;
    locationName: string;
    packageId?: number;
};

export type Location = {
    id: number;
    name: string;
};
