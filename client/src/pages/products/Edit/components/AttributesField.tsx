import { Form, Select } from 'antd';

export default function AttributesField({
    onSelect,
    onDeselect,
    onClear,
    options,
    required = false,
}: {
    onSelect: (id: number) => void;
    onDeselect: (id: number) => void;
    onClear: () => void;
    options: { value: number; label: string }[];
    required?: boolean;
}) {
    return (
        <Form.Item
            name={'selectedAttributes'}
            label="Attributes"
            rules={required ? [{ required: true }] : []}
        >
            <Select
                mode="tags"
                allowClear
                showSearch
                optionFilterProp="value"
                onSelect={(v: number) => onSelect(v)}
                onDeselect={(v: number) => onDeselect(v)}
                onClear={onClear}
                options={options}
            />
        </Form.Item>
    );
}
