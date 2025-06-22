import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import type {
    CheckboxProps,
    GetProp,
    InputRef,
    MenuProps,
    PopconfirmProps,
    TableColumnType,
    TableProps,
} from 'antd';
import {
    Button,
    Checkbox,
    Input,
    Menu,
    message,
    Popconfirm,
    Popover,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { DownOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import productService from '../../../services/productService';
import { Product, Variation } from '../../../types/ProductTypes';

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

const StatusTag = ({ quantity }: { quantity: number }) => {
    if (quantity > 0) {
        return <Tag color="green">In Stock</Tag>;
    } else {
        return <Tag color="red">Out of Stock</Tag>;
    }
};

const View: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    type DataIndex = keyof Product;
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const textSearch = (dataIndex: DataIndex): TableColumnType<Product> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input.Search
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                        if (e.target.value === '' && clearFilters) {
                            handleReset(clearFilters);
                            return handleSearch(selectedKeys as string[], confirm, dataIndex);
                        }
                    }}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    onSearch={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    loading={loading}
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
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });

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
            render: (_, record) =>
                record.attributes.map((attr, i) => <Tag key={i}>{attr.value.value}</Tag>),
        },
        {
            key: 'status',
            title: 'Status',
            filters: [
                { text: 'In Stock', value: 'instock' },
                { text: 'Out of Stock', value: 'outofstock' },
            ],
            render: (_, record) => <StatusTag quantity={record.quantity} />,
        },
    ];

    const productColumns: ColumnsType<Product> = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            ...textSearch('name'),
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
            key: 'categories',
            title: 'Categories',
            dataIndex: 'categories',
            render: (_, record) => {
                if (record.categories) {
                    return record.categories.map((category, i) => (
                        <Link
                            style={{ display: 'block' }}
                            key={i}
                            to={`/categories/${category.id}`}
                        >
                            {category.name}
                        </Link>
                    ));
                } else {
                    return null;
                }
            },
        },
        {
            key: 'status',
            title: 'Status',
            filters: [
                { text: 'In Stock', value: 'instock' },
                { text: 'Out of Stock', value: 'outofstock' },
            ],
            render: (_, record) => (
                <StatusTag quantity={record.variations.reduce((a, b) => a + b.quantity, 0)} />
            ),
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

    const expandedRowRender = (record: Product, index: number) => (
        <Table<Variation>
            columns={variationColumns}
            rowKey={index.toString()}
            size="small"
            bordered={true}
            dataSource={record.variations}
            pagination={false}
        />
    );

    const [data, setData] = useState<Product[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        productColumns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    function TopMenuItems({ columns }: { columns: MenuProps['items'] }): MenuProps['items'] {
        function onSearch(value: string) {
            if (value === '') return;
            // Apply search logic here
            console.log({ value });
        }
        function onChange(e: ChangeEvent<HTMLInputElement>) {
            if (e.target.value !== '') return;
            // Apply search logic here
            console.log('clear field');
        }
        const items: MenuProps['items'] = [
            {
                label: (
                    <Input.Search
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
                label: <Link to="new">Create Product</Link>,
                key: 'create',
                icon: <PlusOutlined />,
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
            <Menu
                mode="horizontal"
                items={TopMenuItems({ columns: columnsCheckboxes })}
                selectable={false}
            />
            <section className="table-wrapper">
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
