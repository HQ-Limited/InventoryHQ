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
import { VariationType } from './common';
import Card from 'antd/es/card/Card';

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

const columns: ColumnsType<VariationType> = [
    {
        key: 'image',
        title: 'Image',
        dataIndex: 'image',
        render: (_, record) => {
            if (record.images) {
                if (typeof record.images == 'string') record.images = [record.images]; // TODO Remove this when backend API implemented. Since mockupapi returns only 1 string, instead of an array
                return (
                    <img
                        src={record.images.length > 0 ? record.images[0] : ''}
                        width="100"
                        height="100"
                    />
                );
            } else {
                return null;
            }
        },
    },
    {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
    },
    {
        key: 'sku',
        title: 'SKU',
        dataIndex: 'sku',
    },
    {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
    },
    {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
        sorter: true,
    },
    {
        key: 'categories',
        title: 'Categories',
        dataIndex: 'categories',
        render: (_, record) => {
            if (record.category_id) {
                if (typeof record.category_id == 'string')
                    record.category_id = [record.category_id]; // TODO Remove this when backend API implemented. Since mockupapi returns only 1 string, instead of an array
                return record.category_id.map((category) => (
                    <Link to={`/categories/${category}`}>{category}</Link>
                ));

                return record.category_id.map((category) => {
                    <Link to={`/categories/${category.id}`}>{category.name}</Link>;
                });
            } else {
                return null;
            }
        },
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        filters: [
            { text: 'In Stock', value: 'instock' },
            { text: 'Out of Stock', value: 'outofstock' },
        ],
        render: (_, record) => {
            if (record.quantity > 0) {
                return 'In Stock';
            } else {
                return 'Out of Stock';
            }
        },
    },
    {
        key: 'action',
        title: 'Action',
        render: (_, record) => (
            <Space size="middle">
                <Link to={`/products/${record.id}`}>
                    <Button type="primary">Edit</Button>
                </Link>
                <Popconfirm
                    title="Confirmation"
                    description="Are you sure you want to delete this record?"
                    onConfirm={confirm}
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

    result.limit = pagination?.pageSize;
    result.page = pagination?.current;

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                result[key] = value;
            }
        });
    }

    if (sortField) {
        result.orderby = sortField;
        result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
    }

    Object.entries(restParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    });

    return result;
};

const View: React.FC = () => {
    const { styles } = useStyle();
    const [data, setData] = useState<VariationType[]>();
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
        console.log(tableParams);
        fetch(`https://683833182c55e01d184c6087.mockapi.io/api/products?${params.toString()}`)
            .then((res) => res.json())
            .then((res) => {
                setData(Array.isArray(res) ? res : []);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 100,
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

    const handleTableChange: TableProps<VariationType>['onChange'] = (
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

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <section className="table-wrapper">
                <Card
                    title={
                        <Space>
                            <Link to="/products/new">
                                <FloatButton
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    tooltip={{
                                        title: 'Create new product',
                                        color: 'blue',
                                    }}
                                ></FloatButton>
                            </Link>
                            <Link to="/products/new">
                                <Button type="primary" onClick={fetchData}>
                                    Create new product
                                </Button>
                            </Link>
                            <Dropdown menu={{ items }}>
                                <Button type="primary">
                                    <Space>
                                        Columns
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    }
                >
                    <Table<VariationType>
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
                </Card>
            </section>
        </>
    );
};

export default View;
