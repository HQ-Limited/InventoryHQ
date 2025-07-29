export type CategoryTree = {
    id: number;
    name: string;
    children?: CategoryTree[];
    parentId?: number;
    isLeaf: boolean;
};

export type CreateCategory = {
    name: string;
    parentId?: number;
};

export type EditCategory = {
    id: number;
    name: string;
    parentId?: number;
};
