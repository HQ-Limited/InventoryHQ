import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Space, TableColumnType } from 'antd';
import { useRef } from 'react';

export const TextFilter = <T,>(): TableColumnType<T> => {
    const searchInput = useRef<InputRef>(null);

    const TextSearch: TableColumnType<T> = {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input.Search
                    ref={searchInput}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
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
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
    };

    return TextSearch;
};
