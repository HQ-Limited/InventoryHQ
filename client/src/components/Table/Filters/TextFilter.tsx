import { DeleteOutlined, FilterFilled } from '@ant-design/icons';
import { Button, Input, Select, Space, TableColumnType } from 'antd';
import { CustomFilterProps, StringOperators } from './types/FilterTypes';
import { ActionButtons } from './ActionButtons';

export const TextFilter = <T,>(propertyPath: string[]): TableColumnType<T> => {
    const TextFilter: TableColumnType<T> = {
        filterIcon: (filtered: boolean) => (
            <FilterFilled style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        filterDropdown: (props) => {
            const { setSelectedKeys, selectedKeys, confirm, close } =
                props as unknown as CustomFilterProps<string>;

            // Ensure there is at least one default key object with propertyPath
            if (selectedKeys.length === 0) {
                setSelectedKeys([{ value: '', operator: 'eq', propertyPath }]);
            }

            function applyFilters() {
                const newKeys = selectedKeys.filter((key) => key.value !== '');
                setSelectedKeys(newKeys);
                confirm();
            }

            function clearFilters() {
                setSelectedKeys([]);
                confirm();
            }

            return (
                <Space
                    direction="vertical"
                    style={{ padding: 8 }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {selectedKeys.map((key, index) => (
                        <Input
                            key={index}
                            value={key.value ?? ''}
                            onChange={(e) => {
                                const newKeys = [...selectedKeys];
                                newKeys[index] = { ...key, value: e.target.value, propertyPath };
                                setSelectedKeys(newKeys);
                            }}
                            onPressEnter={() => applyFilters()}
                            addonBefore={
                                <Select
                                    value={key.operator}
                                    options={StringOperators}
                                    onChange={(operator) => {
                                        const newKeys = [...selectedKeys];
                                        newKeys[index] = { ...key, operator, propertyPath };
                                        setSelectedKeys(newKeys);
                                    }}
                                />
                            }
                            addonAfter={
                                index === 0 ? null : (
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        onClick={() => {
                                            const newKeys = [...selectedKeys];
                                            newKeys.splice(index, 1);
                                            setSelectedKeys(newKeys);
                                        }}
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                )
                            }
                        />
                    ))}
                    <Button
                        size="small"
                        onClick={() =>
                            setSelectedKeys([
                                ...selectedKeys,
                                { value: null, operator: 'eq', propertyPath },
                            ])
                        }
                    >
                        Add filter
                    </Button>
                    <ActionButtons
                        close={close}
                        clearFilters={clearFilters}
                        applyFilters={applyFilters}
                    />
                </Space>
            );
        },
    };

    return TextFilter;
};
