import axios from 'axios';

type CheckVATResponse = {
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
        const response = await axios.post<CheckVATResponse>(
            'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number',
            { countryCode, vatNumber }
        );
        return response.data;
    }
}

export default new VatService();
