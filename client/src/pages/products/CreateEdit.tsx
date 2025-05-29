import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CheckboxChangeEvent, FormProps } from 'antd';
import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Segmented,
    Select,
    Tabs,
    TreeSelect,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { AttributeType, VariationType } from './common';

type SimpleProductType = VariationType;

type VariableProductType = {
    id: number;
    name: string;
    description: string;
    category_id: [CategoryType];
    images: [string];
    variatons: [CommonProductProperties];
};

const onFinish: FormProps<PartnerType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<PartnerType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const categories = [
    {
        value: 'parent 1',
        title: 'parent 1',
        children: [
            {
                value: 'parent 1-0',
                title: 'parent 1-0',
                children: [
                    {
                        value: 'leaf1',
                        title: 'my leaf',
                    },
                    {
                        value: 'leaf2',
                        title: 'your leaf',
                    },
                ],
            },
            {
                value: 'parent 1-1',
                title: 'parent 1-1',
                children: [
                    {
                        value: 'sss',
                        title: <b style={{ color: '#08c' }}>sss</b>,
                    },
                ],
            },
        ],
    },
];

const generalTabsChildren = (
    <>
        <Form.Item<VariationType>
            label="Price"
            name="price"
            rules={[
                {
                    required: true,
                    message: 'Please enter the price!',
                },
                {
                    validator: (_, value) => {
                        if (value <= 0) {
                            return Promise.reject('Price must be greater than 0!');
                        }
                        return Promise.resolve();
                    },
                },
            ]}
        >
            <InputNumber style={{ width: '100%' }} precision={2} step={0.01} min={0.01} />
        </Form.Item>

        <Form.Item<VariationType> name="manage_quantity" valuePropName="checked">
            <Checkbox>Manage quantity</Checkbox>
        </Form.Item>

        <Form.Item<VariationType>
            label="Quantity"
            name="quantity"
            rules={[
                {
                    required: true,
                    message: 'Please enter the quantity!',
                },
                {
                    validator: (_, value) => {
                        if (value <= 0) {
                            return Promise.reject('Quantity must be greater than 0!');
                        }
                        return Promise.resolve();
                    },
                },
            ]}
        >
            <InputNumber style={{ width: '100%' }} precision={2} step={0.01} min={0.01} />
        </Form.Item>
    </>
);
/* 
const AttributeInput = (attribute: Attribute, variations: boolean) => {
    return (
        <>
            <Form.Item<AttributeType>
                label={attribute.name}
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please select at least one value!',
                    },
                ]}
            >
                <Select>
                    {attribute.values.map((value) => (
                        <Select.Option value={value}>{value}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            {variations && (
                <Form.Item name="variation" valuePropName="checked">
                    <Checkbox>Use as variation</Checkbox>
                </Form.Item>
            )}
        </>
    );
}; */

const CreateEdit: React.FC = () => {
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState({
        manage_quantity: true,
    });
    const [productType, setProductType] = useState('simple');

    const simpleTabs = [
        {
            label: 'General',
            key: 'general',
            children: generalTabsChildren,
        },
    ];

    const variableTabs = [
        {
            label: 'General',
            key: 'general',
            children: <div>gen</div>,
        },
        {
            label: 'Attributes',
            key: 'attributes',
            children: <div>attr</div>,
        },
    ];

    const [tabs, setProductTabs] = useState(
        productType ? (productType == 'simple' ? simpleTabs : variableTabs) : []
    );

    const onProductTypeChange = (value: string) => {
        setProductType(value);
        setProductTabs(value === 'simple' ? simpleTabs : variableTabs);
    };

    // Get all categories from '/api/categories'
    // Get all attributes from '/api/attributes'

    return (
        <Form
            style={{ padding: '20px' }}
            layout="vertical"
            variant="filled"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            scrollToFirstError
            initialValues={values}
        >
            <Form.Item<PartnerType>
                label="Name"
                name="name"
                rules={[
                    { required: true, message: 'Please enter the name of the product!' },
                    { max: 100 },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<PartnerType> label="Description" name="description" rules={[{ max: 1000 }]}>
                <TextArea rows={6} />
            </Form.Item>

            <Form.Item<PartnerType>
                label="Categories"
                name="category_id"
                rules={[{ required: true, message: 'Please select atleast one category!' }]}
            >
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    styles={{
                        popup: { root: { maxHeight: 400, overflow: 'auto' } },
                    }}
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    treeData={categories}
                />
            </Form.Item>

            <Form.Item<PartnerType>
                label="Type"
                name="type"
                initialValue={productType}
                rules={[{ required: true, message: 'Please select a type!' }]}
            >
                <Select onChange={onProductTypeChange}>
                    <Select.Option value="simple">Simple</Select.Option>
                    <Select.Option value="variable">Variable</Select.Option>
                </Select>
            </Form.Item>

            <Tabs tabPosition="left" items={tabs} />

            <Form.Item style={{ textAlign: 'center' }} label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEdit;
