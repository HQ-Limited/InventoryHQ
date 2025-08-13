export type Customer = {
    id: number;
    name: string;
    pmr: string;
    phone?: string;
    email?: string;
    vat: string;
    taxVAT?: string;
    address?: string;
    deliveryAddress?: string;
    discount?: number;
    receivers?: Receiver[];
    customerGroup?: CustomerGroup;
    deleted: boolean;
};

export type Receiver = {
    id: number;
    name: string;
};

export type CustomerGroup = {
    id: number;
    name: string;
    discount?: number;
};
