import { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Form,
    FormProps,
    message,
    Select,
    Space,
    Spin,
    Tabs,
    TabsProps,
    Tooltip,
} from 'antd';
import { useParams } from 'react-router-dom';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import attributeService from '../../../services/attributeService';
import {
    Product,
    ProductAttribute,
    Category,
    CategoriesTree,
    Variation,
    VariationAttribute,
} from '../../../types/ProductTypes';
import NameField from './components/NameField';
import DescriptionField from './components/DescriptionField';
import CategoryField from './components/CategoryField';
import AttributesField from './components/AttributesField';
import AttributeValuesField from './components/AttributeValuesField';
import VariationsCards from './components/VariationCard';
import {
    ControlFilled,
    FolderFilled,
    PlusOutlined,
    ProductFilled,
    TruckFilled,
    TruckOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import PriceField from './components/PriceField';
import { WHOLESALE_ENABLED } from '../../../global';
import QuantityField from './components/QuantityField';
import SKUField from './components/SKUField';
import ManageQuantityField from './components/ManageQuantityField';

const onFinish: FormProps<Product>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<Product>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CreateEdit: React.FC = () => {
    const [isVariable, setIsVariable] = useState(false);
    const params = useParams();
    const id = params.id;
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);
    const [attributes, setAttributes] = useState<Partial<ProductAttribute>[]>([]);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [values, setValues] = useState<Partial<Product>>({
        attributes: [],
        variations: [
            {
                attributes: [],
                manage_quantity: true,
                INITIAL: true, // Used to hide default variation thats created on product creation, because it shows up in the Variations tab
            },
        ],
        selectedAttributes: [],
        isVariable: false,
    });
    const [loading, setLoading] = useState(false);

    // TODO: Add some check for variable products, that checks if any attribute value combo is already used and display an error message if so

    const fetchData = async () => {
        const categories: Category[] = await categoryService.getCategories();

        const newTree: CategoriesTree[] = [];
        categories.map((category) => {
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
                const parentExists = newTree.find((c) => c.value === category.parent!.id);
                if (parentExists) {
                    parentExists.children.push({
                        value: category.id,
                        title: category.name,
                        children: [],
                    });
                } else {
                    // Create parent first
                    newTree.push({
                        value: category.parent.id,
                        title: category.parent.name,
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

        let product: Product | undefined;
        if (id) {
            setLoading(true);
            product = await productService.getProductById(Number(id));
            if (product.categories)
                product.selectedCategories = product.categories.map((c: Category) => c.id);

            if (product.attributes)
                product.selectedAttributes = product.attributes.map((a: ProductAttribute) => a.id);

            const attrs: Partial<ProductAttribute>[] = await attributeService.getAttributes({
                includeValues: true,
                ids: product!.attributes!.map((a) => a.id),
            });

            setCategoriesTree(newTree);
            setAttributes(attrs);
            setIsVariable(product.isVariable);
            setValues(product);
            form.setFieldsValue(product);
            setLoading(false);
            return;
        }

        const attrs: Partial<ProductAttribute>[] = id
            ? await attributeService.getAttributes({
                  includeValues: true,
                  ids: product!.attributes!.map((a) => a.id),
              })
            : await attributeService.getAttributes();
        setCategoriesTree(newTree);
        setAttributes(attrs);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log(values);
    }, [values]);

    const onCategoryChange = (value: number[]) => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                selectedCategories: value,
            };
            return newValues;
        });
    };

    const onAttributeSelect = (value: number | string) => {
        function addAttribute(id: number, attributes: ProductAttribute[]) {
            // Add attribute to product
            setValues((prev) => {
                const newValues = {
                    ...prev,
                    attributes: [
                        ...(prev.attributes || []),
                        {
                            id,
                            name: attributes.find((a) => a.id === id)!.name,
                            values: [],
                        },
                    ],
                    selectedAttributes: [...(prev.selectedAttributes || []), id],
                };
                return newValues;
            });
        }

        if (typeof value === 'string') {
            // Create attribute and get id from response
            const createAttribute = async () => {
                const selectedAttributes = values.selectedAttributes;
                try {
                    const id: number = await attributeService.createAttribute(value);

                    setAttributes((prev) => {
                        const newAttributes = [...prev, { id, name: value, values: [] }];
                        addAttribute(id, newAttributes);
                        return newAttributes;
                    });
                } catch (e) {
                    messageApi.error('Failed to create attribute');
                    form.setFieldValue('selectedAttributes', selectedAttributes);
                }
            };

            createAttribute();
            return;
        }

        // Load all values for selected attribute
        const fetchData = async () => {
            const id: number = value;
            // Check if attribute wasnt re-added (already has fetched values)
            const wasFetched = attributes.find((a) => a.id === id)?.values?.length > 0;
            let newAttributes: ProductAttribute[] = attributes;

            if (!wasFetched) {
                const values: { id: number; value: string }[] =
                    await attributeService.getAttributeValues(id);
                // Add all possible values to the attribute
                setAttributes((prev) => {
                    const newAttrs = prev.map((a) => {
                        if (a.id === id) {
                            a.values = values;
                        }
                        return a;
                    });
                    newAttributes = newAttrs;
                    return newAttrs;
                });
            }

            addAttribute(id, newAttributes);
        };

        fetchData();
    };

    const onAttributeDeselect = (id: number) => {
        // Remove attribute from product
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: (prev.attributes || []).filter((a) => a.id !== id),
                selectedAttributes: (prev.selectedAttributes || []).filter((a) => a !== id),
            };
            form.setFieldValue('attributes', newValues.attributes);
            return newValues;
        });
    };

    const onAttributeClear = () => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: [],
                selectedAttributes: [],
            };
            form.setFieldValue('attributes', []);
            return newValues;
        });
    };

    const onAttributeValueSelect = ({ id, parent }: { id: number | string; parent: number }) => {
        function addAttributeValue({ id, parent }: { id: number; parent: number }) {
            {
                setValues((prev) => {
                    const newValues = {
                        ...prev,
                        attributes: (prev.attributes || []).map((a) => {
                            if (a.id === parent) {
                                if (!a.values)
                                    a.values = [
                                        {
                                            id,
                                            value: attributes
                                                .find((a) => a.id === parent)!
                                                .values!.find((v) => v.id === id)!.value,
                                        },
                                    ];
                                else if (!a.values!.find((v) => v.id === id)) {
                                    a.values!.push({
                                        id,
                                        value: attributes
                                            .find((a) => a.id === parent)!
                                            .values!.find((v) => v.id === id)!.value,
                                    });
                                }
                            }
                            return a;
                        }),
                    };
                    form.setFieldValue('attributes', newValues.attributes);
                    return newValues;
                });
            }
        }

        if (typeof id === 'string') {
            // Create attribute and get id from response
            const createAttributeValue = async () => {
                const attributeValues = values.attributes.find((a) => a.id === parent);
                try {
                    const newId: number = await attributeService.createAttributeValue({
                        id: parent,
                        value: id,
                    });

                    setAttributes((prev) => {
                        const newAttributes = prev.map((a) =>
                            a.id === parent
                                ? { ...a, values: [...(a.values || []), { id: newId, value: id }] }
                                : a
                        );

                        addAttributeValue({ id: newId, parent, attributes: newAttributes });
                        return newAttributes;
                    });
                } catch (e) {
                    messageApi.error('Failed to create attribute');
                    form.setFieldValue(
                        [
                            'attributes',
                            values.attributes!.findIndex((a) => a.id === parent),
                            'values',
                        ],
                        attributeValues
                    );
                }
            };

            createAttributeValue();
            return;
        }

        // Add attribute value to product attribute
        addAttributeValue({ id, parent });
    };

    const onAttributeValueDeselect = ({ id, parent }: { id: number; parent: number }) => {
        // Remove attribute value from product attribute
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: (prev.attributes || []).map((a) => {
                    if (a.id === parent) {
                        a.values = (a.values || []).filter((v) => v.id !== id);
                    }
                    return a;
                }),
            };
            return newValues;
        });
    };

    const onAttributeValueClear = (id: number) => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: (prev.attributes || []).map((a) => {
                    if (a.id === id) a.values = [];
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
                attributes: (prev.attributes || []).map((a) => {
                    if (a.id === id) {
                        a.isVariational = value;
                    }
                    return a;
                }),
            };
            return newValues;
        });
    };

    const onGenerateVariations = () => {
        const variationalAttributes = values.attributes!.filter((attr) => attr.isVariational);

        const valueGroups = variationalAttributes.map((attr) =>
            attr.values!.map((val) => ({ id: attr.id, value: val }))
        );

        const combinations = valueGroups.reduce(
            (acc, group) => acc.flatMap((combo) => group.map((item) => [...combo, item])),
            [[]] as VariationAttribute[][]
        );

        const variations: Variation[] = combinations.map((combo) => {
            return {
                attributes: combo,
                manage_quantity: true,
            };
        });

        setValues((prev) => {
            const newValues = {
                ...prev,
                variations,
            };
            return newValues;
        });

        form.setFieldsValue({ variations });
    };

    const commonProductItems: TabsProps['items'] = [
        {
            key: '3',
            label: 'Attributes',
            icon: <UnorderedListOutlined />,
            children: (
                <>
                    <AttributesField
                        onSelect={onAttributeSelect}
                        onDeselect={onAttributeDeselect}
                        onClear={onAttributeClear}
                        options={attributes.map((v) => ({
                            label: v.name!,
                            value: v.id!,
                        }))}
                        required={isVariable}
                    />
                    <Form.List name="attributes">
                        {(fields, { add, remove }) => (
                            <Space>
                                {fields.map((field, attributeKey) => (
                                    <AttributeValuesField
                                        key={field.key}
                                        name={attributeKey}
                                        attributes={attributes}
                                        onSelect={onAttributeValueSelect}
                                        onDeselect={onAttributeValueDeselect}
                                        onClear={onAttributeValueClear}
                                        onIsVariationalChange={onIsVariationalChange}
                                        onRemove={remove}
                                        showVariationCheckbox={isVariable}
                                    />
                                ))}
                            </Space>
                        )}
                    </Form.List>
                    {/* {values.attributes && (
                        <Space>
                            {values.attributes?.map((a, i) => {
                                const attr = attributes.find((o) => o.id === a.id)!;
                                return (
                                    <AttributeValuesField
                                        showVariationCheckbox
                                        isVariational={a.isVariational}
                                        key={i}
                                        attributeKey={i}
                                        parentId={a.id}
                                        options={attr.values!.map((v) => ({
                                            label: v.value,
                                            value: v.id,
                                        }))}
                                        attribute={attr}
                                        onSelect={onAttributeValueSelect}
                                        onDeselect={onAttributeValueDeselect}
                                        onClear={onAttributeValueClear}
                                        onIsVariationalChange={onIsVariationalChange}
                                        onRemoveAttribute={onAttributeDeselect}
                                    />
                                );
                            })}
                        </Space>
                    )} */}
                </>
            ),
        },
    ];

    const simpleProductItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'General',
            icon: <ControlFilled />,
            children: (
                <>
                    <PriceField />

                    {WHOLESALE_ENABLED && (
                        <PriceField fieldName="wholesalePrice" label="Wholesale price" />
                    )}
                </>
            ),
        },
        {
            key: '2',
            label: 'Inventory',
            icon: <TruckFilled />,
            children: (
                <>
                    <ManageQuantityField
                        onChange={(e) => {
                            setValues((prev) => {
                                const newValues = {
                                    ...prev,
                                    variations: prev.variations!.map((v) => ({
                                        ...v,
                                        manage_quantity: e.target.checked,
                                    })),
                                };
                                return newValues;
                            });
                        }}
                    />

                    {values.variations![0].manage_quantity && <QuantityField />}

                    <SKUField />
                </>
            ),
        },
        ...commonProductItems,
    ];

    const variableProductItems: TabsProps['items'] = [
        ...commonProductItems,
        {
            key: '4',
            label: 'Variations',
            icon: <ProductFilled />,
            children: <VariationsCards />,
        },
    ];

    return (
        <>
            {contextHolder}
            {loading ? (
                <Spin size="large" fullscreen />
            ) : (
                <Form
                    form={form}
                    style={{ padding: '20px' }}
                    layout="vertical"
                    variant="filled"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    scrollToFirstError
                    initialValues={values}
                >
                    <Space style={{ display: 'block' }}>
                        <NameField />

                        <DescriptionField />

                        <CategoryField
                            categoriesTree={categoriesTree}
                            onChange={onCategoryChange}
                        />

                        <Form.Item
                            name={'isVariable'}
                            label="Product type"
                            rules={[{ required: true }]}
                        >
                            <Select
                                style={{ width: 120 }}
                                value={isVariable}
                                onChange={(e) => {
                                    setIsVariable(e);
                                    setValues((prev) => ({
                                        ...prev,
                                        isVariable: e,
                                    }));
                                }}
                                options={[
                                    { value: false, label: 'Simple' },
                                    { value: true, label: 'Variable' },
                                ]}
                            />
                        </Form.Item>

                        <Tabs
                            items={isVariable ? variableProductItems : simpleProductItems}
                            tabPosition="left"
                        />
                    </Space>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" size={'large'}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default CreateEdit;
