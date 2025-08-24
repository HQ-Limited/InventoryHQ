import {
    Col,
    Row,
    Tree,
    Dropdown,
    MenuProps,
    Button,
    Typography,
    Form,
    Input,
    TreeSelect,
    Grid,
    Flex,
    App,
    Spin,
    Popconfirm,
} from 'antd';
import categoryService from '../../../services/categoryService';
import { useEffect, useState } from 'react';
import { Category, CreateCategory, EditCategory } from './types/CategoryTypes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { EventDataNode } from 'antd/es/tree';
import { AxiosError } from 'axios';
import { TreeType } from '../../../types/TreeType';

const ParentSelect = ({ categories }: { categories: TreeType[] }) => {
    return (
        <Form.Item label="Parent" name="parentId">
            <TreeSelect
                showSearch
                style={{ width: '100%' }}
                styles={{
                    popup: { root: { maxHeight: 400, overflow: 'auto' } },
                }}
                allowClear
                treeNodeFilterProp="name"
                treeLine
                treeData={categories}
                fieldNames={{
                    value: 'id',
                    label: 'name',
                    children: 'children',
                }}
            />
        </Form.Item>
    );
};

const { useBreakpoint } = Grid;
const { Search } = Input;

const View: React.FC = () => {
    const { message } = App.useApp();
    const [categoriesTree, setCategoriesTree] = useState<TreeType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNode, setEditingNode] = useState<TreeType | null>(null);
    const [selectedNode, setSelectedNode] = useState<EventDataNode<TreeType> | TreeType | null>(
        null
    );
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const [formHidden, setFormHidden] = useState(true);
    const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    const [searchResultsIds, setSearchResultsIds] = useState<number[]>([]);
    const [draggingNode, setDraggingNode] = useState<HTMLElement | null>(null);

    const fetchCategories = async () => {
        const [categoriesTree, categories] = await Promise.all([
            categoryService.getNestedCategoriesTree(),
            categoryService.getCategories(),
        ]);
        setCategoriesTree(categoriesTree);
        setCategories(categories);
    };

    useEffect(() => {
        setLoading(true);
        fetchCategories()
            .then(() => {
                form.resetFields();
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const onRightClick = ({ node }: { node: EventDataNode<TreeType> }) => {
        setSelectedNode(node);
    };

    const onDelete = async () => {
        try {
            if (!selectedNode) return;
            await categoryService.deleteCategory(selectedNode.id as number);
            await fetchCategories();
            message.success('Category deleted successfully');
        } catch (e) {
            const err = e as AxiosError;
            message.error((err.response?.data as string) || 'Failed to delete category');
        }
    };

    const contextMenuItems: MenuProps['items'] = [
        {
            label: 'Edit',
            key: 'edit',
            icon: <EditOutlined />,
            onClick: async () => {
                setEditingNode(selectedNode as TreeType);
                setFormHidden(false);
                form.setFieldsValue(selectedNode as EditCategory);
            },
        },
        {
            label: (
                <Popconfirm
                    title="Deleting this category will also delete all its children categories and any products assigned to them."
                    onConfirm={onDelete}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                >
                    Delete
                </Popconfirm>
            ),
            key: 'delete',
            danger: true,
            icon: <DeleteOutlined />,
        },
    ];

    const onFinish = async (values: CreateCategory | EditCategory) => {
        setCreateCategoryLoading(true);
        try {
            if ('id' in values) await categoryService.editCategory(values as EditCategory);
            else await categoryService.createCategory(values as CreateCategory);

            setEditingNode(null);
            setFormHidden(true);
            form.resetFields();

            await fetchCategories();
            message.success(`Category ${'id' in values ? 'updated' : 'created'} successfully`);
        } catch (e) {
            const err = e as AxiosError;
            message.error(
                (err.response?.data as string) ||
                    `Failed to ${'id' in values ? 'update' : 'create'} category`
            );
        } finally {
            setCreateCategoryLoading(false);
        }
    };

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchValue(value);

        if (value === '' || value.length < 3) {
            setExpandedKeys([]);
            setSearchResultsIds([]);
            return;
        }

        // Find the nodes that contains the search value
        const nodes = categories.filter((category) =>
            category.name.toLowerCase().includes(value.toLowerCase())
        );
        const idsToExpand = new Set<number>();
        const idsToSelect = new Set<number>();

        for (const node of nodes) {
            let noParent = node.parentId !== null;
            let currentNode = node;

            while (noParent) {
                idsToExpand.add(currentNode.parentId!);
                currentNode = categories.find((category) => category.id === currentNode.parentId)!;
                noParent = currentNode.parentId !== null;
            }

            idsToSelect.add(node.id);
        }

        setExpandedKeys(Array.from(idsToExpand));
        setSearchResultsIds(Array.from(idsToSelect));
    };

    function onDragStart({ event }: { event: React.MouseEvent<HTMLDivElement> }) {
        setDraggingNode(event.target as HTMLElement);
    }

    async function onDrop({
        event,
        node,
        dragNode,
    }: {
        event: React.MouseEvent<HTMLDivElement>;
        node: TreeType;
        dragNode: TreeType;
    }) {
        try {
            const category = categories.find((c) => c.id === dragNode.id)!;

            if (draggingNode == event.target) category.parentId = null;
            else category.parentId = node.id;
            await categoryService.editCategory(category);
        } catch (e) {
            const err = e as AxiosError;
            message.error((err.response?.data as string) || 'Failed to update category parent');
        }

        await fetchCategories();
    }

    return (
        <Row gutter={32}>
            <Col
                xs={24}
                xl={6}
                style={{ borderRight: screens.lg ? '1px solid #333' : 'none', marginBottom: 16 }}
            >
                {!screens.lg && formHidden ? (
                    <Button type="primary" onClick={() => setFormHidden(false)}>
                        Create category
                    </Button>
                ) : (
                    <Form layout="vertical" form={form} onFinish={onFinish}>
                        {editingNode && <Form.Item name="id" hidden></Form.Item>}

                        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <ParentSelect categories={categoriesTree} />

                        <Flex justify="end" gap={16} style={{ marginTop: 16 }}>
                            {(!screens.lg || editingNode) && (
                                <Button
                                    onClick={() => {
                                        setEditingNode(null);
                                        setFormHidden(true);
                                        form.resetFields();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createCategoryLoading}
                            >
                                {editingNode ? 'Save' : 'Create'} category
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Col>
            <Col xs={24} xl={18}>
                <Spin spinning={loading} size="large" style={{ height: '100vh' }}>
                    <Search placeholder="Search (min. 3 characters)" onChange={onSearch} />
                    <Typography.Text type="secondary">
                        Right-click on a category to open the context menu.
                    </Typography.Text>
                    <Dropdown
                        onOpenChange={(open) => {
                            if (!open) setSelectedNode(null);
                        }}
                        menu={{ items: contextMenuItems }}
                        trigger={['contextMenu']}
                    >
                        <Tree
                            draggable
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                            onExpand={(keys, info) => {
                                if (info.node.isLeaf) return;
                                setExpandedKeys(keys as number[]);
                            }}
                            expandedKeys={expandedKeys}
                            blockNode
                            onRightClick={onRightClick}
                            filterTreeNode={(node) => {
                                return (
                                    node.id === selectedNode?.id ||
                                    searchResultsIds.includes(node.id)
                                );
                            }}
                            titleRender={(node) => {
                                if (searchResultsIds.includes(node.id)) {
                                    const searchValueLower = searchValue.toLowerCase();
                                    const startIndex = node.name
                                        .toLowerCase()
                                        .indexOf(searchValueLower);
                                    const endIndex = startIndex + searchValueLower.length;

                                    const before = node.name.slice(0, startIndex);
                                    const match = node.name.slice(startIndex, endIndex);
                                    const after = node.name.slice(endIndex);

                                    return (
                                        <Typography.Text>
                                            {before}
                                            <Typography.Text mark={true}>{match}</Typography.Text>
                                            {after}
                                        </Typography.Text>
                                    );
                                }

                                return node.name;
                            }}
                            selectable={false}
                            fieldNames={{
                                key: 'id',
                                title: 'name',
                                children: 'children',
                            }}
                            treeData={categoriesTree}
                        />
                    </Dropdown>
                </Spin>
            </Col>
        </Row>
    );
};

export default View;
