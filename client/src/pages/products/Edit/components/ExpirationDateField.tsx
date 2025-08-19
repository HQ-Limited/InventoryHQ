import { DatePicker, Form, FormItemProps } from 'antd';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from '../../../../global';

export default function ExpirationDateField({
    name = ['expirationDate'],
    label = 'Expiration Date',
    props,
}: {
    name?: (number | string)[];
    label?: string;
    props?: FormItemProps;
}) {
    return (
        <Form.Item
            getValueProps={(value) => ({ value: value ? dayjs(value) : '' })}
            label={label}
            name={[...name]}
            {...props}
        >
            <DatePicker format={DEFAULT_DATE_FORMAT} />
        </Form.Item>
    );
}
