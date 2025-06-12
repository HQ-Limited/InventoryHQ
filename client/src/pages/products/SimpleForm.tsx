import React, { useState } from 'react';
import type { CheckboxChangeEvent, FormProps } from 'antd';
import { Button, Form, message, Space } from 'antd';
import { WHOLESALE_ENABLED } from '../../global';
import { Attribute, CategoriesTree, SimpleProductType } from '../../types/ProductTypes';
import AttributesField from './components/AttributesField';
import AttributeValuesField from './components/AttributeValuesField';
import PriceField from './components/PriceField';
import SKUField from './components/SKUField';
import CategoryField from './components/CategoryField';
import NameField from './components/NameField';
import DescriptionField from './components/DescriptionField';
import ManageQuantityField from './components/ManageQuantityField';
import QuantityField from './components/QuantityField';
import attributeService from '../../services/attributeService';
const onFinish: FormProps<SimpleProductType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<SimpleProductType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const SimpleForm: React.FC<{
    categoriesTree: CategoriesTree[];
    initialAttributes: Partial<Attribute>[];
    initialProduct: Partial<SimpleProductType>;
}> = ({ categoriesTree, initialAttributes, initialProduct }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [values, setValues] = useState<Partial<SimpleProductType>>(
        initialProduct || {
            attributes: [],
            manage_quantity: true,
        }
    );
    const [attributes, setAttributes] = useState<Partial<Attribute>[]>(initialAttributes);

    const onManageQuantityChange = (e: CheckboxChangeEvent) => {
        setValues({ ...values, manage_quantity: e.target.checked });
    };

    const onCategoryChange = (value: number[]) => setValues({ ...values, categories: value });

    const onAttributeSelect = (value: number | string) => {
        function addAttribute(id: number) {
            // Add attribute to product
            setValues((prev) => {
                const newValues = {
                    ...prev,
                    attributes: [
                        ...(prev.attributes || []),
                        {
                            id,
                            values: [],
                        },
                    ],
                };
                return newValues;
            });
        }

        if (typeof value === 'string') {
            // Create attribute and get id from response
            const createAttribute = async () => {
                try {
                    const id: number = await attributeService.createAttribute(value);

                    addAttribute(id);
                    setAttributes((prev) => [...prev, { id, name: value, values: [] }]);
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
            const wasFetched = attributes.find((a) => a.id === id)?.values;

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
                    return newAttrs;
                });
            }

            addAttribute(id);
        };

        fetchData();
    };

    const onAttributeDeselect = (id: number) => {
        // Remove attribute from product
        setValues((prev) => {
            const newValues = {
                ...prev,
                attributes: (prev.attributes || []).filter((a) => a.id !== id),
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

    const onAttributeValueSelect = ({ id, parent }: { id: number | string; parent: number }) => {
        function addAttributeValue({ id, parent }: { id: number; parent: number }) {
            {
                setValues((prev) => {
                    const newValues = {
                        ...prev,
                        attributes: (prev.attributes || []).map((a) => {
                            if (a.id === parent) {
                                if (!a.values) a.values = [id];
                                else if (!a.values.includes(id)) a.values = [...a.values, id];
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

                    setAttributes((prev) =>
                        prev.map((a) =>
                            a.id === parent
                                ? { ...a, values: [...(a.values || []), { id: newId, value: id }] }
                                : a
                        )
                    );

                    addAttributeValue({ id: newId, parent });
                } catch (e) {
                    message.error('Failed to create attribute');
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
                attributes: (prev.attributes || []).map((a) => {
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
                initialValues={values}
            >
                <NameField />
                <DescriptionField />
                <PriceField />

                {WHOLESALE_ENABLED && (
                    <PriceField fieldName="wholesalePrice" label="Wholesale price" />
                )}
                <ManageQuantityField onChange={onManageQuantityChange} />

                {values.manage_quantity && <QuantityField />}

                <SKUField />

                <CategoryField categoriesTree={categoriesTree} onChange={onCategoryChange} />

                <AttributesField
                    onSelect={onAttributeSelect}
                    onDeselect={onAttributeDeselect}
                    onClear={onAttributeClear}
                    options={attributes?.map((v) => ({
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
                                />
                            );
                        })}
                    </Space>
                )}

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default SimpleForm;
