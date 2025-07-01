import { AttributeValue, ProductAttribute, VariationAttribute } from '../types/ProductTypes';
import api from '../utils/api';

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
        const response = await api.get(`Attribute/${id}`);
        return response.data;
    }

    async createAttribute(name: string): Promise<number> {
        const response = await api.post('Attribute', null, { params: { name } });
        return response.data;
    }

    async createAttributeValue({ id, value }: { id: number; value: string }): Promise<number> {
        const response = await api.post(`Attribute/${id}`, null, { params: { value } });
        return response.data;
    }
}

export default new AttributeService();
