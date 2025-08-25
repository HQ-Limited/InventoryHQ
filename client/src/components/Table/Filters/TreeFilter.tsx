import { FilterFilled } from '@ant-design/icons';
import { Input, Space, TableColumnType, Tree } from 'antd';
import { CustomFilterProps } from './types/FilterTypes';
import { ActionButtons } from './ActionButtons';
import { FlatTreeType, TreeType } from '../../../types/TreeType';
import { useState } from 'react';

export const TreeFilter = <T,>({
    propertyPath,
    treeData,
    flatData,
}: {
    propertyPath: string[];
    treeData: TreeType[];
    flatData: FlatTreeType[];
}): TableColumnType<T> => {
    const [searchValue, setSearchValue] = useState('');
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    const [searchResultsIds, setSearchResultsIds] = useState<number[]>([]);

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchValue(value);

        if (value === '' || value.length < 3) {
            setExpandedKeys([]);
            setSearchResultsIds([]);
            return;
        }

        // Find the nodes that contains the search value
        const nodes = flatData.filter((node) =>
            node.name.toLowerCase().includes(value.toLowerCase())
        );
        const idsToExpand = new Set<number>();
        const idsToSelect = new Set<number>();

        for (const node of nodes) {
            let noParent = node.parentId !== null;
            let currentNode = node;

            while (noParent) {
                idsToExpand.add(currentNode.parentId!);
                currentNode = flatData.find((node) => node.id === currentNode.parentId)!;
                noParent = currentNode.parentId !== null;
            }

            idsToSelect.add(node.id);
        }

        setExpandedKeys(Array.from(idsToExpand));
        setSearchResultsIds(Array.from(idsToSelect));
    };

    const TreeFilter: TableColumnType<T> = {
        filterIcon: (filtered: boolean) => (
            <FilterFilled style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        filterDropdown: (props) => {
            const { setSelectedKeys, selectedKeys, confirm, close } =
                props as unknown as CustomFilterProps<string>;

            // Ensure there is at least one default key object with propertyPath
            if (selectedKeys.length === 0) {
                setSelectedKeys([{ value: '', operator: 'eq', propertyPath }]);
            }

            function applyFilters() {
                const newKeys = selectedKeys.filter((key) => key.value !== '');
                setSelectedKeys(newKeys);
                confirm();
            }

            function clearFilters() {
                setSelectedKeys([]);
                confirm();
            }

            return (
                <Space
                    direction="vertical"
                    style={{ padding: 8 }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <Input.Search
                        value={searchValue}
                        placeholder="Search (min. 3 characters)"
                        onChange={onSearch}
                    />
                    <Tree
                        onExpand={(keys, info) => {
                            if (info.node.isLeaf) return;
                            setExpandedKeys(keys as number[]);
                        }}
                        expandedKeys={expandedKeys}
                        treeData={treeData}
                        multiple={true}
                        checkable={true}
                        selectable={false}
                        filterTreeNode={(node) => {
                            return searchResultsIds.includes(node.id);
                        }}
                        fieldNames={{
                            key: 'id',
                            title: 'name',
                            children: 'children',
                        }}
                        /* onCheck={(checkedKeys) => {
                            setSelectedKeys(checkedKeys);
                        }} */
                    />

                    <ActionButtons
                        close={close}
                        clearFilters={clearFilters}
                        applyFilters={applyFilters}
                    />
                </Space>
            );
        },
    };

    return TreeFilter;
};
