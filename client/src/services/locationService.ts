import { Location } from '../types/ProductTypes';
import api from '../utils/api';

class LocationService {
    async getLocations(): Promise<Location[]> {
        const response = await api.get<Location[]>('Location');
        return response.data;
    }

    async getLocationById(id: number): Promise<Location> {
        const response = await api.get<Location>(`Location/${id}`);
        return response.data;
    }
}

export default new LocationService();
