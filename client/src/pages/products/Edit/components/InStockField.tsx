import { Form, Select } from 'antd';

export default function InStockField() {
    return (
        <Form.Item label="Stock status" name={['inStock']}>
            <Select
                options={[
                    { label: 'In stock', value: true },
                    { label: 'Out of stock', value: false },
                ]}
            />
        </Form.Item>
    );
}
