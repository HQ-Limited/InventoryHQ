import { useEffect, useState } from 'react';
import { App, Button, Form, FormProps, Select, Space, Spin, Tabs, TabsProps, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import attributeService from '../../../services/attributeService';
import {
    Product,
    ProductAttribute,
    Category,
    Variation,
    VariationAttribute,
    Location,
    AttributeValue,
    Attribute,
} from './types/EditProductTypes';
import NameField from './components/NameField';
import DescriptionField from './components/DescriptionField';
import CategoryField from './components/CategoryField';
import AttributesField from './components/AttributesField';
import AttributeValuesField from './components/AttributeValuesField';
import VariationsTable from './components/VariationsTable';
import {
    AppstoreOutlined,
    ControlFilled,
    ProductFilled,
    QuestionCircleOutlined,
    SaveOutlined,
    TruckFilled,
    UnorderedListOutlined,
} from '@ant-design/icons';
import PriceField from './components/PriceField';
import { LOCATIONS_ENABLED, PACKAGES_ENABLED, WHOLESALE_ENABLED } from '../../../global';
import QuantityField from './components/QuantityField';
import SKUField from './components/SKUField';
import locationService from '../../../services/locationService';
import PackagesTable from './components/PackagesTable';
import UnitsOfMeasurementTable from './components/UnitsOfMeasurementTable';
import BarcodeField from './components/BarcodeField';
import QuantityTable from './components/QuantityTable';
import { Context } from './Context';

const CreateEdit: React.FC = () => {
    const { message } = App.useApp();
    const [isVariable, setIsVariable] = useState(false);
    const params = useParams();
    const id = params.id;
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();
    const [locations, setLocations] = useState<Location[]>([]);

    const [values, setValues] = useState<Partial<Product>>({
        categories: [],
        attributes: [],
        variations: [
            ...(!LOCATIONS_ENABLED
                ? [
                      {
                          inventoryUnits: [{}],
                      },
                  ]
                : []),
        ],
        isVariable: false,
    });
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const categories = await categoryService.getCategories();
        setCategories(categories);

        if (LOCATIONS_ENABLED) {
            const locations = await locationService.getLocations();
            setLocations(locations);
        }

        let product: Product | undefined;
        if (id) {
            setLoading(true);
            product = await productService.getProductById(Number(id));

            const attrs: Attribute[] = await attributeService.getAttributes({
                includeValues: true,
                ids: product!.attributes!.map((a) => a.attributeId),
            });

            setAttributes(attrs);
            setIsVariable(product.isVariable);
            setValues(product);
            form.setFieldsValue(product);
            setLoading(false);
            return;
        }

        const attrs: Attribute[] = id
            ? await attributeService.getAttributes({
                  includeValues: true,
                  ids: product!.attributes!.map((a) => a.id),
              })
            : await attributeService.getAttributes();
        setAttributes(attrs);
    };

    useEffect(() => {
        const fetchData = async () => {
            const categories = await categoryService.getCategories();
            setCategories(categories);

            const locations = await locationService.getLocations();
            setLocations(locations);

            let product: Product | undefined;
            if (id) {
                setLoading(true);
                product = await productService.getProductById(Number(id));

                const attrs: Attribute[] = await attributeService.getAttributes({
                    includeValues: true,
                    ids: product!.attributes!.map((a) => a.attributeId),
                });

                setAttributes(attrs);
                setIsVariable(product.isVariable);
                setValues(product);
                form.setFieldsValue(product);
                setLoading(false);
                return;
            }

            const attrs: Attribute[] = await attributeService.getAttributes();
            setAttributes(attrs);
        };
        fetchData();
    }, [id, form]);

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

    // TODO: Think of a way to make variations generation displayed to the user
    /* const onGenerateVariations = () => {
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
    }; */

    const onFinish: FormProps<Product>['onFinish'] = async (values) => {
        if (!LOCATIONS_ENABLED) {
            values.variations.forEach((variation) => {
                variation.inventoryUnits?.forEach((inventoryUnit) => {
                    inventoryUnit.location = locations[0];
                });
            });

            values.packages?.forEach((pkg) => {
                pkg.location = locations[0];
            });
        }
        return console.log(values);
        setSaving(true);

        try {
            if (id) {
                await productService.updateProduct({ ...values, id: Number(id) });
                message.success('Product successfully updated!');
            } else {
                const createdId = await productService.createProduct(values);
                message.success('Product successfully created!');
                navigate(`/products/${createdId}`);
            }

            setSaving(false);
            message.success('Product successfully updated!');
        } catch {
            setSaving(false);
            message.error('Failed to update product');
        }
    };

    const onFinishFailed: FormProps<Product>['onFinishFailed'] = (errorInfo) => {
        message.error(errorInfo.errorFields[0].errors[0]);
        console.log('Failed:', errorInfo);
    };

    async function createNewCategory(name: string) {
        try {
            const id: number = await categoryService.createCategory(name);
            setCategories((prev) => {
                return [...prev, { id, name, children: [] }];
            });

            const index = form
                .getFieldValue('categories')
                .findIndex((a: Category) => a.name === name);

            form.setFieldValue(['categories', index], {
                id,
                name,
                children: [],
            });
            message.success('Category created');
        } catch {
            message.error('Failed to create category');
        }
    }

    async function createNewAttribute(name: string) {
        try {
            const attributeId: number = await attributeService.createAttribute(name);
            setAttributes((prev) => {
                return [...prev, { id: attributeId, name, values: [] }];
            });

            const index = form
                .getFieldValue('attributes')
                .findIndex((a: ProductAttribute) => a.name === name);

            form.setFieldValue(['attributes', index], {
                attributeId,
                name: name,
                values: [],
                isVariable,
            });
            message.success('Attribute created');
        } catch {
            message.error('Failed to create attribute');
        }
    }

    async function createNewAttributeValue({ value, id }: { value: string; id: number }) {
        try {
            const valueId: number = await attributeService.createAttributeValue({ id, value });
            setAttributes((prev) => {
                const newAttrs = prev.map((a) => {
                    if (a.id === id) {
                        a.values = [
                            ...a.values.filter((a) => a.value !== value),
                            { id: valueId, value },
                        ];
                    }
                    return a;
                });
                return newAttrs;
            });

            const index = form
                .getFieldValue('attributes')
                .findIndex((a: ProductAttribute) => a.attributeId === id);

            const newValues = [
                ...form
                    .getFieldValue(['attributes', index, 'values'])
                    .filter((a: AttributeValue) => a.value !== value),
                { id: valueId, value },
            ];

            form.setFieldValue(['attributes', index, 'values'], newValues);
            message.success('Attribute value created');
        } catch {
            message.error('Failed to create attribute value');
        }
    }

    const productMenuItems: TabsProps['items'] = [
        ...(!isVariable
            ? [
                  {
                      key: 'general',
                      label: 'General',
                      icon: <ControlFilled />,
                      children: (
                          <>
                              <PriceField />

                              {WHOLESALE_ENABLED && (
                                  <PriceField
                                      name={[0, 'wholesalePrice']}
                                      label="Wholesale price"
                                  />
                              )}

                              <SKUField />

                              <BarcodeField />
                          </>
                      ),
                      forceRender: true,
                  },
              ]
            : []),
        {
            key: 'inventory',
            label: 'Inventory',
            icon: <TruckFilled />,
            children: (
                <>
                    {!isVariable &&
                        (LOCATIONS_ENABLED ? (
                            <QuantityTable />
                        ) : (
                            <QuantityField name={['variations', 0]} />
                        ))}

                    <UnitsOfMeasurementTable />
                </>
            ),
            forceRender: true,
        },
        {
            key: 'attributes',
            label: 'Attributes',
            icon: <UnorderedListOutlined />,
            children: (
                <>
                    <AttributesField
                        attributes={attributes}
                        createNewAttribute={createNewAttribute}
                        fetchValues={fetchAttributeValues}
                        required={isVariable}
                    />
                    <Form.List name="attributes">
                        {(fields, { remove }) => (
                            <>
                                <Space wrap>
                                    {fields.map((field, attributeKey) => (
                                        <>
                                            <AttributeValuesField
                                                key={field.key}
                                                name={attributeKey}
                                                attributes={attributes}
                                                remove={remove}
                                                createNewAttributeValue={createNewAttributeValue}
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
            forceRender: true,
        },
        ...(isVariable
            ? [
                  {
                      key: 'variations',
                      label: 'Variations',
                      icon: <ProductFilled />,
                      children: <VariationsTable />,
                      forceRender: true,
                  },
              ]
            : []),
        ...(PACKAGES_ENABLED
            ? [
                  {
                      key: 'packages',
                      label: 'Packages',
                      icon: <AppstoreOutlined />,
                      onClick: () => {
                          console.log('test');
                      },
                      children: <PackagesTable />,
                      forceRender: true,
                  },
              ]
            : []),
    ];

    return (
        <Context.Provider value={{ locations, isVariable }}>
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
                {loading ? (
                    <Spin size="large" fullscreen />
                ) : (
                    <>
                        <Space style={{ display: 'block' }}>
                            <NameField />

                            <DescriptionField />

                            <CategoryField
                                categories={categories}
                                createNewCategory={createNewCategory}
                            />

                            <Form.Item
                                name={'isVariable'}
                                label={
                                    <Space>
                                        Product type
                                        {isVariable && (
                                            <Tooltip
                                                placement="right"
                                                color="orange"
                                                title="Warning: Changing the product type will delete all variations and packages!"
                                            >
                                                <QuestionCircleOutlined
                                                    style={{ fontSize: 16, color: 'orange' }}
                                                />
                                            </Tooltip>
                                        )}
                                    </Space>
                                }
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
                                        form.setFieldValue('packages', []);
                                        if (value) {
                                            form.setFieldValue('variations', []);
                                        } else {
                                            form.setFieldValue('variations', [
                                                ...(!LOCATIONS_ENABLED
                                                    ? [
                                                          {
                                                              inventoryUnits: [{}],
                                                          },
                                                      ]
                                                    : []),
                                            ]);
                                        }
                                        setIsVariable(value);
                                    }}
                                />
                            </Form.Item>

                            <Tabs items={productMenuItems} tabPosition="left" />
                        </Space>

                        <Form.Item style={{ textAlign: 'center', marginTop: 50 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size={'large'}
                                icon={<SaveOutlined />}
                                loading={saving}
                            >
                                Save product
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Context.Provider>
    );
};

export default CreateEdit;
