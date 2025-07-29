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
import {
    Product,
    VariableProduct,
    Variation,
    isSimpleProduct,
    isVariableProduct,
} from './types/ViewProductTypes';
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

    const [variationColumns, setVariationColumns] = useState<ColumnsType<Variation>>([
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
            key: 'quantity',
            title: 'Quantity',
            dataIndex: 'inventoryUnits',
            render: (_, record) => {
                if (LOCATIONS_ENABLED) {
                    //TODO: Display the sum of all locations quantities and on hover, display a popup with the quantity of each location
                    return record.inventoryUnits!.map((unit) => (
                        <Tag key={unit.location.id}>
                            {unit.location.name} ({unit.quantity})
                        </Tag>
                    ));
                }
                return record.inventoryUnits!.reduce((sum, unit) => sum + unit.quantity, 0);
            },
            ...NumberFilter(),
        },
        {
            // responsive: ['sm'],
            width: 100,
            key: 'attributes',
            title: 'Attributes',
            dataIndex: 'attributes',
            render: (_, record) =>
                record.attributes?.map((attr, i) => <Tag key={i}>{attr.value}</Tag>),
        },
    ]);

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
                // check if record is simple product type or variable product type
                if (isSimpleProduct(record)) {
                    return record.sku;
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
            dataIndex: 'retailPrice',
            sorter: true,
            render: (_, record) => {
                if (isSimpleProduct(record)) {
                    return record.retailPrice;
                } else {
                    return 'N/A';
                }
            },
            ...NumberFilter(),
        },
        {
            width: 100,
            key: 'quantity',
            title: 'Quantity',
            render: (_, record) => {
                if (record.manageQuantity === false) return 'Infinite';

                if (isSimpleProduct(record)) {
                    if (LOCATIONS_ENABLED) {
                        //TODO: Display the sum of all locations quantities and on hover, display a popup with the quantity of each location

                        return record.quantity.map((qty, index) => (
                            <Tag key={index}>
                                {qty.locationName} ({qty.quantity})
                            </Tag>
                        ));
                    }
                    return record.quantity.reduce((sum, qty) => sum + qty.quantity, 0);
                } else {
                    //TODO: Display the sum of all locations quantities and on hover, display a popup with the quantity of each location
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
            ...NumberFilter(),
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
                                {v}
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
                                // TODO: Possibly make it so if you click on a category, it will filter the products by that category
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

    const onVariationTableChange = (pagination, filters, sorter, product: Product) => {
        setLoading(true);

        const filterDescriptors = convertFiltersToDescriptors(filters);

        const newTableParams = {
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        const dataRequest = {
            pagination,
            filters: filterDescriptors,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setVariationTableParams(newTableParams);

        async function fetchVariations(dataRequest: any) {
            return await productService.getVariations(product.id, dataRequest);
        }

        fetchVariations(dataRequest)
            .then((variations: Variation[]) => {
                // find the product in data and replace the variations with the new variations
                const newData = data?.map((product) => {
                    if (product.id === product.id) {
                        return { ...product, variations: variations };
                    }
                    return product;
                });
                setData(newData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const variationsRowRender = (record: VariableProduct, index: number) => (
        <Table<Variation>
            key={index}
            columns={variationColumns}
            rowKey={(record) => record.id}
            size="small"
            bordered
            pagination={variationTableParams.pagination}
            onChange={(pagination, filters, sorter) =>
                onVariationTableChange(pagination, filters, sorter, record)
            }
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

    const [variationTableParams, setVariationTableParams] = useState<TableParams>({
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

    function convertFiltersToDescriptors(data) {
        const descriptors = [];

        for (const [field, filters] of Object.entries(data)) {
            if (Array.isArray(filters)) {
                if (
                    typeof filters[0] === 'object' &&
                    filters[0] !== null &&
                    'operator' in filters[0]
                ) {
                    for (const f of filters) {
                        descriptors.push({
                            fieldName: field,
                            value: f.input,
                            operator: f.operator,
                        });
                    }
                } else {
                    // Simple array of values, assume equality
                    for (const val of filters) {
                        descriptors.push({
                            fieldName: field,
                            value: val,
                            operator: 'eq',
                        });
                    }
                }
            }
        }

        return descriptors;
    }

    const onTableChange: TableProps<Product>['onChange'] = (pagination, filters, sorter) => {
        setLoading(true);

        const filterDescriptors = convertFiltersToDescriptors(filters);

        const newTableParams = {
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setVariationColumns(
            variationColumns?.map((col) => ({
                ...col,
                filteredValue: filters[col.dataIndex as string],
            }))
        );

        const dataRequest = {
            pagination,
            filters: filterDescriptors,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setTableParams(newTableParams);

        fetchProducts(dataRequest)
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
                    expandedRowRender: (record, index) =>
                        variationsRowRender(record as VariableProduct, index),
                    rowExpandable: (record) => isVariableProduct(record),
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
