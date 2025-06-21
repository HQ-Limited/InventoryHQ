import React, { useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, PopconfirmProps, TableProps } from 'antd';
import {
    Button,
    Checkbox,
    Dropdown,
    FloatButton,
    message,
    Popconfirm,
    Space,
    Table,
    Typography,
} from 'antd';
import type { AnyObject } from 'antd/es/_util/type';
import type { SorterResult } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';
import { Link } from 'react-router-dom';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PartnerType } from './common';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const confirm: PopconfirmProps['onConfirm'] = (e) => {
    message.success('Click on Yes');
};

const cancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('Click on No');
};

const columns: ColumnsType<PartnerType> = [
    {
        key: 'company',
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
        width: '20%',
    },
    {
        key: 'uic',
        title: 'UIC',
        dataIndex: 'uic',
        sorter: true,
    },
    {
        key: 'priceGroup',
        title: 'Price Group',
        dataIndex: 'priceGroup',
        filters: [
            { text: 'Wholesale', value: 'wholesale' },
            { text: 'Retail', value: 'retail' },
        ],
    },
    {
        key: 'type',
        title: 'Type',
        dataIndex: 'type',
        filters: [
            { text: 'Customer', value: 'customer' },
            { text: 'Supplier', value: 'supplier' },
        ],
        hidden: true,
    },
    {
        key: 'action',
        title: 'Action',
        render: (_, record) => (
            <Space size="middle">
                <Link to={`/partners/${record.id}`}>
                    <Button type="primary">Edit</Button>
                </Link>
                <Popconfirm
                    title="Confirmation"
                    description="Are you sure you want to delete this record?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
];

const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
            ${antCls}-table {
                ${antCls}-table-container {
                    ${antCls}-table-body,
                    ${antCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    };
});

const toURLSearchParams = <T extends AnyObject>(record: T) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(record)) {
        params.append(key, value);
    }
    return params;
};

const getRandomuserParams = (params: TableParams) => {
    const { pagination, filters, sortField, sortOrder, ...restParams } = params;
    const result: Record<string, any> = {};

    // https://github.com/mockapi-io/docs/wiki/Code-examples#pagination
    result.limit = pagination?.pageSize;
    result.page = pagination?.current;

    // https://github.com/mockapi-io/docs/wiki/Code-examples#filtering
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                result[key] = value;
            }
        });
    }

    // https://github.com/mockapi-io/docs/wiki/Code-examples#sorting
    if (sortField) {
        result.orderby = sortField;
        result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
    }

    // 处理其他参数
    Object.entries(restParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    });

    return result;
};

const View: React.FC = () => {
    const { styles } = useStyle();
    const [data, setData] = useState<PartnerType[]>();
    const [loading, setLoading] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        columns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    const onChange: CheckboxProps['onChange'] = (e) => {
        if (hiddenColumns.includes(e.target.value)) {
            setHiddenColumns(hiddenColumns.filter((item) => item !== e.target.value));
        } else {
            setHiddenColumns([...hiddenColumns, e.target.value]);
        }
    };

    const items: MenuProps['items'] = columns.map((item) => ({
        key: item.key,
        label: (
            <Checkbox
                onChange={onChange}
                checked={!hiddenColumns.includes(item.key as string)}
                value={item.key as string}
            >
                {item.title as string}
            </Checkbox>
        ),
    }));

    const newColumns = columns.map((item) => ({
        ...item,
        hidden: hiddenColumns.includes(item.key as string),
    }));

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 50,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
        },
    });

    const params = toURLSearchParams(getRandomuserParams(tableParams));

    const fetchData = () => {
        setLoading(true);

        fetch(`https://660d2bd96ddfa2943b33731c.mockapi.io/api/users?${params.toString()}`)
            .then((res) => res.json())
            .then((res) => {
                setData(Array.isArray(res) ? res : []);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 100,
                        // 100 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(fetchData, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange: TableProps<PartnerType>['onChange'] = (
        pagination,
        filters,
        sorter
    ) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <Link to="/partners/new">
                <FloatButton
                    type="primary"
                    icon={<PlusOutlined />}
                    tooltip={{
                        title: 'Create new partner',
                        color: 'blue',
                    }}
                ></FloatButton>
            </Link>
            <Link to="/partners/new">
                <Button type="primary" onClick={fetchData}>
                    Create new partner
                </Button>
            </Link>
            <Dropdown menu={{ items }}>
                <Typography.Link>
                    <Space>
                        Columns
                        <DownOutlined />
                    </Space>
                </Typography.Link>
            </Dropdown>
            <Table<PartnerType>
                className={styles.customTable}
                columns={newColumns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                bordered
                scroll={{ y: '80vh', scrollToFirstRowOnChange: true }}
                loading={loading}
                onChange={handleTableChange}
            />
        </>
    );
};

export default View;
