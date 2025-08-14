import api from '../utils/api';
import { Pricelist, Supplier } from '../pages/suppliers/types/Supplier';

class SupplierService {
    async getSuppliers(): Promise<Supplier[]> {
        const response = await api.get<Supplier[]>('Supplier');
        return response.data;
    }

    async getSupplierById(id: number): Promise<Supplier> {
        const response = await api.get<Supplier>(`Supplier/${id}`);
        return response.data;
    }

    async getPricelist(id: number): Promise<Pricelist[]> {
        const response = await api.get<Pricelist[]>(`Supplier/${id}/Pricelist`);
        return response.data;
    }

    async createSupplier(supplier: Supplier): Promise<Supplier> {
        const response = await api.post<Supplier>('Supplier', supplier);
        return response.data;
    }

    async updateSupplier(supplier: Supplier): Promise<Supplier> {
        const response = await api.put<Supplier>('Supplier', supplier);
        return response.data;
    }

    async deleteSupplier(id: number): Promise<number> {
        const response = await api.delete<number>(`Supplier/${id}`);
        return response.status;
    }
}

export default new SupplierService();
