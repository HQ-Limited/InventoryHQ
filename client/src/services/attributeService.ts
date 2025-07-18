import { Attribute, AttributeValue, ProductAttribute } from '../types/AttributeTypes';
import api from '../utils/api';

type CreateAttribute = {
    name: string;
    values?: CreateAttributeValue[];
};

type CreateAttributeValue = {
    value: string;
};

class AttributeService {
    async getAttributes(options?: {
        includeValues?: boolean;
        ids?: number[];
    }): Promise<ProductAttribute[]> {
        const { includeValues = false, ids = [] } = options || {};
        const response = await api.get('Attribute', {
            params: {
                includeValues,
                ids: ids.length > 0 ? ids : undefined,
            },
            paramsSerializer: {
                indexes: true,
            },
        });
        return response.data;
    }

    async getAttributeValues(id: number): Promise<AttributeValue[]> {
        const response = await api.get<AttributeValue[]>(`Attribute/${id}`);
        return response.data;
    }

    async createAttribute(attribute: CreateAttribute): Promise<Attribute> {
        const response = await api.post<Attribute>('Attribute', attribute);
        return response.data;
    }

    async updateAttribute(attribute: Attribute): Promise<Attribute> {
        const response = await api.put<Attribute>(`Attribute/${attribute.id}`, {
            name: attribute.name,
            values: attribute.values,
        });
        return response.data;
    }

    async createAttributeValue({ id, value }: { id: number; value: string }): Promise<number> {
        const response = await api.post<number>(`Attribute/${id}`, null, { params: { value } });
        return response.data;
    }

    async deleteAttribute(id: number): Promise<void> {
        const response = await api.delete(`Attribute/${id}`);
        return response.data;
    }

    async deleteAttributeValue(attributeId: number, valueId: number): Promise<void> {
        const response = await api.delete(`Attribute/${attributeId}/${valueId}`);
        return response.data;
    }
}

export default new AttributeService();
