import { Category } from '../types/ProductTypes';
import api from './api';

class ProductService {
    async getCategories(): Promise<Category[]> {
        const response = await api.get('/Category');
        return response.data;
    }
}

export default new ProductService();
