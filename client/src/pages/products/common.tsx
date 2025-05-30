export type CommonProductProperties = {
    price: number;
    quantity?: number;
    manage_quantity: boolean;
    sku: string;
    images?: string[];
    attribute_id?: AttributeType[];
};

export type ProductType = {
    id: number;
    variations: number[];
};

export type VariationType = CommonProductProperties & {
    id: number;
    name: string;
    description: string;
    category_id: CategoryType[];
};

export type AttributeType = {
    id: number;
    name: string;
    value: string;
};

export type CategoryType = {
    id: number;
    name: string;
    image: string;
    parent: number;
};
