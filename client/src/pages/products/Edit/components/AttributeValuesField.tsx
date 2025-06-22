import { Button, Card, Checkbox, CheckboxChangeEvent, Form, Select, Tooltip } from 'antd';
import { AttributeDB } from '../../../../types/ProductTypesDB';
import { CloseOutlined } from '@ant-design/icons';

export default function AttributeValuesField({
    attributeKey,
    parentId,
    attribute,
    onSelect,
    onDeselect,
    onClear,
    showVariationCheckbox = false,
    onIsVariationalChange,
    onRemoveAttribute,
    isVariational,
    options,
}: {
    attributeKey: number;
    parentId: number;
    attribute: Partial<AttributeDB>;
    onSelect: ({ id, parent }: { id: number; parent: number }) => void;
    onDeselect: ({ id, parent }: { id: number; parent: number }) => void;
    onClear: () => void;
    onIsVariationalChange?: ({ id, value }: { id: number; value: boolean }) => void;
    showVariationCheckbox?: boolean;
    onRemoveAttribute?: (id: number) => void;
    isVariational?: boolean;
    options?: { value: number; label: string }[];
}) {
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
                        onClick={() => onRemoveAttribute!(parentId)}
                    />
                </Tooltip>
            }
            style={{ width: 300 }}
        >
            <Form.Item name={['attributes', attributeKey, 'values']} rules={[{ required: true }]}>
                <Select
                    mode="tags"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="value"
                    onSelect={(id: number) => onSelect({ id, parent: parentId })}
                    onDeselect={(id: number) => onDeselect({ id, parent: parentId })}
                    onClear={() => onClear()}
                    options={options}
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item
                    name={['attributes', attributeKey, 'isVariational']}
                    valuePropName="checked"
                >
                    <Checkbox
                        checked={isVariational}
                        onChange={(e: CheckboxChangeEvent) =>
                            onIsVariationalChange!({ id: parentId, value: e.target.checked })
                        }
                    >
                        Used for variations
                    </Checkbox>
                </Form.Item>
            )}
        </Card>
    );
}
