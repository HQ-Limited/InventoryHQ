import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, InputNumber, Select, Space, TableColumnType } from 'antd';
import { CustomFilterProps, NumberOperators } from './types/FilterTypes';

export const NumberFilter = <T,>(): TableColumnType<T> => {
    const NumberSearch: TableColumnType<T> = {
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        filterDropdown: (props) => {
            const { setSelectedKeys, selectedKeys, confirm, close } =
                props as unknown as CustomFilterProps<number>;

            if (selectedKeys.length === 0) {
                setSelectedKeys([{ value: null, operator: 'eq' }]);
            }

            return (
                <Space
                    direction="vertical"
                    style={{ padding: 8 }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {selectedKeys.map((key, index) => (
                        <InputNumber
                            controls={false}
                            value={key.value}
                            inputMode="decimal"
                            onChange={(value) => {
                                const newKeys = [...selectedKeys];
                                newKeys[index] = { ...key, value };
                                setSelectedKeys(newKeys);
                            }}
                            onPressEnter={() => confirm()}
                            addonBefore={
                                <Select
                                    value={key.operator}
                                    options={NumberOperators}
                                    onChange={(operator) => {
                                        const newKeys = [...selectedKeys];
                                        newKeys[index] = { ...key, operator };
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
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() =>
                                setSelectedKeys([...selectedKeys, { value: null, operator: 'eq' }])
                            }
                        >
                            Add filter
                        </Button>
                        <Button onClick={() => confirm()}>Apply</Button>
                    </Space>
                </Space>
            );
        },
    };

    return NumberSearch;
};
