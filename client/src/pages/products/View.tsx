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
import Card from 'antd/es/card/Card';
import productService from '../../services/productService';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

type VariationType = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity?: number;
    manage_quantity: boolean;
    sku: string;
    images?: string[];
    attribute_id?: {
        id: number;
        name: string;
        value: string;
    }[];
    category_id: {
        id: number;
        name: string;
        image: string;
        parent: number;
    }[];
};

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
            if (record.categories) {
                return (
                    <>
                        {record.categories.map((category, i) => (
                            <>
                                <Link key={i} to={`/categories/${category.id}`}>
                                    {category.name}
                                </Link>
                                <br />
                            </>
                        ))}
                    </>
                );
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
            pageSize: 20,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
        },
    });

    const fetchProducts = async (tableParams = {}) => {
        const products = await productService.getProducts(tableParams);
        return products;
    };

    useEffect(() => {
        setLoading(true);

        fetchProducts()
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const onTableChange: TableProps<VariationType>['onChange'] = (pagination, filters, sorter) => {
        setLoading(true);

        const newTableParams = {
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setTableParams(newTableParams);

        fetchProducts(newTableParams)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch(console.error);

        setLoading(false);
    };

    return (
        <>
            <section className="table-wrapper">
                <Card
                    title={
                        <Space>
                            <Link to="/products/new">
                                <Button type="primary">Create new product</Button>
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
                        scroll={{ y: '50vh', scrollToFirstRowOnChange: false }}
                        loading={loading}
                        onChange={onTableChange}
                    />
                </Card>
            </section>
        </>
    );
};

export default View;
