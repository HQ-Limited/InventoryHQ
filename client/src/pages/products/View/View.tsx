import React, { ChangeEvent, useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, TableProps } from 'antd';
import { App, Button, Checkbox, Input, Menu, Popconfirm, Popover, Space, Table, Tag } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import productService from '../../../services/productService';
import { TextFilter } from './components/TextFilter';
import { NumberFilter } from './components/NumberFilter';
import { generateAttributesTree, generateCategoriesTree, Tree } from '../../../utils/generate';
import categoryService from '../../../services/categoryService';
import { Product, Variation } from './types/ViewProductTypes';
import attributeService from '../../../services/attributeService';
import { LOCATIONS_ENABLED } from '../../../global';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const QuantityTitle = () => (
    <Popover content="Summary from all units and packages">Quantity</Popover>
);

const View: React.FC = () => {
    const [categoriesTree, setCategoriesTree] = useState<Tree[]>([]);
    const [attributesTree, setAttributesTree] = useState<Tree[]>([]);
    const { message } = App.useApp();

    const [variationColumns, setVariationColumns] = useState<ColumnsType<Variation>>([
        {
            width: 100,
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            ...NumberFilter(),
        },
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
            title: <QuantityTitle />,
            dataIndex: 'inventoryUnits',
            render: (_, record) => {
                const locationQuantities = new Map<string, number>();
                record.inventoryUnits.forEach((unit) => {
                    const currentQuantity = locationQuantities.get(unit.locationName) || 0;
                    locationQuantities.set(unit.locationName, currentQuantity + unit.quantity);
                });

                if (LOCATIONS_ENABLED) {
                    return Array.from(locationQuantities.entries()).map(
                        ([location, quantity], i) => (
                            <Tag key={i}>
                                {location} ({quantity})
                            </Tag>
                        )
                    );
                }
                return Array.from(locationQuantities.values()).reduce(
                    (sum, quantity) => sum + quantity,
                    0
                );
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
                record.attributes?.map((attr, i) => (
                    <Tag key={i}>
                        {attr.name}: {attr.value}
                    </Tag>
                )),
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
            key: 'quantity',
            title: <QuantityTitle />,
            render: (_, record) => {
                const locationQuantities = new Map<string, number>();
                record.variations.forEach((variation) => {
                    variation.inventoryUnits.forEach((unit) => {
                        const currentQuantity = locationQuantities.get(unit.locationName) || 0;
                        locationQuantities.set(unit.locationName, currentQuantity + unit.quantity);
                    });
                });

                if (LOCATIONS_ENABLED) {
                    return Array.from(locationQuantities.entries()).map(
                        ([location, quantity], i) => (
                            <Tag key={i}>
                                {location} ({quantity})
                            </Tag>
                        )
                    );
                }
                return Array.from(locationQuantities.values()).reduce(
                    (sum, quantity) => sum + quantity,
                    0
                );
            },
            ...NumberFilter(),
        },
        {
            responsive: ['lg'],
            width: 100,
            key: 'attributes',
            title: 'Attributes',
            filterMode: 'tree',
            filterSearch: true,
            filters: attributesTree,
            render: (_, record) => {
                return record.attributes?.map((attr, i) => (
                    <Popover
                        key={i}
                        content={attr.values.map((v, vI) => (
                            <Tag key={vI} style={{ marginLeft: 3, marginRight: 3 }} tabIndex={-1}>
                                {v}
                            </Tag>
                        ))}
                    >
                        <Tag>{attr.name}</Tag>
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
                if (!record.categories) return;
                return (
                    <Space>
                        {record.categories.map((category, i) => {
                            return <Tag key={i}>{category.name}</Tag>;
                        })}
                    </Space>
                );
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
                        <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
                    </Link>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this product?"
                        onConfirm={() => onDeleteProduct(record.id)}
                        okText="Yes"
                        okType="danger"
                        cancelButtonProps={{ type: 'primary' }}
                    >
                        <Button
                            variant="solid"
                            color="danger"
                            shape="circle"
                            icon={<DeleteOutlined />}
                        ></Button>
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

    const variationsRowRender = (record: Product, index: number) => (
        <Table<Variation>
            key={index}
            columns={variationColumns}
            rowKey={(record) => {
                return record.id;
            }}
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
            const categories = await categoryService.getCategoriesTree();
            setCategoriesTree(generateCategoriesTree(categories));
        };

        const fetchAttributes = async () => {
            const attributes = await attributeService.getAttributes({ includeValues: true });
            setAttributesTree(generateAttributesTree(attributes));
        };

        fetchProducts()
            .then((products) => {
                setData(products);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
        fetchCategories();
        fetchAttributes();
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

        console.log({ filters });

        const dataRequest = {
            pagination,
            filters: filterDescriptors,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        };

        setTableParams(newTableParams);

        // TODO: Add OData query parameters

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
