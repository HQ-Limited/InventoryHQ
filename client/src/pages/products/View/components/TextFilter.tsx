import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Select, Space, TableColumnType } from 'antd';
import { useRef } from 'react';

export const TextFilter = <T,>(): TableColumnType<T> => {
    const searchInput = useRef<InputRef>(null);

    const TextSearch: TableColumnType<T> = {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => {
            const current = (selectedKeys[0] as any) || { input: '', operator: 'eq' };
            return (
                <>
                    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                        <Select
                            value={current.operator}
                            style={{ width: '100%', marginBottom: 8 }}
                            options={[
                                { value: 'eq', label: 'Equals' },
                                { value: 'sw', label: 'Starts With' },
                                { value: 'ct', label: 'Contains' },
                            ]}
                            onChange={(operator) => {
                                setSelectedKeys([{ ...current, operator }]);
                            }}
                        />
                        <Input.Search
                            ref={searchInput}
                            value={current.input}
                            onChange={(e) => {
                                setSelectedKeys([{ ...current, input: e.target.value }]);
                            }}
                            onPressEnter={() => confirm()}
                            onSearch={(value) => {
                                setSelectedKeys(value ? [value] : []);
                                confirm();
                            }}
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
                </>
            );
        },
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    };

    return TextSearch;
};
