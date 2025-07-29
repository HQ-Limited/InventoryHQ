export type Quantity = {
    locationName: string;
    quantity: number;
};

export type Product = SimpleProduct | VariableProduct;

export const isSimpleProduct = (product: Product): product is SimpleProduct => {
    return product.isVariable === false;
};

export const isVariableProduct = (product: Product): product is VariableProduct => {
    return product.isVariable === true;
};

export type SimpleProduct = {
    id: number;
    name: string;
    sku: string;
    description?: string;
    isVariable: false;
    manageQuantity: boolean;
    retailPrice: number;
    quantity: Quantity[];
    attributes: ProductAttribute[];
    categories: Category[];
    packages: Package[];
};

export type VariableProduct = {
    id: number;
    name: string;
    description?: string;
    isVariable: true;
    manageQuantity: boolean;
    quantity: Quantity[];
    attributes: ProductAttribute[];
    categories: Category[];
    variations: Variation[];
    packages: Package[];
};

export type Category = {
    id: number;
    name: string;
};

export type Variation = {
    id: number;
    sku: string;
    retailPrice: number;
    attributes?: VariationAttribute[];
    inventoryUnits?: InventoryUnit[];
};

export type VariationAttribute = {
    attributeId: number;
    value: string;
};

export type Attribute = {
    id: number;
    name: string;
    values: string[];
};

export type ProductAttribute = {
    id: number;
    name: string;
    values: string[];
    isVariational: boolean;
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
    location: Location;
};

export type Location = {
    id: number;
    name: string;
};
