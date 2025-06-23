import { useEffect, useState } from 'react';
import SimpleForm from './SimpleForm';
import VariableForm from './VariableForm';
import { Button, Flex, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useParams } from 'react-router-dom';
import {
    AttributeDB,
    CategoryDB,
    SimpleProductTypeDB,
    VariableProductTypeDB,
} from '../../../types/ProductTypesDB';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import attributeService from '../../../services/attributeService';
import { Product, ProductAttribute, Category, CategoriesTree } from '../../../types/ProductTypes';
const CreateEdit: React.FC = () => {
    const [type, setType] = useState<'simple' | 'variable' | undefined>();
    const params = useParams();
    const id = params.id;
    const [product, setProduct] = useState<Partial<Product>>({});
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);
    const [attributes, setAttributes] = useState<Partial<ProductAttribute>[]>([]);

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
        setCategoriesTree(newTree);

        let product: Product | undefined;
        if (id) {
            product = await productService.getProductById(Number(id));
            if (product.categories)
                product.selectedCategories = product.categories.map((c: Category) => c.id);

            if (product.attributes)
                product.selectedAttributes = product.attributes.map((a: ProductAttribute) => a.id);

            const attrs: Partial<AttributeDB>[] = await attributeService.getAttributes({
                includeValues: true,
                ids: product!.attributes!.map((a) => a.id),
            });

            setProduct(product);
            setCategoriesTree(newTree);
            setAttributes(attrs);
            setType(product.isVariable ? 'variable' : 'simple');
            return;
        }

        const attrs: Partial<AttributeDB>[] = id
            ? await attributeService.getAttributes({
                  includeValues: true,
                  ids: product!.attributes!.map((a) => a.id),
              })
            : await attributeService.getAttributes();
        setProduct(product || {});
        setCategoriesTree(newTree);
        setAttributes(attrs);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {!id && type === undefined && (
                <Flex vertical align={'center'}>
                    <Title level={2}>Select product type</Title>
                    <Space size={'large'}>
                        <Button type="primary" size={'large'} onClick={() => setType('simple')}>
                            Simple
                        </Button>
                        <Button type="primary" size={'large'} onClick={() => setType('variable')}>
                            Variable
                        </Button>
                    </Space>
                </Flex>
            )}
            {type === 'simple' && (
                <SimpleForm
                    categoriesTree={categoriesTree}
                    initialAttributes={attributes}
                    initialProduct={product}
                />
            )}
            {type === 'variable' && (
                <VariableForm
                    categoriesTree={categoriesTree}
                    initialAttributes={attributes}
                    initialProduct={product}
                />
            )}
        </>
    );
};

export default CreateEdit;
