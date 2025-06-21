import React, { useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, PopconfirmProps, TableProps } from 'antd';
import {
    Badge,
    Button,
    Checkbox,
    Dropdown,
    Flex,
    message,
    Popconfirm,
    Popover,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import { Product, Variation } from '../../types/ProductTypes';

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

// id: number;
// price: number;
// wholesalePrice?: number;
// quantity: number;
// manage_quantity: boolean;
// sku: string;
// attributes: VariationAttributeType[];

const variationColumns: ColumnsType<Variation> = [
    {
        key: 'sku',
        title: 'SKU',
        dataIndex: 'sku',
    },
    {
        key: 'price',
        title: 'Price',
        dataIndex: 'retailPrice',
    },
    {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
    },
    {
        key: 'attributes',
        title: 'Attributes',
        render: (_, record) => {
            return (
                <>
                    {record.attributes.map((attr, i) => {
                        return (
                            <>
                                <Tag>{attr.value.value}</Tag>
                            </>
                        );
                    })}
                </>
            );
        },
    },
];

const productColumns: ColumnsType<Product> = [
    {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
    },
    {
        key: 'sku',
        title: 'SKU',
        render: (_, record) => {
            if (record.variations.length === 1) {
                return record.variations[0].sku;
            } else {
                return 'N/A';
            }
        },
    },
    {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
        render: (_, record) => {
            if (record.variations.length === 1) {
                return record.variations[0].retailPrice;
            } else {
                return 'N/A';
            }
        },
    },
    {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
        sorter: true,
        render: (_, record) => {
            if (record.variations.length === 1) {
                return record.variations[0].quantity;
            } else {
                return (
                    <>
                        <Typography.Text style={{ paddingRight: '5px' }}>
                            {record.variations.reduce((a, b) => a + b.quantity, 0)}
                        </Typography.Text>
                        <Tooltip title="Sum of all variations quantities">
                            <InfoCircleOutlined />
                        </Tooltip>
                    </>
                );
            }
        },
    },
    {
        key: 'attributes',
        title: 'Attributes',
        responsive: ['sm'],
        render: (_, record) => {
            return (
                <>
                    {record.attributes.map((attr, i) => {
                        return (
                            <>
                                <Popover
                                    key={i}
                                    content={attr.value.map((v) => (
                                        <Tag
                                            style={{ marginLeft: 3, marginRight: 3 }}
                                            tabIndex={-1}
                                        >
                                            {v.value}
                                        </Tag>
                                    ))}
                                >
                                    <Tag key={attr.id}>{attr.name}</Tag>
                                </Popover>
                            </>
                        );
                    })}
                </>
            );
        },
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

const expandedRowRender = (record: Product, index) => (
    <>
        <Table<Variation>
            columns={variationColumns}
            rowKey={index}
            size="small"
            bordered={true}
            dataSource={record.variations}
            pagination={false}
        />
    </>
);

const View: React.FC = () => {
    const [data, setData] = useState<Product[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        productColumns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    const onChange: CheckboxProps['onChange'] = (e) => {
        if (hiddenColumns.includes(e.target.value)) {
            return setHiddenColumns(hiddenColumns.filter((item) => item !== e.target.value));
        }
        setHiddenColumns([...hiddenColumns, e.target.value]);
    };

    const items: MenuProps['items'] = productColumns.map((item, i) => ({
        key: i,
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

    const newColumns = productColumns.map((item) => ({
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
        return await productService.getProducts(tableParams);
    };

    useEffect(() => {
        setLoading(true);

        fetchProducts()
            .then((products) => {
                setData(products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const onTableChange: TableProps<Product>['onChange'] = (pagination, filters, sorter) => {
        setLoading(true);

        const newTableParams = {
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setTableParams(newTableParams);

        fetchProducts(newTableParams)
            .then((products) => {
                setData(products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    return (
        <>
            <section className="table-wrapper">
                <Space style={{ paddingBottom: '1rem' }}>
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

                <Table<Product>
                    columns={newColumns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    size="small"
                    expandable={{
                        expandedRowRender,
                        rowExpandable: (record) => record.variations.length > 1,
                    }}
                    pagination={tableParams.pagination}
                    bordered
                    scroll={{ y: '50vh', scrollToFirstRowOnChange: false }}
                    loading={loading}
                    onChange={onTableChange}
                />
            </section>
        </>
    );
};

export default View;
