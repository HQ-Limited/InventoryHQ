export type PartnerType = {
    id: string;
    company: string;
    legalRepresentative?: string;
    city?: string;
    address?: string;
    uic?: string;
    vat?: string;
    phone?: string;
    email?: string;
    bank?: string;
    bic?: string;
    iban?: string;
    discount: number;
    priceGroup: 'retail' | 'wholesale';
    type: 'customer' | 'supplier';
};

export type CreatePartnerType = Omit<PartnerType, 'id'>;
