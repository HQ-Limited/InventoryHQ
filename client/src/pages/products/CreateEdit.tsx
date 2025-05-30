import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CheckboxChangeEvent, FormProps } from 'antd';
import { Button, Checkbox, Form, Input, InputNumber, message, Select, TreeSelect } from 'antd';
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
    categories?: number[];
    attributes: {
        id: number; // id of attribute name
        values?: number[]; // id of attribute name + value (from attribute_values table)
    }[];
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

type Attribute = {
    id: number; // id of attribute name
    name: string;
    values?: {
        id: number; // id of attribute name + value (from attribute_values table)
        value: string;
    }[];
};

const CreateEdit: React.FC = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState<SimpleProductType>({
        attributes: [],
        manage_quantity: true,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [attributesOptions, setAttributesOptions] = useState<
        { value: string; label: string; hidden: boolean }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            let product: SimpleProductType = {
                attributes: [],
                manage_quantity: true,
            };
            if (id) {
                try {
                    // TODO Uncomment when API done, mockup data below
                    // const req = await axios.get(`/api/products/${id}`);
                    const req = {
                        status: 200,
                        data: {
                            id: 1,
                            name: 'Product 1',
                            description: 'Description 1',
                            price: 100,
                            quantity: 10,
                            manage_quantity: true,
                            sku: 'sku-1',
                            categories: [1, 2],
                            attributes: [
                                {
                                    id: 1, // Color
                                    values: [1, 2], // Red, Blue
                                },
                            ],
                        },
                    };

                    if (req.status === 200) {
                        product = req.data;
                        setValues(product);
                    } else {
                        navigate('/404');
                    }
                } catch (e) {
                    navigate('/404');
                }
            }

            // Load categories
            try {
                let cats: Category[] = [];

                // TODO Uncomment when API done, mock data below
                // const req = await axios.get('/api/categories');
                const req = {
                    status: 200,
                    data: [
                        {
                            id: 1,
                            name: 'Category 1',
                        },
                        {
                            id: 2,
                            name: 'Category 2',
                        },
                        {
                            id: 3,
                            name: 'Subcategory 1',
                            parent: 2,
                        },
                    ],
                };

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
                                const parent = categories.find((c) => c.id === category.parent)!;

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
                    messageApi.error('Failed to fetch categories');
                }
            } catch (e) {
                messageApi.error('Failed to fetch categories');
            }

            // Load attributes
            try {
                // TODO Uncomment when API done, mock data below
                // Preload values for selected attributes (if any, usualy on edit)
                // const req = await axios.get('/api/attributes', { params: { ids: values.attributes.map(a => a.id) } });
                const req = {
                    data: [
                        {
                            id: 1,
                            name: 'Color',
                            values: [
                                // Returns values for Color since the product we are editing uses the attribute and we need to fill the values in select fields.
                                {
                                    id: 1,
                                    value: 'Red',
                                },
                                {
                                    id: 2,
                                    value: 'Blue',
                                },
                                {
                                    id: 3,
                                    value: 'Green',
                                },
                            ],
                        },
                        {
                            id: 2,
                            name: 'Size',
                        },
                    ],
                    status: 200,
                };

                if (req.status === 200) {
                    const attrs: Attribute[] = req.data;
                    setAttributes(attrs);
                    setAttributesOptions(
                        attrs.map((a) => ({
                            value: a.id.toString(),
                            label: a.name,
                            hidden: false,
                        }))
                    );
                } else {
                    messageApi.error('Failed to fetch attributes');
                }
            } catch (e) {
                messageApi.error('Failed to fetch attributes');
            }

            if (product) {
                form.setFieldsValue(product);

                form.setFieldValue(
                    'attributes',
                    product.attributes.map((a) => a.id.toString())
                );

                product.attributes?.map((a) => {
                    form.setFieldValue(
                        [a.id.toString(), 'values'],
                        a.values?.map((v) => v)
                    );
                });
            }
        };
        fetchData();
    }, []);

    const onManageQuantityChange = (e: CheckboxChangeEvent) => {
        setValues({ ...values, manage_quantity: e.target.checked });
    };

    const onCategoryChange = (value: number[]) => setValues({ ...values, categories: value });

    const onAttributeSelect = (id: string) => {
        // Load all values for selected attribute
        const fetchData = async () => {
            try {
                // Check if attribute wasnt re-added (already has fetched values)
                const exists = attributes.find((a) => a.id === parseInt(id))?.values;

                if (!exists) {
                    // Uncomment when API done
                    // const req = await axios.get(`/api/attributes/${id}/values`);
                    const req = {
                        status: 200,
                        data: [
                            {
                                id: 1,
                                value: 'Red',
                            },
                            {
                                id: 2,
                                value: 'Blue',
                            },
                        ],
                    };

                    if (req.status !== 200) {
                        return message.error('Failed to fetch attribute values');
                    }

                    const values: { id: number; value: string }[] = req.data;
                    // Add all possible values to the attribute
                    setAttributes((prev) => {
                        const newAttrs = prev.map((a) => {
                            if (a.id === parseInt(id)) {
                                a.values = values;
                            }
                            return a;
                        });
                        return newAttrs;
                    });
                }

                // Add attribute to product
                setValues((prev) => {
                    const newValues = {
                        ...prev,
                        attributes: [
                            ...prev.attributes,
                            {
                                id: parseInt(id),
                                values: [],
                            },
                        ],
                    };
                    return newValues;
                });
            } catch (e) {
                message.error('Failed to fetch attribute values');
            }
        };

        fetchData();
    };

    const onAttributeDeselect = (id: string) => {
        // Remove attribute from product
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.filter((a) => a.id !== parseInt(id)),
            };
            return newValues;
        });
    };

    const onAttributeClear = () => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: [],
            };
            return newValues;
        });
    };

    const onAttributeValueSelect = ({ id, parent }: { id: number; parent: number }) => {
        // Add attribute value to product attribute
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.map((a) => {
                    if (a.id === parent) {
                        if (!a.values) a.values = [id];
                        else if (!a.values.includes(id)) a.values = [...a.values, id];
                    }
                    return a;
                }),
            };
            return newValues;
        });
    };

    const onAttributeValueDeselect = ({ id, parent }: { id: number; parent: number }) => {
        // Remove attribute value from product attribute
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.map((a) => {
                    if (a.id === parent) {
                        a.values = a.values!.filter((v) => v !== id);
                    }
                    return a;
                }),
            };
            return newValues;
        });
    };

    const onAttributeValueClear = () => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.map((a) => {
                    a.values = [];
                    return a;
                }),
            };
            return newValues;
        });
    };

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                style={{ padding: '20px' }}
                layout="vertical"
                variant="filled"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                scrollToFirstError
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
                        <InputNumber
                            style={{ width: '100%' }}
                            precision={2}
                            step={0.01}
                            min={0.01}
                        />
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
                        onChange={onCategoryChange}
                    />
                </Form.Item>

                <Form.Item label="Attributes" name="attributes">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="name"
                        onSelect={onAttributeSelect}
                        onDeselect={onAttributeDeselect}
                        onClear={onAttributeClear}
                        options={attributesOptions}
                    />
                </Form.Item>

                {values.attributes &&
                    values.attributes.map((a) => {
                        const attr = attributes.find((o) => o.id === a.id)!;
                        return (
                            <Form.Item key={a.id} label={attr.name} name={[a.id, 'values']}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    placeholder="Select value/s"
                                    optionFilterProp="name"
                                    onSelect={(id) => onAttributeValueSelect({ id, parent: a.id })}
                                    onDeselect={(id) =>
                                        onAttributeValueDeselect({ id, parent: a.id })
                                    }
                                    onClear={() => onAttributeValueClear()}
                                    options={
                                        attr.values!.map((v) => ({
                                            key: v.id,
                                            label: v.value,
                                            value: v.id,
                                        })) || []
                                    }
                                />
                            </Form.Item>
                        );
                    })}

                <Form.Item style={{ textAlign: 'center' }} label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEdit;
