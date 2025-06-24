import { useEffect, useState } from 'react';
import { Button, Form, FormProps, Select, Space, Spin, Tabs, TabsProps } from 'antd';
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
import VariationsCards from './components/VariationsCards';
import {
    ControlFilled,
    ProductFilled,
    TruckFilled,
    UnorderedListOutlined,
} from '@ant-design/icons';
import PriceField from './components/PriceField';
import { WHOLESALE_ENABLED } from '../../../global';
import QuantityField from './components/QuantityField';
import SKUField from './components/SKUField';

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
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();
    const [values, setValues] = useState<Partial<Product>>({
        categories: [],
        attributes: [],
        variations: [],
        isVariable: false,
    });
    const [loading, setLoading] = useState(false);

    // TODO: Add some check for variable products, that checks if any attribute value combo is already used and display an error message if so

    const fetchData = async () => {
        const categories = await categoryService.getCategories();
        setCategories(categories);

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
            if (product.categories) {
                product.selectedCategories = product.categories.map((c: Category) => c.id); // for form
            }

            const attrs: ProductAttribute[] = await attributeService.getAttributes({
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

        const attrs: ProductAttribute[] = id
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

    const fetchAttributeValues = async (id: number) => {
        const fetchData = async () => {
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
                return newAttrs;
            });
        };

        fetchData();
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
                    <Form.List name="attributes">
                        {(fields, { add, remove }) => (
                            <>
                                <AttributesField
                                    fetchValues={fetchAttributeValues}
                                    attributes={attributes}
                                    onAdd={add}
                                    onRemove={remove}
                                    required={isVariable}
                                />
                                <Space>
                                    {fields.map((field, attributeKey) => (
                                        <>
                                            <AttributeValuesField
                                                key={field.key}
                                                name={attributeKey}
                                                attributes={attributes}
                                                onRemove={remove}
                                                showVariationCheckbox={isVariable}
                                            />
                                        </>
                                    ))}
                                </Space>
                            </>
                        )}
                    </Form.List>
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
                        <PriceField name={[0, 'wholesalePrice']} label="Wholesale price" />
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
                    <QuantityField />

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

                        <CategoryField categoriesTree={categoriesTree} categories={categories} />

                        <Form.Item
                            name={'isVariable'}
                            label="Product type"
                            rules={[{ required: true }]}
                        >
                            <Select
                                style={{ width: 120 }}
                                options={[
                                    { value: false, label: 'Simple' },
                                    { value: true, label: 'Variable' },
                                ]}
                                value={isVariable}
                                onChange={(value) => {
                                    setIsVariable(value);
                                }}
                            />
                        </Form.Item>

                        <Tabs
                            items={
                                form.getFieldValue('isVariable')
                                    ? variableProductItems
                                    : simpleProductItems
                            }
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
