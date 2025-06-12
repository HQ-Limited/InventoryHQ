import axios from 'axios';
import { Category } from '../types/ProductTypes';

const API_URL = 'https://localhost:44301/api/Category';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class ProductService {
    async getCategories(body?: any): Promise<Category[]> {
        // const response = await axios.get(API_URL, body);
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
