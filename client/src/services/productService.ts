import axios from 'axios';
import { SimpleProductTypeDB, VariableProductTypeDB } from '../types/ProductTypesDB';
import { SimpleProductType, VariableProductType } from '../types/ProductTypes';

const API_URL = 'https://localhost:44301/api/Product/simple';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

type ProductDB = SimpleProductTypeDB | VariableProductTypeDB;
type Product = SimpleProductType | VariableProductType;

class ProductService {
    async getProducts(body?: any): Promise<Product[]> {
        // const response = await axios.get(API_URL, body);

        // TEST CODE
        const response = {
            status: 200,
            data: [
                {
                    id: 1,
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 100,
                    wholesalePrice: 70,
                    quantity: 10,
                    manage_quantity: true,
                    sku: 'sku-1',
                    categories: [
                        {
                            id: 1,
                            name: 'Category 1',
                        },
                    ],
                    attributes: [
                        {
                            id: 1,
                            name: 'Color',
                            values: [
                                {
                                    id: 1,
                                    name: 'Red',
                                },
                                {
                                    id: 2,
                                    name: 'Blue',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Product 2',
                    description: 'Description 2',
                    categories: [
                        {
                            id: 1,
                            name: 'Category 1',
                        },
                    ],
                    attributes: [
                        {
                            id: 1,
                            name: 'Color',
                            values: [
                                {
                                    id: 1,
                                    name: 'Red',
                                },
                                {
                                    id: 2,
                                    name: 'Blue',
                                },
                            ],
                        },
                    ],
                    variations: [
                        {
                            id: 1,
                            price: 10,
                            quantity: 30,
                            manage_quantity: true,
                            sku: 'sku-2-red',
                            attributes: [
                                {
                                    id: 1,
                                    name: 'Color',
                                    value: {
                                        id: 1,
                                        name: 'Red',
                                    },
                                },
                            ],
                        },
                        {
                            id: 2,
                            price: 12,
                            quantity: 15,
                            manage_quantity: true,
                            sku: 'sku-2-blue',
                            attributes: [
                                {
                                    id: 1,
                                    name: 'Color',
                                    value: {
                                        id: 2,
                                        name: 'Blue',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'Product 3',
                    price: 33,
                    quantity: 0,
                    manage_quantity: false,
                    sku: 'sku-1',
                    categories: [
                        {
                            id: 1,
                            name: 'Category 1',
                        },
                    ],
                    attributes: [
                        {
                            id: 1,
                            name: 'Color',
                            values: [
                                {
                                    id: 1,
                                    name: 'Red',
                                },
                                {
                                    id: 2,
                                    name: 'Blue',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        return response.data;
    }

    async getProductById(id: number): Promise<ProductDB> {
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

        return responseSimple.data;
    }
}

export default new ProductService();
