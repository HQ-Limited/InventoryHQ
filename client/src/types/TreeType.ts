export interface TreeType {
    id: number;
    name: string;
    children?: TreeType[];
    isLeaf: boolean;
    parentId?: number;
}

export interface FlatTreeType {
    id: number;
    name: string;
    parentId?: number;
}
