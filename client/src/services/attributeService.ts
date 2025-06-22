import { AttributeDB } from '../types/ProductTypesDB';

class AttributeService {
    async getAttributes(id?: number | number[]): Promise<AttributeDB[]> {
        // const response = await api.get('Attribute', id);
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
        // const response = await api.get(`Attribute/${id}/values`);
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
        // const response = await api.post('Attribute', { name });
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
        // const response = await axios.post('Attribute', { id, value });
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
