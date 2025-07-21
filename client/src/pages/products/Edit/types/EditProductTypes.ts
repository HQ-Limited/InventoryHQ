import { AttributeValue, ProductAttribute } from '../../../../types/AttributeTypes';

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
