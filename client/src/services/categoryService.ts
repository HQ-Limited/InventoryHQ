import { CategoryDB } from '../types/ProductTypesDB';
import api from './api';

class ProductService {
    async getCategories(body?: any): Promise<CategoryDB[]> {
        // const response = await api.get('/Category', body);
        // FAKE DATA
        const response = {
            status: 200,
            data: [
                {
                    id: 1,
                    name: 'Category 1',
                },
                {
                    id: 2,
                    name: 'Category 2',
                },
                {
                    id: 3,
                    name: 'Subcategory 1',
                    parent: 2,
                },
            ],
        };
        return response.data;
    }
}

export default new ProductService();
