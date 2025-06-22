import { Product } from '../types/ProductTypes';
import api from './api';

class ProductService {
    async getProducts(body?: any): Promise<Product[]> {
        const response = await api.get('Product', body);
        return response.data;
    }

    async getProductById(id: number): Promise<Product> {
        const response = await api.get(`Product/${id}`);
        return response.data;
    }
}

export default new ProductService();
