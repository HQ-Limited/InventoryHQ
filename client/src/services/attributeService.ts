import { VariationAttribute } from '../types/ProductTypes';
import { AttributeDB } from '../types/ProductTypesDB';
import api from './api';

class AttributeService {
    async getAttributes(options?: {
        includeValues?: boolean;
        ids?: number[];
    }): Promise<AttributeDB[]> {
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

    async getAttributeValues(id: number): Promise<VariationAttribute[]> {
        const response = await api.get(`Attribute/${id}`);
        return response.data;
    }

    async createAttribute(name: string): Promise<number> {
        // const response = await api.post('Attribute', { name });
        // TEST RESPONSE
        const response = {
            status: 200,
            data: Math.floor(Math.random() * 100),
        };

        if (response.status !== 200) {
            throw new Error('Failed to create attribute');
        }

        return response.data;
    }

    async createAttributeValue({ id: number, value: string }): Promise<number> {
        // const response = await axios.post('Attribute', { id, value });
        // TEST RESPONSE
        const response = {
            status: 200,
            data: Math.floor(Math.random() * 100),
        };

        if (response.status !== 200) {
            throw new Error('Failed to create attribute');
        }

        return response.data;
    }
}

export default new AttributeService();
