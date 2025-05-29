import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CheckboxChangeEvent, FormProps } from 'antd';
import { Button, Checkbox, Form, Input, InputNumber, message, TreeSelect } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';

const onFinish: FormProps<SimpleProductType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<SimpleProductType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

type SimpleProductType = {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    manage_quantity: boolean;
    sku?: string;
    categories?: [number];
};

type Category = {
    id: number;
    name: string;
    parent?: number;
};

type CategoriesTree = {
    value: number;
    title: string;
    children: CategoriesTree[];
};

const CreateEdit: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState<SimpleProductType>({
        manage_quantity: true,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const req = await axios.get(`/api/products/${id}`);

                    if (req.status === 200) {
                        const product: SimpleProductType = req.data;
                        setValues(product);
                    } else {
                        navigate('/404');
                    }
                } catch (e) {
                    navigate('/404');
                }
            }

            try {
                let cats: Category[] = [];
                const req = await axios.get('/api/categories');

                if (req.status === 200) {
                    cats = req.data;
                    setCategories(cats);

                    const newTree: CategoriesTree[] = [];

                    cats.map((category) => {
                        if (!category.parent) {
                            // Check if already exists
                            const exists = newTree.find((c) => c.value === category.id);

                            if (!exists)
                                newTree.push({
                                    value: category.id,
                                    title: category.name,
                                    children: [],
                                });
                        } else {
                            // Check if parent exists in categoriesTree
                            const parentExists = newTree.find((c) => c.value === category.parent);
                            if (parentExists) {
                                parentExists.children.push({
                                    value: category.id,
                                    title: category.name,
                                    children: [],
                                });
                            } else {
                                // Create parent first
                                const parent = categories.find((c) => c.id === category.parent);

                                newTree.push({
                                    value: parent.id,
                                    title: parent.name,
                                    children: [
                                        {
                                            value: category.id,
                                            title: category.name,
                                            children: [],
                                        },
                                    ],
                                });
                            }
                        }
                    });
                    setCategoriesTree(newTree);
                } else {
                    message.error('Failed to fetch categories');
                }
            } catch (e) {
                message.error('Failed to fetch categories');
            }
        };
        fetchData();
    }, []);

    const onManageQuantityChange = (e: CheckboxChangeEvent) => {
        setValues({ ...values, manage_quantity: e.target.checked });
    };

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
            <Form.Item<SimpleProductType>
                label="Name"
                name="name"
                rules={[
                    { required: true, message: 'Please enter the name of the product!' },
                    { max: 100 },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<SimpleProductType>
                label="Description"
                name="description"
                rules={[{ max: 1000 }]}
            >
                <TextArea rows={6} />
            </Form.Item>

            <Form.Item<SimpleProductType>
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

            <Form.Item<SimpleProductType> name="manage_quantity" valuePropName="checked">
                <Checkbox onChange={onManageQuantityChange}>Manage quantity</Checkbox>
            </Form.Item>

            {values.manage_quantity && (
                <Form.Item<SimpleProductType>
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
            )}

            <Form.Item<SimpleProductType>
                label="SKU"
                name="sku"
                rules={[{ required: true, message: 'Please enter the SKU!' }, { max: 100 }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<SimpleProductType>
                label="Categories"
                name="categories"
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
                    treeData={categoriesTree}
                />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }} label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEdit;
