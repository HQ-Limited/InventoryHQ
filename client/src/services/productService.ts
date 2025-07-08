import { Product, Variation } from '../types/ProductTypes';
import api from '../utils/api';

class ProductService {
    async getProducts(payload: any): Promise<Product[]> {
        const response = await api.post<Product[]>('Product/search', payload ?? {});
        return response.data;
    }

    async getProductById(id: number): Promise<Product> {
        const response = await api.get<Product>(`Product/${id}`);
        return response.data;
    }

    async createProduct(product: Product): Promise<Product> {
        const response = await api.post<Product>('Product', product);
        return response.data;
    }

    async updateProduct(product: Product): Promise<Product> {
        const response = await api.put<Product>('Product', product);
        return response.data;
    }

    async deleteProduct(id: number): Promise<number> {
        const response = await api.delete<number>(`Product/${id}`);
        return response.status;
    }

    async getVariations(id: number, payload: any): Promise<Variation[]> {
        const response = await api.post<Variation[]>(`Product/${id}/variations`, payload ?? {});
        return response.data;
    }
}

export default new ProductService();
