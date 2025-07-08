import { Category } from '../types/ProductTypes';
import api from '../utils/api';

class ProductService {
    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/Category');
        return response.data;
    }

    async getCategoriesTree(): Promise<Category[]> {
        const response = await api.get<Category[]>('/Category/tree');
        return response.data;
    }

    async createCategory(name: string): Promise<number> {
        // const response = await api.post<Category>('/Category', null, { params: { name } });
        // return response.data;
        return Math.floor(Math.random() * 100);
    }
}

export default new ProductService();
