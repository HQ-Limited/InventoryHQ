import api from '../utils/api';
import { Customer } from '../pages/customers/types/Customer';

class CustomerService {
    async getCustomers(): Promise<Customer[]> {
        const response = await api.get<Customer[]>('Customer');
        return response.data;
    }

    async getCustomerById(id: number): Promise<Customer> {
        const response = await api.get<Customer>(`Customer/${id}`);
        return response.data;
    }

    async createCustomer(customer: Customer): Promise<Customer> {
        const response = await api.post<Customer>('Customer', customer);
        return response.data;
    }

    async updateCustomer(customer: Customer): Promise<Customer> {
        const response = await api.put<Customer>('Customer', customer);
        return response.data;
    }

    async deleteCustomer(id: number): Promise<number> {
        const response = await api.delete<number>(`Customer/${id}`);
        return response.status;
    }
}

export default new CustomerService();
