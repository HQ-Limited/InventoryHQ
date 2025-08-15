import { Button, Form, Table, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import { QuantityInputField } from './QuantityField';

export default function QuantityTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();

    return (
        <Form.List name={['variations', 0, 'inventoryUnits']}>
            {(inventoryUnits) => {
                return (
                    <>
                        <Table
                            style={{ marginTop: 10, marginBottom: 20 }}
                            dataSource={inventoryUnits}
                            pagination={false}
                            size="small"
                            sticky
                            bordered
                        >
                            <Column
                                dataIndex={'location'}
                                title={'Location'}
                                render={(_, row) => {
                                    const location = form.getFieldValue([
                                        'variations',
                                        0,
                                        'inventoryUnits',
                                        row.name,
                                        'location',
                                    ]);
                                    return location.name;
                                }}
                            />

                            <Column
                                dataIndex={'quantity'}
                                title={'Quantity'}
                                render={(_, row) => {
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                form.getFieldValue([
                                                    'variations',
                                                    0,
                                                    'inventoryUnits',
                                                    row.name,
                                                    'quantity',
                                                ])}
                                            <QuantityInputField
                                                props={{
                                                    style: { marginBottom: 0 },
                                                    hidden: editingIndex !== row.name,
                                                }}
                                                name={[row.name]}
                                                label=""
                                            />
                                        </>
                                    );
                                }}
                            />

                            <Column
                                dataIndex={'minStock'}
                                title={'Min. Stock'}
                                render={(_, row) => {
                                    return (
                                        <>
                                            {editingIndex !== row.name &&
                                                form.getFieldValue([
                                                    'variations',
                                                    0,
                                                    'inventoryUnits',
                                                    row.name,
                                                    'minStock',
                                                ])}
                                            <Form.Item
                                                style={{ marginBottom: 0 }}
                                                hidden={editingIndex !== row.name}
                                                label=""
                                                name={[row.name, 'minStock']}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </>
                                    );
                                }}
                            />

                            <Column
                                title={'Action'}
                                width={100}
                                align="center"
                                render={(_, row) => {
                                    return (
                                        <Button
                                            icon={<EditOutlined />}
                                            variant="solid"
                                            color="primary"
                                            shape={'circle'}
                                            onClick={() =>
                                                editingIndex === row.name
                                                    ? setEditingIndex(undefined)
                                                    : setEditingIndex(row.name)
                                            }
                                        />
                                    );
                                }}
                            />
                        </Table>
                    </>
                );
            }}
        </Form.List>
    );
}
