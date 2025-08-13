import React, { ChangeEvent, useEffect, useState } from 'react';
import type { CheckboxProps, GetProp, MenuProps, TableProps } from 'antd';
import {
    App,
    Button,
    Checkbox,
    Input,
    Menu,
    Popconfirm,
    Space,
    Table,
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
import { Customer, CustomerGroup } from '../types/Customer';
import customerService from '../../../services/customerService';
import { TextFilter } from '../../products/View/components/TextFilter';
import { NumberFilter } from '../../products/View/components/NumberFilter';
import customerGroupService from '../../../services/customerGroupService';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const IconTooltip = ({ title, text }: { title: string; text: string | number }) => (
    <>
        <Typography.Text style={{ paddingRight: '5px' }}>{text}</Typography.Text>
        <Tooltip title={title}>
            <InfoCircleOutlined />
        </Tooltip>
    </>
);

const View: React.FC = () => {
    const { message } = App.useApp();
    const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);

    const customerColumns: ColumnsType<Customer> = [
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
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'deliveryAddress',
            title: 'Delivery address',
            dataIndex: 'deliveryAddress',
            sorter: true,
            hidden: true,
            ...TextFilter(),
        },
        {
            width: 100,
            key: 'discount',
            title: 'Discount (%)',
            dataIndex: 'discount',
            sorter: true,
            ...NumberFilter(),
        },
        {
            width: 100,
            key: 'customerGroup',
            title: 'Customer group',
            dataIndex: 'customerGroup',
            render: (_, record) => record.customerGroup?.name || '',
            filters: [
                {
                    id: 0,
                    name: 'Not assigned',
                },
                ...customerGroups,
            ].map((group) => ({
                text: group.name,
                value: group.id,
            })),
        },
        {
            fixed: 'right',
            key: 'action',
            title: 'Action',
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/customers/${record.id}`}>
                        <Tooltip title="Edit" color="blue">
                            <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
                        </Tooltip>
                    </Link>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this customer?"
                        onConfirm={() => onDeleteCustomer(record.id)}
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

    const [data, setData] = useState<Customer[]>();
    const [loading, setLoading] = useState(true);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(
        customerColumns.filter((item) => item?.hidden == true).map((item) => item.key as string)
    );

    const onDeleteCustomer = (id: number) => {
        return new Promise<void>((resolve, reject) => {
            try {
                customerService.deleteCustomer(id).then(() => {
                    setData(data?.filter((customer) => customer.id !== id));
                    message.success('Customer deleted successfully');
                    resolve();
                });
            } catch (e) {
                message.error('Error deleting customer');
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
                            Create Customer
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

    const columnsCheckboxes: MenuProps['items'] = customerColumns.map((item, i) => ({
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

    const newColumns = customerColumns.map((item) => ({
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
            const [customers, customerGroups] = await Promise.all([
                customerService.getCustomers(),
                customerGroupService.getCustomerGroups(),
            ]);
            setData(customers);
            setCustomerGroups(customerGroups);
            return customers;
        };
        try {
            fetchData();
        } catch (error) {
            message.error('Error fetching customers');
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
            <Table<Customer>
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
