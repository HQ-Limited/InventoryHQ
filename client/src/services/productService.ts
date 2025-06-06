import axios from 'axios';
import { SimpleProductType, VariableProductType } from '../types/ProductTypes';

const API_URL = 'https://localhost:44301/api/Product/simple';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class ProductService {
    async getProducts(body?: any): Promise<SimpleProductType[] | VariableProductType[]> {
        // const response = await axios.get(API_URL, body);
        return await axios.get(API_URL, body);
    }

    async getProductById(id: number): Promise<SimpleProductType | VariableProductType> {
        // const response = await axios.get(`${API_URL}/${id}`);
        // TEST DATA
        const responseSimple = {
            status: 200,
            data: {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                wholesalePrice: 70,
                quantity: 10,
                manage_quantity: true,
                sku: 'sku-1',
                categories: [1, 2],
                attributes: [
                    {
                        id: 1, // Color
                        values: [1, 2], // Red, Blue
                    },
                ],
                selectedAttributes: [1],
            },
        };

        const responseVariable = {
            status: 200,
            data: {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                categories: [1, 2],
                selectedAttributes: [2],
                attributes: [
                    {
                        id: 1, // Color
                        values: [1, 2], // Red, Blue
                        isVariational: true,
                    },
                ],
                variations: [
                    {
                        id: 1000,
                        price: 10,
                        wholesalePrice: 30,
                        sku: 'sku-1000',
                        attributes: [
                            {
                                id: 1,
                                value: 1,
                            },
                        ],
                        manage_quantity: true,
                        quantity: 25,
                    },
                    {
                        id: 1001,
                        price: 50,
                        wholesalePrice: 100,
                        sku: 'sku-1001',
                        attributes: [
                            {
                                id: 1,
                                value: 2,
                            },
                        ],
                        manage_quantity: false,
                    },
                ],
            },
        };

        return responseVariable.data;
    }
}

export default new ProductService();
