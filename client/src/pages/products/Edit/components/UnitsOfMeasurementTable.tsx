import { Button, Empty, Form, Space, Table, Input, InputNumber, Typography, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import BarcodeField from './BarcodeField';
import AddButtonTable from '../../../../components/AddButtonTable';

export default function UnitsOfMeasruementTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();

    return (
        <>
            <Typography.Text>Packaging types</Typography.Text>
            <Tooltip
                title='Used to group units. For example, if you have a
                product that is sold in boxes of 12, you can create a packaging type called "Box"
                and set the multiplier to 12. Next time you restock/sell the product, you can select
                "Box" and the quantity will be automatically multiplied by 12.'
            >
                <InfoCircleOutlined style={{ marginLeft: 5 }} />
            </Tooltip>

            <Form.List name="unitsOfMeasurement">
                {(uoms, { add, remove }) => {
                    return (
                        <>
                            <Table
                                style={{ marginTop: 10 }}
                                dataSource={uoms}
                                pagination={false}
                                size="small"
                                sticky
                                bordered
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="This product has no units of measurement"
                                        ></Empty>
                                    ),
                                }}
                            >
                                <Column
                                    dataIndex={'name'}
                                    title={'Name'}
                                    width={150}
                                    render={(_, row) => {
                                        if (editingIndex !== row.name)
                                            return form.getFieldValue([
                                                'unitsOfMeasurement',
                                                row.name,
                                                'name',
                                            ]);
                                        return (
                                            <Form.Item label="" name={[row.name, 'name']}>
                                                <Input />
                                            </Form.Item>
                                        );
                                    }}
                                />

                                <Column
                                    dataIndex={'abbreviation'}
                                    title={'Abbreviation'}
                                    width={100}
                                    render={(_, row) => {
                                        if (editingIndex !== row.name)
                                            return form.getFieldValue([
                                                'unitsOfMeasurement',
                                                row.name,
                                                'abbreviation',
                                            ]);
                                        return (
                                            <Form.Item label="" name={[row.name, 'abbreviation']}>
                                                <Input />
                                            </Form.Item>
                                        );
                                    }}
                                />

                                <Column
                                    dataIndex={'barcode'}
                                    title={'Barcode'}
                                    width={100}
                                    render={(_, row) => {
                                        if (editingIndex !== row.name)
                                            return form.getFieldValue([
                                                'unitsOfMeasurement',
                                                row.name,
                                                'barcode',
                                            ]);
                                        return <BarcodeField label="" name={[row.name]} />;
                                    }}
                                />

                                <Column
                                    dataIndex={'multiplier'}
                                    title={'Multiplier'}
                                    width={100}
                                    render={(_, row) => {
                                        if (editingIndex !== row.name)
                                            return form.getFieldValue([
                                                'unitsOfMeasurement',
                                                row.name,
                                                'multiplier',
                                            ]);
                                        return (
                                            <Form.Item label="" name={[row.name, 'multiplier']}>
                                                <InputNumber style={{ width: '100%' }} min={1} />
                                            </Form.Item>
                                        );
                                    }}
                                />

                                <Column
                                    width={100}
                                    title={'Action'}
                                    render={(_, row) => {
                                        return (
                                            <Space size="middle">
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
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    shape={'circle'}
                                                    variant="solid"
                                                    color="danger"
                                                    onClick={() => remove(row.name)}
                                                />
                                            </Space>
                                        );
                                    }}
                                />
                            </Table>
                            <AddButtonTable onClick={() => add()} />
                        </>
                    );
                }}
            </Form.List>
        </>
    );
}
