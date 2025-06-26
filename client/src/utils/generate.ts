import { Category } from '../types/ProductTypes';

export type Tree = {
    value: number;
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
