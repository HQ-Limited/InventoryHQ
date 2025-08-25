import { Category } from '../pages/products/Edit/types/EditProductTypes';
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

    async createCategory(category: CreateCategory): Promise<Category> {
        const response = await api.post<Category>('/Category', category);
        return response.data;
    }

    async editCategory(category: EditCategory): Promise<Category> {
        const response = await api.put<Category>('/Category', category);
        return response.data;
    }

    async deleteCategory(id: number): Promise<void> {
        await api.delete(`/Category/${id}`);
    }
}

export default new ProductService();
