import { Attribute, Category } from '../pages/products/Edit/types/EditProductTypes';

export type Tree = {
    value: number | string;
    title: string;
    text: string;
    children: Tree[];
};

export function generateCategoriesTree(categories: Category[]): Tree[] {
    function createChildren(category: Category): Tree {
        return {
            value: category.id,
            title: category.name,
            text: category.name,
            children: category.children?.map(createChildren) || [],
        };
    }

    return categories.map(createChildren);
}

export function generateAttributesTree(attributes: Attribute[]): Tree[] {
    return attributes.map((attribute) => ({
        value: `attribute-${attribute.id}`,
        title: attribute.name,
        text: attribute.name,
        children: attribute.values?.map((value) => ({
            value: `value-${value.id}`,
            title: value.value,
            text: value.value,
            children: [],
        })),
    }));
}
