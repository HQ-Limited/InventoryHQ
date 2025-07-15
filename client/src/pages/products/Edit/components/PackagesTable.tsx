import { Button, Form, Modal, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Package } from '../types/EditProductTypes';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const columns: ColumnsType<Package> = [
    {
        width: 100,
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
    },
    {
        width: 100,
        key: 'location',
        title: 'Location',
        dataIndex: ['location', 'name'],
        sorter: true,
    },
    {
        width: 100,
        key: 'label',
        title: 'Label',
        dataIndex: 'label',
        sorter: true,
    },
    {
        width: 100,
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
        sorter: true,
    },
    {
        width: 100,
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
    },
    {
        width: 100,
        key: 'inventoryUnits',
        title: 'Contents',
        dataIndex: 'inventoryUnits',
        render: (_, record) => {
            return record.inventoryUnits.map((unit) => (
                <Tag key={unit.id}>
                    {unit.variation.sku} ({unit.quantity})
                </Tag>
            ));
        },
    },
    {
        fixed: 'right',
        key: 'action',
        title: 'Action',
        width: 100,
        render: (_, record) => (
            <Space size="middle">
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete this package?"
                    // onConfirm={() => onDeleteProduct(record.id)}
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

export default function PackagesTable() {
    const packages = Form.useWatch('packages', Form.useFormInstance());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Form.List name="packages">
            {(fields, { add, remove }) => (
                <>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Add Packages
                    </Button>

                    <Modal
                        title="Add Packages"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        centered
                    >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>

                    <Table rowKey="id" columns={columns} dataSource={packages} pagination={false} />
                </>
            )}
        </Form.List>
    );
}
