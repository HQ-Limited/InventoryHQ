export type Supplier = {
    id: number;
    name: string;
    pmr: string;
    phone?: string;
    email?: string;
    vat: string;
    taxVAT?: string;
    address?: string;
    pricelist?: Pricelist[];
    deleted: boolean;
};

export type Pricelist = {
    id: number;
    supplierId: number;
    productName: string;
    variation: Variation;
    price: number;
};

export type Variation = {
    id: number;
    sku: string;
    price: number;
};
