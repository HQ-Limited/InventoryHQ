import { Product } from '../types/ProductTypes';
import api from './api';

class ProductService {
    async getProducts(): Promise<Product[]> {
        const response = await api.get('Product');
        return response.data;
    }

    async getProductById(id: number): Promise<Product> {
        const response = await api.get(`Product/${id}`);
        // FIXME REMOVE THIS
        if (response?.data?.attributes?.length > 0) {
            response.data.attributes = response.data.attributes.map((a: any) => ({
                ...a,
                isVariational: true,
            }));

            if (response.data.variations?.length > 0) {
                response.data.variations = response.data.variations.map((v: any) => ({
                    ...v,
                    manage_quantity: true,
                }));
            }
        }

        return response.data;
    }

    async deleteProduct(id: number): Promise<number> {
        const response = await api.delete(`Product/${id}`);
        return response.status;
    }
}

export default new ProductService();
