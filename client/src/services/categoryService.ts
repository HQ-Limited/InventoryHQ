import { Category } from '../types/ProductTypes';
import api from '../utils/api';
import {
    CategoryTree,
    CreateCategory,
    EditCategory,
} from '../pages/categories/View/types/CategoryTypes';

class ProductService {
    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/Category');
        return response.data;
    }

    async getNestedCategoriesTree(): Promise<CategoryTree[]> {
        const response = await api.get<CategoryTree[]>('/Category/nestedTree');
        return response.data;
    }

    async getRootCategoriesTree(): Promise<CategoryTree[]> {
        const response = await api.get<CategoryTree[]>('/Category/rootTree');
        return response.data;
    }

    async getChildrenCategoriesTree(parentId: number): Promise<CategoryTree[]> {
        const response = await api.get<CategoryTree[]>(`/Category/${parentId}/childrenTree`);
        return response.data;
    }

    async createCategory(data: CreateCategory): Promise<number> {
        // const response = await api.post<Category>('/Category', data);
        // return response.data;
        return Math.floor(Math.random() * 100);
    }

    async editCategory(data: EditCategory): Promise<number> {
        // const response = await api.put<Category>('/Category', data);
        // return response.data;
        return Math.floor(Math.random() * 100);
    }
}

export default new ProductService();
