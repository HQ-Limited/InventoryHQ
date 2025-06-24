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
    onAttributeRemove,
    onRemove,
    showVariationCheckbox = false,
}: {
    name: number;
    attributes: ProductAttribute[];
    onSelect: ({ id, parent }: { id: number; parent: number }) => void;
    onDeselect: ({ id, parent }: { id: number; parent: number }) => void;
    onClear: (id: number) => void;
    onRemove: (id: number) => void;
    onAttributeRemove: (id: number) => void;
    showVariationCheckbox?: boolean;
}) {
    const form = Form.useFormInstance();

    const currentAttribute: ProductAttribute = form.getFieldValue('attributes')[name];
    const availableValues = attributes.find((x) => x.id == currentAttribute.id)!.values;

    return (
        <Card
            title={currentAttribute.name}
            extra={
                <Tooltip title="Remove">
                    <Button
                        danger
                        type="text"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            onRemove(name);
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
                    options={availableValues}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item name={[name, 'isVariational']} valuePropName="checked">
                    <Checkbox>Used for variations</Checkbox>
                </Form.Item>
            )}
        </Card>
    );
}
