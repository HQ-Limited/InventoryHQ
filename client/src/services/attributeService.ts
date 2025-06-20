import axios from 'axios';
import { AttributeDB } from '../types/ProductTypesDB';

const API_URL = 'https://localhost:44301/api/Attribute';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class AttributeService {
    async getAttributes(id?: number | number[]): Promise<AttributeDB[]> {
        // const response = await axios.get(API_URL, id);
        // FAKE DATA
        const response = {
            data: [
                {
                    id: 1,
                    name: 'Color',
                    values: [
                        {
                            id: 1,
                            value: 'Red',
                        },
                        {
                            id: 2,
                            value: 'Blue',
                        },
                        {
                            id: 3,
                            value: 'Green',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Size',
                },
            ],
            status: 200,
        };

        return response.data;
    }

    async getAttributeValues(id: number): Promise<{ id: number; value: string }[]> {
        // const response = await axios.get(`${API_URL}/${id}/values`);
        // FAKE DATA
        const response = {
            status: 200,
            data: [
                {
                    id: 1,
                    value: 'Red',
                },
                {
                    id: 2,
                    value: 'Blue',
                },
                {
                    id: 3,
                    value: 'Green',
                },
            ],
        };

        return response.data;
    }

    async createAttribute(name: string): Promise<number> {
        // const response = await axios.post(API_URL, { name });
        // TEST RESPONSE
        const response = {
            status: 200,
            data: Math.random() * 100,
        };

        if (response.status !== 200) {
            throw new Error('Failed to create attribute');
        }

        return response.data;
    }

    async createAttributeValue({ id: number, value: string }): Promise<number> {
        // const response = await axios.post(API_URL, { id, value });
        // TEST RESPONSE
        const response = {
            status: 200,
            data: Math.random() * 100,
        };

        if (response.status !== 200) {
            throw new Error('Failed to create attribute');
        }

        return response.data;
    }
}

export default new AttributeService();
