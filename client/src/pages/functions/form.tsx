import { CheckVATResponse } from '../../services/vatService';
import { FormInstance } from 'antd';
import vatService from '../../services/vatService';
import { MessageInstance } from 'antd/es/message/interface';

export async function checkVAT(form: FormInstance, message: MessageInstance) {
    const vat = form.getFieldValue('taxVAT');

    if (!vat) return;

    const pattern = /^(?<Prefix>[a-zA-Z]+)(?<Number>\d+)$/;

    const match = vat.match(pattern);

    if (!match || !match.groups) return message.error('Invalid VAT number.');

    const countryCode = match.groups['Prefix'].toUpperCase();
    const vatNumber = match.groups['Number'];

    const response: CheckVATResponse = await vatService.checkVAT({ countryCode, vatNumber });

    if (response.valid) {
        form.setFieldsValue({
            address: response.address,
            name: response.name,
            vat: vatNumber,
        });
        message.success(
            'VAT number is valid. Address, name and VAT have been filled automatically.'
        );
    } else {
        form.setFieldsValue({
            vat: '',
            address: '',
            name: '',
        });
        message.error('Invalid VAT number.');
    }
}
