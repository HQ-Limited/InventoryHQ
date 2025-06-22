import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Select, Space, TableColumnType } from 'antd';
import { useRef } from 'react';

export const NumberFilter = <T,>(field: string): TableColumnType<T> => {
    const searchInput = useRef<InputRef>(null);

    const NumberSearch: TableColumnType<T> = {
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            if (!value || typeof value !== 'object') return true;
            const { input, operator } = value as { input: string; operator: string };
            const recordValue = Number((record as any)[field]);
            const filterValue = Number(input);
            if (isNaN(recordValue) || isNaN(filterValue)) return false;
            switch (operator) {
                case 'eq':
                    return recordValue === filterValue;
                case 'gt':
                    return recordValue > filterValue;
                case 'lt':
                    return recordValue < filterValue;
                default:
                    return true;
            }
        },
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => {
            const current = (selectedKeys[0] as any) || { input: '', operator: 'eq' };
            return (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                    <Select
                        value={current.operator}
                        style={{ width: '100%', marginBottom: 8 }}
                        options={[
                            { value: 'eq', label: 'Equals' },
                            { value: 'gt', label: 'Greater than' },
                            { value: 'lt', label: 'Less than' },
                        ]}
                        onChange={(operator) => {
                            setSelectedKeys([{ ...current, operator }]);
                        }}
                    />
                    <Input.Search
                        ref={searchInput}
                        placeholder={`Search in ${field}`}
                        value={current.input}
                        onChange={(e) => {
                            setSelectedKeys([{ ...current, input: e.target.value }]);
                        }}
                        onPressEnter={() => confirm()}
                        onSearch={() => confirm()}
                        allowClear
                        style={{ marginBottom: 8, display: 'block' }}
                    />
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
                    </Space>
                </div>
            );
        },
    };

    return NumberSearch;
};
