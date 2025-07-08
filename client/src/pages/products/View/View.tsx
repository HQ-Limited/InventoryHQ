import React, { ChangeEvent, useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, TableProps } from 'antd';
import {
    App,
    Button,
    Checkbox,
    Input,
    Menu,
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
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    InfoCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import productService from '../../../services/productService';
import { Product, Variation } from '../../../types/ProductTypes';
import { TextFilter } from './components/TextFilter';
import { NumberFilter } from './components/NumberFilter';
import { generateCategoriesTree, Tree } from '../../../utils/generate';
import categoryService from '../../../services/categoryService';
import { LOCATIONS_ENABLED } from '../../../global';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const StatusTag = ({ quantity }: { quantity: number }) => {
    if (quantity > 0) {
        return <Tag color="green">In Stock</Tag>;
    } else {
        return <Tag color="red">Out of Stock</Tag>;
    }
};

const IconTooltip = ({ title, text }: { title: string; text: string | number }) => (
    <>
        <Typography.Text style={{ paddingRight: '5px' }}>{text}</Typography.Text>
        <Tooltip title={title}>
            <InfoCircleOutlined />
        </Tooltip>
    </>
);

const View: React.FC = () => {
    const [categoriesTree, setCategoriesTree] = useState<Tree[]>([]);
    const { message } = App.useApp();

    const variationColumns: ColumnsType<Variation> = [
        {
            width: 100,
            key: 'sku',
            title: 'SKU',
            dataIndex: 'sku',
            ...TextFilter(),
        },
        {
            // responsive: ['md'],
            width: 100,
            key: 'price',
            title: 'Price',
            dataIndex: 'retailPrice',
            ...NumberFilter(),
        },
        {
            width: 100,
            key: 'locations',
            title: 'Quantity',
            render: (_, record) => {
                if (LOCATIONS_ENABLED) {
                    return record.inventoryUnits!.map((unit) => (
                        <Tag key={unit.location.id}>
                            {unit.location.name} ({unit.quantity})
                        </Tag>
                    ));
                }
                return record.inventoryUnits![0].quantity;
            },
        },
        {
            // responsive: ['sm'],
            width: 100,
            key: 'attributes',
            title: 'Attributes',
            render: (_, record) =>
                record.attributes?.map((attr, i) => <Tag key={i}>{attr.value.value}</Tag>),
        },
    ];

    const productColumns: ColumnsType<Product> = [
        {
            width: 100,
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            ...TextFilter(),
        },
        {
            // responsive: ['md'],
            width: 100,
            key: 'sku',
            title: 'SKU',
            render: (_, record) => {
                if (record.isVariable === false) {
                    return record.variations[0].sku;
                } else {
                    return 'N/A';
                }
            },
            ...TextFilter(),
        },
        {
            // responsive: ['md'],
            width: 100,
            key: 'price',
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            render: (_, record) => {
                if (record.isVariable === false) {
                    return record.variations[0].retailPrice;
                } else {
                    return 'N/A';
                }
            },
            ...NumberFilter(),
        },
        {
            width: 100,
            key: 'locations',
            title: 'Quantity',
            render: (_, record) => {
                if (record.manageQuantity === false) return 'Infinite';

                if (record.isVariable === false) {
                    if (LOCATIONS_ENABLED) {
                        return record.variations[0].inventoryUnits!.map((unit) => (
                            <Tag key={unit.location.id}>
                                {unit.location.name} ({unit.quantity})
                            </Tag>
                        ));
                    }
                    return record.variations[0].inventoryUnits![0].quantity;
                } else {
                    return (
                        <IconTooltip
                            title="Sum of all variation quantities"
                            text={record.variations.reduce(
                                (a, b) => a + b.inventoryUnits!.reduce((c, d) => c + d.quantity, 0),
                                0
                            )}
                        />
                    );
                }
            },
        },
        {
            responsive: ['lg'],
            width: 100,
            key: 'attributes',
            title: 'Attributes',
            render: (_, record) => {
                return record.attributes.map((attr, i) => (
                    <Popover
                        key={i}
                        content={attr.values.map((v) => (
                            <Tag style={{ marginLeft: 3, marginRight: 3 }} tabIndex={-1}>
                                {v.value}
                            </Tag>
                        ))}
                    >
                        <Tag key={attr.id}>{attr.name}</Tag>
                    </Popover>
                ));
            },
        },
        {
            responsive: ['lg'],
            width: 100,
            key: 'categories',
            title: 'Categories',
            dataIndex: 'categories',
            filterMode: 'tree',
            filterSearch: true,
            filters: categoriesTree,
            render: (_, record) => {
                if (record.categories) {
                    return (
                        <Space>
                            {record.categories.map((category, i) => (
                                <Link key={i} to={`/categories/${category.id}`}>
                                    {category.name}
                                </Link>
                            ))}
                        </Space>
                    );
                } else {
                    return null;
                }
            },
        },
        {
            fixed: 'right',
            key: 'action',
            title: 'Action',
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/products/${record.id}`}>
                        <Tooltip title="Edit" color="blue">
                            <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
                        </Tooltip>
                    </Link>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this product?"
                        onConfirm={() => onDeleteProduct(record.id)}
                        okText="Yes"
                        okType="danger"
                        cancelText="No"
                        cancelButtonProps={{ type: 'primary' }}
                    >
                        <Tooltip title="Delete" color="red">
                            <Button
                                variant="solid"
                                color="danger"
                                shape="circle"
                                icon={<DeleteOutlined />}
                            ></Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const variationsRowRender = (record: Product, index: number) => (
        <Table<Variation>
            key={index}
            columns={variationColumns}
            rowKey={(record) => {
                return record.id;
            }}
            size="small"
            bordered
            pagination={false}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: false }}
            dataSource={record.variations}
        />
    );

    const [data, setData] = useState<Product[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        productColumns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );
    const onDeleteProduct = (id: number) => {
        return new Promise<void>((resolve, reject) => {
            try {
                productService.deleteProduct(id).then(() => {
                    setData(data?.filter((product) => product.id !== id));
                    message.success('Product deleted successfully');
                    resolve();
                });
            } catch (e) {
                message.error('Error deleting product');
                reject(e);
            }
        });
    };

    function TopMenuItems({ columns }: { columns: MenuProps['items'] }): MenuProps['items'] {
        function onSearch(value: string) {
            if (value === '') return;
            // Apply search logic here
        }
        function onChange(e: ChangeEvent<HTMLInputElement>) {
            if (e.target.value !== '') return;
            // Apply search logic here
        }
        const items: MenuProps['items'] = [
            {
                label: (
                    <Input.Search
                        style={{ paddingTop: '6px' }}
                        placeholder="Search"
                        onSearch={onSearch}
                        onChange={onChange}
                        loading={loading}
                        allowClear
                    />
                ),
                key: 'search',
            },
            {
                label: (
                    <Link to="new">
                        <Button type="primary" icon={<PlusOutlined />}>
                            Create Product
                        </Button>
                    </Link>
                ),
                key: 'create',
            },
            {
                label: 'Columns',
                key: 'columns',
                icon: <DownOutlined />,
                children: columns,
            },
        ];

        return items;
    }

    const onChange: CheckboxProps['onChange'] = (e) => {
        if (hiddenColumns.includes(e.target.value)) {
            return setHiddenColumns(hiddenColumns.filter((item) => item !== e.target.value));
        }
        setHiddenColumns([...hiddenColumns, e.target.value]);
    };

    const columnsCheckboxes: MenuProps['items'] = productColumns.map((item, i) => ({
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

        const fetchCategories = async () => {
            return await categoryService.getCategoriesTree();
        };

        fetchProducts()
            .then((products) => {
                setData(products);
                fetchCategories().then((categories) => {
                    setCategoriesTree(generateCategoriesTree(categories));
                });
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
            <Menu
                mode="horizontal"
                items={TopMenuItems({ columns: columnsCheckboxes })}
                selectable={false}
            />
            <Table<Product>
                columns={newColumns}
                rowKey={(record) => record.id}
                dataSource={data}
                size="small"
                expandable={{
                    expandedRowRender: variationsRowRender,
                    rowExpandable: (record) => record.isVariable,
                }}
                sticky
                pagination={tableParams.pagination}
                bordered
                scroll={{ x: 'max-content', scrollToFirstRowOnChange: false }}
                loading={loading}
                onChange={onTableChange}
            />
        </>
    );
};

export default View;
