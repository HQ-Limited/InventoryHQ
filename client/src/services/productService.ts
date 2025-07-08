import { Product } from '../types/ProductTypes';
import api from '../utils/api';

class ProductService {
    async getProducts(): Promise<Product[]> {
        const response = await api.get<Product[]>('Product');
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
}

export default new ProductService();
