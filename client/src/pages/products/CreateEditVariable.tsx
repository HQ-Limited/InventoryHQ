import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CheckboxChangeEvent, FormProps } from 'antd';
import { Button, Checkbox, Form, Input, InputNumber, message, Select, TreeSelect } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { WHOLESALE_ENABLED } from '../../global';
import { Attribute, CategoriesTree, Category, VariableProductType } from './common';
import AttributesField from './components/AttributesField';
import AttributeValuesField from './components/AttributeValuesField';
const onFinish: FormProps<VariableProductType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<VariableProductType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CreateEdit: React.FC = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [values, setValues] = useState<VariableProductType>({
        attributes: [],
        variations: [],
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [attributesOptions, setAttributesOptions] = useState<
        { value: string; label: string; hidden: boolean }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            let product: VariableProductType = {
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
                            wholesalePrice: 70,
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

    const onAttributeSelect = (id: number) => {
        // Load all values for selected attribute
        const fetchData = async () => {
            try {
                // Check if attribute wasnt re-added (already has fetched values)
                const exists = attributes.find((a) => a.id === id)?.values;

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
                            if (a.id === id) {
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
                                id,
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

    const onAttributeDeselect = (id: number) => {
        // Remove attribute from product
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.filter((a) => a.id !== id),
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

    const onIsVariationalChange = ({ id, value }: { id: number; value: boolean }) => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: prev.attributes.map((a) => {
                    if (a.id === id) {
                        a.isVariational = value;
                    }
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
                <Form.Item<VariableProductType>
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please enter the name of the product!' },
                        { max: 100 },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<VariableProductType>
                    label="Description"
                    name="description"
                    rules={[{ max: 1000 }]}
                >
                    <TextArea rows={6} />
                </Form.Item>

                <Form.Item<VariableProductType>
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

                <AttributesField
                    onSelect={onAttributeSelect}
                    onDeselect={onAttributeDeselect}
                    onClear={onAttributeClear}
                    options={attributesOptions}
                    selected={values.attributes?.map((a) => a.id)}
                />

                {values.attributes &&
                    values.attributes.map((a) => {
                        const attr = attributes.find((o) => o.id === a.id)!;
                        return (
                            <AttributeValuesField
                                showVariationCheckbox
                                key={a.id}
                                parentId={a.id}
                                attribute={attr}
                                onSelect={onAttributeValueSelect}
                                onDeselect={onAttributeValueDeselect}
                                onClear={onAttributeValueClear}
                                onIsVariationalChange={onIsVariationalChange}
                                onRemoveAttribute={onAttributeDeselect}
                            />
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
