export type CreateCategory = {
    name: string;
    parentId?: number | null;
};

export type EditCategory = {
    id: number;
    name: string;
    parentId?: number | null;
};

export type Category = {
    id: number;
    name: string;
    parentId?: number | null;
    parent?: Category;
    children?: Category[];
};
