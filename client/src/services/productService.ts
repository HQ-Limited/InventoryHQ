import axios from 'axios';
import { SimpleProductTypeDB, VariableProductTypeDB } from '../types/ProductTypesDB';
import { SimpleProductType, Product } from '../types/ProductTypes';

const API_URL = 'https://localhost:44301/api/Product/';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class ProductService {
    async getProducts(body?: any): Promise<Product[]> {
        const response = await axios.get(API_URL, body);
        return response.data;
    }

    async getProductById(id: number): Promise<Product> {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
}

export default new ProductService();
