import { Button, Form, Space, Table, Input, InputNumber, Typography, Tooltip } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    StarFilled,
    StarOutlined,
} from '@ant-design/icons';
import { useContext, useState } from 'react';
import Column from 'antd/es/table/Column';
import BarcodeField from './BarcodeField';
import AddButtonTable from '../../../../components/AddButtonTable';
import { AnyObject } from 'antd/es/_util/type';
import { UnitOfMeasurement } from '../types/EditProductTypes';
import { Context } from '../Context';

export default function UnitsOfMeasruementTable() {
    const [editingIndex, setEditingIndex] = useState(undefined);
    const form = Form.useFormInstance();
    const baseBarcode = Form.useWatch(['variations', 0, 'barcode']);
    const { isVariable } = useContext(Context);

    function isBase(row: AnyObject) {
        return form.getFieldValue(['unitsOfMeasurement', row.name, 'isBase']);
    }

    function isDefault(row: AnyObject) {
        return form.getFieldValue(['unitsOfMeasurement', row.name, 'isDefault']);
    }

    return (
        <>
            <Typography.Text>Units of measurement</Typography.Text>
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
                            >
                                <Column
                                    dataIndex={'name'}
                                    title={'Name'}
                                    width={150}
                                    render={(_, row) => {
                                        if (isBase(row)) return 'Single';

                                        return (
                                            <>
                                                {editingIndex !== row.name &&
                                                    form.getFieldValue([
                                                        'unitsOfMeasurement',
                                                        row.name,
                                                        'name',
                                                    ])}
                                                <Form.Item
                                                    style={{ marginBottom: 0 }}
                                                    hidden={editingIndex !== row.name}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Unit of measurement name is required',
                                                        },
                                                    ]}
                                                    label=""
                                                    name={[row.name, 'name']}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </>
                                        );
                                    }}
                                />

                                <Column
                                    dataIndex={'abbreviation'}
                                    title={'Abbreviation'}
                                    width={100}
                                    render={(_, row) => {
                                        return (
                                            <>
                                                {editingIndex !== row.name &&
                                                    form.getFieldValue([
                                                        'unitsOfMeasurement',
                                                        row.name,
                                                        'abbreviation',
                                                    ])}
                                                <Form.Item
                                                    style={{ marginBottom: 0 }}
                                                    hidden={editingIndex !== row.name}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Unit of measurement abbreviation is required',
                                                        },
                                                    ]}
                                                    label=""
                                                    name={[row.name, 'abbreviation']}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </>
                                        );
                                    }}
                                />

                                <Column
                                    dataIndex={'barcode'}
                                    title={'Barcode'}
                                    width={100}
                                    render={(_, row) => {
                                        if (isBase(row)) {
                                            if (isVariable) return '';
                                            return baseBarcode;
                                        }

                                        return (
                                            <>
                                                {editingIndex !== row.name &&
                                                    form.getFieldValue([
                                                        'unitsOfMeasurement',
                                                        row.name,
                                                        'barcode',
                                                    ])}
                                                <BarcodeField
                                                    label=""
                                                    name={[row.name]}
                                                    props={{
                                                        hidden: editingIndex !== row.name,
                                                        style: { marginBottom: 0 },
                                                    }}
                                                />
                                            </>
                                        );
                                    }}
                                />

                                <Column
                                    dataIndex={'multiplier'}
                                    title={'Multiplier'}
                                    width={100}
                                    render={(_, row) => {
                                        if (isBase(row)) return 1;

                                        return (
                                            <>
                                                {editingIndex !== row.name &&
                                                    form.getFieldValue([
                                                        'unitsOfMeasurement',
                                                        row.name,
                                                        'multiplier',
                                                    ])}
                                                <Form.Item
                                                    hidden={editingIndex !== row.name}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Unit of measurement multiplier is required',
                                                        },
                                                    ]}
                                                    label=""
                                                    name={[row.name, 'multiplier']}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        min={1}
                                                    />
                                                </Form.Item>
                                            </>
                                        );
                                    }}
                                />

                                <Column
                                    width={100}
                                    title={'Action'}
                                    render={(_, row) => {
                                        return (
                                            <Space size="middle">
                                                <Tooltip
                                                    title={isDefault(row) ? '' : 'Set as default'}
                                                >
                                                    <Button
                                                        onClick={() => {
                                                            if (isDefault(row)) return;
                                                            const unitsOfMeasurement =
                                                                form.getFieldValue(
                                                                    'unitsOfMeasurement'
                                                                );

                                                            // set all isDefault to false
                                                            form.setFieldValue(
                                                                'unitsOfMeasurement',
                                                                unitsOfMeasurement.map(
                                                                    (uom: UnitOfMeasurement) => ({
                                                                        ...uom,
                                                                        isDefault: false,
                                                                    })
                                                                )
                                                            );
                                                            form.setFieldValue(
                                                                [
                                                                    'unitsOfMeasurement',
                                                                    row.name,
                                                                    'isDefault',
                                                                ],
                                                                true
                                                            );
                                                        }}
                                                        icon={
                                                            isDefault(row) ? (
                                                                <StarFilled />
                                                            ) : (
                                                                <StarOutlined />
                                                            )
                                                        }
                                                        variant="solid"
                                                        color={isDefault(row) ? 'gold' : 'default'}
                                                        shape={'circle'}
                                                    />
                                                </Tooltip>
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

                                                {!isBase(row) && (
                                                    <Button
                                                        icon={<DeleteOutlined />}
                                                        shape={'circle'}
                                                        variant="solid"
                                                        color="danger"
                                                        onClick={() => {
                                                            if (isDefault(row)) {
                                                                // Set base unit as default
                                                                form.setFieldValue(
                                                                    [
                                                                        'unitsOfMeasurement',
                                                                        0,
                                                                        'isDefault',
                                                                    ],
                                                                    true
                                                                );
                                                            }
                                                            remove(row.name);
                                                        }}
                                                    />
                                                )}
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
