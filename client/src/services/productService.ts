import {
    Product as EditProduct,
    Variation as EditVariation,
} from '../pages/products/Edit/types/EditProductTypes';
import { Product as ViewProduct } from '../pages/products/View/types/ViewProductTypes';
import api from '../utils/api';

class ProductService {
    async getProducts(query?: any): Promise<ViewProduct[]> {
        const response = await api.get<ViewProduct[]>(`Product${query ? query : ''}`);
        return response.data;
    }

    async getProductById(id: number): Promise<EditProduct> {
        const response = await api.get<EditProduct>(`Product/${id}`);
        return response.data;
    }

    async createProduct(product: EditProduct): Promise<EditProduct> {
        const response = await api.post<EditProduct>('Product', product);
        return response.data;
    }

    async updateProduct(product: EditProduct): Promise<EditProduct> {
        const response = await api.put<EditProduct>('Product', product);
        return response.data;
    }

    async deleteProduct(id: number): Promise<number> {
        const response = await api.delete<number>(`Product/${id}`);
        return response.status;
    }

    async getVariations(id: number, payload: any): Promise<EditVariation[]> {
        const response = await api.post<EditVariation[]>(`Product/${id}/variations`, payload ?? {});
        return response.data;
    }
}

export default new ProductService();
