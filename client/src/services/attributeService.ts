import { ProductAttribute, VariationAttribute } from '../types/ProductTypes';
import api from './api';

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

    async getAttributeValues(id: number): Promise<VariationAttribute[]> {
        const response = await api.get(`Attribute/${id}`);
        return response.data;
    }

    async createAttribute(name: string): Promise<number> {
        const response = await api.post('Attribute', null, { params: { name } });
        return response.data;
    }

    async createAttributeValue({ id, value }: { id: number; value: string }): Promise<number> {
        // const response = await api.post(`Attribute/${id}`, { params: { value } });
        //FIXME
        throw new Error('asd');
        return 3;

        return response.data;
    }
}

export default new AttributeService();
