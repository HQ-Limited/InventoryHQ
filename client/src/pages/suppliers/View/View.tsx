import React, { ChangeEvent, useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, TableProps } from 'antd';
import { App, Button, Checkbox, Input, Menu, Popconfirm, Space, Table, Tooltip } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { TextFilter } from '../../../components/Table/Filters/TextFilter';
import { Supplier } from '../types/Supplier';
import supplierService from '../../../services/supplier';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const View: React.FC = () => {
    const { message } = App.useApp();

    const supplierColumns: ColumnsType<Supplier> = [
        {
            width: 100,
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'pmr',
            title: 'Person materially responsible (PMR)',
            dataIndex: 'pmr',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'vat',
            title: 'VAT',
            dataIndex: 'vat',
            sorter: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'taxVAT',
            title: 'Tax VAT',
            dataIndex: 'taxVAT',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'phone',
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'address',
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            fixed: 'right',
            key: 'action',
            title: 'Action',
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/suppliers/${record.id}`}>
                        <Tooltip title="Edit" color="blue">
                            <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
                        </Tooltip>
                    </Link>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this supplier?"
                        onConfirm={() => onDeleteSupplier(record.id)}
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

    const [data, setData] = useState<Supplier[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        supplierColumns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    const onDeleteSupplier = (id: number) => {
        return new Promise<void>((resolve, reject) => {
            try {
                supplierService.deleteSupplier(id).then(() => {
                    setData(data?.filter((supplier) => supplier.id !== id));
                    message.success('Supplier deleted successfully');
                    resolve();
                });
            } catch (e) {
                message.error('Error deleting supplier');
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
                            Create Supplier
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

    const columnsCheckboxes: MenuProps['items'] = supplierColumns.map((item, i) => ({
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

    const newColumns = supplierColumns.map((item) => ({
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

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const suppliers = await supplierService.getSuppliers();
            setData(suppliers);
            return suppliers;
        };
        try {
            fetchData();
        } catch (error) {
            message.error('Error fetching suppliers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <>
            <Menu
                mode="horizontal"
                items={TopMenuItems({ columns: columnsCheckboxes })}
                selectable={false}
            />
            <Table<Supplier>
                columns={newColumns}
                rowKey={(record) => record.id}
                dataSource={data}
                size="small"
                sticky
                pagination={tableParams.pagination}
                bordered
                scroll={{ x: 'max-content', scrollToFirstRowOnChange: false }}
                loading={loading}
                // onChange={onTableChange}
            />
        </>
    );
};

export default View;
