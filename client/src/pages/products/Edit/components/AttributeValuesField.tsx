import { Button, Card, Checkbox, CheckboxChangeEvent, Form, Select, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ProductAttribute } from '../../../../types/ProductTypes';
import { DefaultOptionType } from 'antd/es/select';

export default function AttributeValuesField({
    name,
    attributes,
    onSelect,
    onDeselect,
    onClear,
    onIsVariationalChange,
    onRemove,
    showVariationCheckbox = false,
}: {
    name: number;
    attributes: ProductAttribute[];
    onSelect: ({ id, parent }: { id: number; parent: number }) => void;
    onDeselect: ({ id, parent }: { id: number; parent: number }) => void;
    onClear: (id: number) => void;
    onIsVariationalChange?: ({ id, value }: { id: number; value: boolean }) => void;
    onRemove: (id: number) => void;
    showVariationCheckbox?: boolean;
}) {
    const attribute: ProductAttribute = attributes[name];
    const options: DefaultOptionType[] = attribute.values.map((value) => ({
        label: value.value,
        value: value.id,
    }));

    return (
        <Card
            title={attribute.name}
            extra={
                <Tooltip title="Remove">
                    <Button
                        danger
                        type="text"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            onRemove(name);
                            onClear(attribute.id);
                        }}
                    />
                </Tooltip>
            }
            style={{ width: 300 }}
        >
            <Form.Item
                name={[name, 'values']}
                rules={[{ required: true, message: 'Please select at least one value' }]}
            >
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="value"
                    options={options}
                    onSelect={(id: number) => onSelect({ id, parent: attribute.id })}
                    onDeselect={(id: number) => onDeselect({ id, parent: attribute.id })}
                    onClear={() => onClear(attribute.id)}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item
                    onChange={(e: CheckboxChangeEvent) =>
                        onIsVariationalChange!({ id: name, value: e.target.checked })
                    }
                    name={[name, 'isVariational']}
                    valuePropName="checked"
                >
                    <Checkbox>Used for variations</Checkbox>
                </Form.Item>
            )}
        </Card>
    );
}
