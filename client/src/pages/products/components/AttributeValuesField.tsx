import { Button, Card, Checkbox, CheckboxChangeEvent, Form, Select, Tooltip } from 'antd';
import { Attribute } from '../common';
import { CloseOutlined } from '@ant-design/icons';

export default function AttributeValuesField({
    parentId,
    attribute,
    onSelect,
    onDeselect,
    onClear,
    showVariationCheckbox = false,
    onIsVariationalChange,
    onRemoveAttribute,
}: {
    parentId: number;
    attribute: Attribute;
    onSelect: ({ id, parent }: { id: number; parent: number }) => void;
    onDeselect: ({ id, parent }: { id: number; parent: number }) => void;
    onClear: () => void;
    onIsVariationalChange?: ({ id, value }: { id: number; value: boolean }) => void;
    showVariationCheckbox?: boolean;
    onRemoveAttribute?: (id: number) => void;
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
            <Form.Item label={attribute.name} name={[parentId, 'values']}>
                <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Select value/s"
                    optionFilterProp="name"
                    onSelect={(id: number) => onSelect({ id, parent: parentId })}
                    onDeselect={(id: number) => onDeselect({ id, parent: parentId })}
                    onClear={() => onClear()}
                    options={
                        attribute.values!.map((v) => ({
                            key: v.id,
                            label: v.value,
                            value: v.id,
                        })) || []
                    }
                />
            </Form.Item>
            {showVariationCheckbox && (
                <Form.Item name={[parentId, 'isVariational']} valuePropName="checked">
                    <Checkbox
                        onChange={(e: CheckboxChangeEvent) =>
                            onIsVariationalChange!({ id: parentId, value: e.target.checked })
                        }
                    >
                        Is used for variations
                    </Checkbox>
                </Form.Item>
            )}
        </Card>
    );
}
