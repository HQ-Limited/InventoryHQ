import React, { useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, PopconfirmProps, TableProps } from 'antd';
import {
    Button,
    Checkbox,
    Dropdown,
    message,
    Popconfirm,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { createStyles } from 'antd-style';
import { Link } from 'react-router-dom';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import { SimpleProductType, VariableProductType, Variation } from '../../types/ProductTypes';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

type Product =
    | (SimpleProductType & { type: 'Simple' })
    | (VariableProductType & { type: 'Variable' });

const confirm: PopconfirmProps['onConfirm'] = (e) => {
    message.success('Click on Yes');
};

function productType(product: Product) {
    if ('quantity' in product) return 'Simple';
    return 'Variable';
}

const columns: ColumnsType<Product> = [
    /* {
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
    }, */
    {
        key: 'type',
        title: 'Type',
        sorter: true,
        filters: [
            { text: 'Simple', value: 'simple' },
            { text: 'Variable', value: 'variable' },
        ],
        render: (_, record) => record.type,
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
        render: (_, record) => {
            if ('manage_quantity' in record && record.manage_quantity == false)
                return (
                    <>
                        <Typography.Text style={{ paddingRight: '5px' }}>∞</Typography.Text>
                        <Tooltip title="Manage quantity is turned off">
                            <InfoCircleOutlined />
                        </Tooltip>
                    </>
                );
            if ('quantity' in record) return record.quantity;
            else if (record.type == 'Variable')
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
        render: (_, record) => {
            if ('quantity' in record) {
                return record.quantity > 0 ? 'In Stock' : 'Out of Stock';
            } else {
                return record.variations.some((variation) => variation.quantity > 0)
                    ? 'In Stock'
                    : 'Out of Stock';
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
    const [data, setData] = useState<Product[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        columns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    const onChange: CheckboxProps['onChange'] = (e) => {
        if (hiddenColumns.includes(e.target.value)) {
            return setHiddenColumns(hiddenColumns.filter((item) => item !== e.target.value));
        }
        setHiddenColumns([...hiddenColumns, e.target.value]);
    };

    const items: MenuProps['items'] = columns.map((item, i) => ({
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
        let products = await productService.getProducts(tableParams);
        products = products.map((product) => {
            return {
                ...product,
                type: productType(product),
                children:
                    productType(product) === 'Variable'
                        ? product.variations.map((variation: Variation) => {
                              return { ...variation, type: 'Variation' };
                          })
                        : null,
            };
        });
        return products;
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
                    className={styles.customTable}
                    columns={newColumns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    /* expandable={{
                        rowExpandable: (record) => productType(record) === 'variable',
                        expandedRowRender
                    }} */
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
