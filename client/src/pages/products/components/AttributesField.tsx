import { Form, Select } from 'antd';

export default function AttributesField({
    onSelect,
    onDeselect,
    onClear,
    options,
    selected = [],
}: {
    onSelect: (id: number) => void;
    onDeselect: (id: number) => void;
    onClear: () => void;
    options: { value: string; label: string; hidden: boolean }[];
    selected: number[];
}) {
    return (
        <Form.Item label="Attributes" name="attributes">
            <Select
                mode="multiple"
                allowClear
                showSearch
                optionFilterProp="name"
                onSelect={(v) => onSelect(parseInt(v))}
                onDeselect={(v) => onDeselect(parseInt(v))}
                onClear={onClear}
                options={options}
                value={selected}
            />
        </Form.Item>
    );
}
