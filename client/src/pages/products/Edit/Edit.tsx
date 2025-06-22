import { useEffect, useState } from 'react';
import SimpleForm from './SimpleForm';
import VariableForm from './VariableForm';
import { Button, Flex, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useParams } from 'react-router-dom';
import {
    AttributeDB,
    CategoriesTree,
    CategoryDB,
    SimpleProductTypeDB,
    VariableProductTypeDB,
} from '../../../types/ProductTypesDB';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import attributeService from '../../../services/attributeService';
const CreateEdit: React.FC = () => {
    const [type, setType] = useState<'simple' | 'variable' | undefined>();
    const params = useParams();
    const id = params.id;
    const [product, setProduct] = useState<
        Partial<SimpleProductTypeDB> | Partial<VariableProductTypeDB>
    >({});
    const [categoriesTree, setCategoriesTree] = useState<CategoriesTree[]>([]);
    const [attributes, setAttributes] = useState<Partial<AttributeDB>[]>([]);

    const fetchData = async () => {
        const categories: CategoryDB[] = await categoryService.getCategories();

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

        if (id) {
            const product = await productService.getProductById(Number(id));
            setProduct(product);
            setType(product?.variations?.length > 0 ? 'variable' : 'simple');
        }

        const attrs: Partial<AttributeDB>[] = id
            ? await attributeService.getAttributes(Number(id))
            : await attributeService.getAttributes();
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
                    initialProduct={product as SimpleProductTypeDB}
                />
            )}
            {type === 'variable' && (
                <VariableForm
                    categoriesTree={categoriesTree}
                    initialAttributes={attributes}
                    initialProduct={product as VariableProductTypeDB}
                />
            )}
        </>
    );
};

export default CreateEdit;
