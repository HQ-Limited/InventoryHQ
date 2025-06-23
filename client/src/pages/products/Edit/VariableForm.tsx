import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, message, Space, Steps } from 'antd';
import {
    AttributeDB,
    VariableProductTypeDB,
    VariationDB,
    VariationAttributeTypeDB,
} from '../../../types/ProductTypesDB';
import AttributesField from './components/AttributesField';
import AttributeValuesField from './components/AttributeValuesField';
import { PlusOutlined } from '@ant-design/icons';
import VariationCard from './components/VariationCard';
import CategoryField from './components/CategoryField';
import NameField from './components/NameField';
import DescriptionField from './components/DescriptionField';
import attributeService from '../../../services/attributeService';
import { Product, ProductAttribute, CategoriesTree } from '../../../types/ProductTypes';
const onFinish: FormProps<VariableProductTypeDB>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<VariableProductTypeDB>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const VariableForm: React.FC<{
    categoriesTree: CategoriesTree[];
    initialAttributes: Partial<ProductAttribute>[];
    initialProduct: Partial<Product>;
}> = ({ categoriesTree, initialAttributes, initialProduct }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [values, setValues] = useState<Partial<Product>>(
        initialProduct || {
            attributes: [],
            variations: [],
            selectedAttributes: [],
        }
    );
    const [attributes, setAttributes] = useState<Partial<ProductAttribute>[]>(initialAttributes);

    const [step, setStep] = useState(0);

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
                try {
                    const id: number = await attributeService.createAttribute(value);

                    setAttributes((prev) => {
                        const newAttributes = [...prev, { id, name: value, values: [] }];
                        addAttribute(id, newAttributes);
                        return newAttributes;
                    });
                } catch (e) {
                    message.error('Failed to create attribute');
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
                selectedAttributes: (prev.attributes || []).filter((a) => a.id !== id),
            };
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
            return newValues;
        });
    };

    const onAttributeValueSelect = ({ id, parent }: { id: number | string; parent: number }) => {
        function addAttributeValue({
            id,
            parent,
            attributes,
        }: {
            id: number;
            parent: number;
            attributes: ProductAttribute[];
        }) {
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
                    return newValues;
                });
            }
        }

        if (typeof id === 'string') {
            // Create attribute and get id from response
            const createAttributeValue = async () => {
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
                    message.error('Failed to create attribute');
                }
            };

            createAttributeValue();
            return;
        }

        // Add attribute value to product attribute
        addAttributeValue({ id, parent, attributes });
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

    const onAddVariation = () => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                variations: [...(prev.variations || []), { attributes: [], manage_quantity: true }],
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
            [[]] as VariationAttributeTypeDB[][]
        );

        const variations: VariationDB[] = combinations.map((combo) => {
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

    const onVariationAttributeValueSelect = ({
        id,
        parent,
        variation,
    }: {
        id: number;
        parent: number;
        variation: number;
    }) => {
        setValues((prev) => {
            const newValues = {
                ...prev,
                variations: prev.variations!.map((v, i) => {
                    if (i === variation) {
                        v.attributes = v.attributes.map((a) => {
                            if (a.id === parent) {
                                a.value = {
                                    id,
                                    value: attributes
                                        .find((a) => a.id === parent)!
                                        .values!.find((v) => v.id === id)!.value,
                                };
                            }
                            return a;
                        });
                    }
                    return v;
                }),
            };
            return newValues;
        });
    };

    return (
        <>
            {contextHolder}
            <Steps
                current={step}
                items={[
                    {
                        title: 'General info',
                    },
                    {
                        title: 'Variations',
                    },
                ]}
                size={'small'}
            />
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
                <Space style={{ display: step === 0 ? 'block' : 'none' }}>
                    <NameField />

                    <DescriptionField />

                    <CategoryField categoriesTree={categoriesTree} onChange={onCategoryChange} />

                    <AttributesField
                        onSelect={onAttributeSelect}
                        onDeselect={onAttributeDeselect}
                        onClear={onAttributeClear}
                        options={attributes.map((v) => ({
                            label: v.name!,
                            value: v.id!,
                        }))}
                        required={true}
                    />

                    {values.attributes && (
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
                    )}
                </Space>

                <Space style={{ display: step === 1 ? 'flex' : 'none' }} align={'start'}>
                    {values.variations?.map((v, i) => {
                        return (
                            <VariationCard
                                key={i}
                                variationKey={i}
                                manage_quantity={v.manage_quantity}
                                attributes={attributes}
                                selectedAttributes={values.attributes!}
                                functions={{
                                    attribute: {
                                        onSelect: onVariationAttributeValueSelect,
                                    },
                                }}
                            />
                        );
                    })}
                    <Button
                        style={{
                            width: '300px',
                            height: '200px',
                            display: 'flex',
                            borderRadius: '8px',
                            border: '1px solid #303030',
                        }}
                        size="large"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={onAddVariation}
                    >
                        Add one variation
                    </Button>

                    <Button
                        style={{
                            width: '300px',
                            height: '200px',
                            display: 'flex',
                            borderRadius: '8px',
                            border: '1px solid #303030',
                        }}
                        size="large"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={onGenerateVariations}
                    >
                        Generate all possible variations
                    </Button>
                </Space>

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                    {step > 0 && <Button onClick={() => setStep(step - 1)}>Previous step</Button>}
                    {step < 2 && (
                        <Button
                            type="primary"
                            onClick={() => setStep(step + 1)}
                            disabled={
                                !values.attributes ||
                                values.attributes.length == 0 ||
                                values.attributes!.filter((a) => a.isVariational === true)
                                    .length === 0
                            }
                        >
                            Next step
                        </Button>
                    )}
                </Space>

                {/* <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item> */}
            </Form>
        </>
    );
};

export default VariableForm;
