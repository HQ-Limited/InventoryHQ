import { SearchOutlined } from '@ant-design/icons';
import { Button, InputNumber, Select, Space, TableColumnType } from 'antd';

export const NumberFilter = <T,>(): TableColumnType<T> => {
    const NumberSearch: TableColumnType<T> = {
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
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
                    <InputNumber
                        controls={false}
                        value={current.input}
                        inputMode="decimal"
                        onChange={(value) => {
                            setSelectedKeys([{ ...current, input: value }]);
                        }}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block', width: '100%' }}
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
