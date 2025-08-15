import { Form, FormItemProps, InputNumber } from 'antd';

export default function VATField({ props }: { props?: FormItemProps }) {
    return (
        <Form.Item
            label="VAT"
            name={'vat'}
            {...props}
            rules={[{ required: true, message: 'VAT is required' }]}
        >
            <InputNumber
                min={0}
                max={100}
                step={1}
                suffix="%"
                controls={false}
                style={{ width: '100%' }}
            />
        </Form.Item>
    );
}
