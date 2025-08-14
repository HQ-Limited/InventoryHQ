import api from '../../utils/api';

export type CheckVATResponse = {
    countryCode: string;
    vatNumber: string;
    valid: boolean;
    name: string;
    address: string;
};

class VatService {
    async checkVAT({
        countryCode,
        vatNumber,
    }: {
        countryCode: string;
        vatNumber: string;
    }): Promise<CheckVATResponse> {
        const response = await api.post<CheckVATResponse>('vat/check', { countryCode, vatNumber });
        return response.data;
    }
}

export default new VatService();
