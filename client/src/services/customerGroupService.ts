import api from '../utils/api';
import { CustomerGroup } from '../pages/customers/types/Customer';

class CustomerGroupService {
    async getCustomerGroups(): Promise<CustomerGroup[]> {
        const response = await api.get<CustomerGroup[]>('CustomerGroup');
        return response.data;
    }

    async getCustomerGroupById(id: number): Promise<CustomerGroup> {
        const response = await api.get<CustomerGroup>(`CustomerGroup/${id}`);
        return response.data;
    }

    async createCustomerGroup(customerGroup: CustomerGroup): Promise<CustomerGroup> {
        const response = await api.post<CustomerGroup>('CustomerGroup', customerGroup);
        return response.data;
    }

    async updateCustomerGroup(customerGroup: CustomerGroup): Promise<CustomerGroup> {
        const response = await api.put<CustomerGroup>('CustomerGroup', customerGroup);
        return response.data;
    }

    async deleteCustomerGroup(id: number): Promise<number> {
        const response = await api.delete<number>(`CustomerGroup/${id}`);
        return response.status;
    }
}

export default new CustomerGroupService();
