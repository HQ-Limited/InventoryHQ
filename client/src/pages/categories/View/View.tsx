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
} from 'antd';
import categoryService from '../../../services/categoryService';
import { useEffect, useState } from 'react';
import { CategoryTree, CreateCategory, EditCategory } from './types/CategoryTypes';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { EventDataNode } from 'antd/es/tree';
import { AxiosError } from 'axios';

const ParentSelect = ({ categories }: { categories: CategoryTree[] }) => {
    return (
        <Form.Item label="Parent" name="parent">
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

const View: React.FC = () => {
    const { message } = App.useApp();
    const [data, setData] = useState<CategoryTree[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNode, setEditingNode] = useState<CategoryTree | null>(null);
    const [selectedNode, setSelectedNode] = useState<
        EventDataNode<CategoryTree> | CategoryTree | null
    >(null);
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const [formHidden, setFormHidden] = useState(true);
    const [createCategoryLoading, setCreateCategoryLoading] = useState(false);

    const fetchCategories = async () => {
        return await categoryService.getNestedCategoriesTree();
    };

    useEffect(() => {
        setLoading(true);

        fetchCategories()
            .then((categories) => {
                setData(categories);
                form.resetFields();
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const onRightClick = ({ node }: { node: EventDataNode<CategoryTree> }) => {
        setSelectedNode(node);
    };

    const contextMenuItems: MenuProps['items'] = [
        {
            label: 'Edit',
            key: 'edit',
            icon: <EditOutlined />,
            onClick: async () => {
                setEditingNode(selectedNode as CategoryTree);
                setFormHidden(false);
                form.setFieldsValue({
                    id: selectedNode!.id,
                    name: selectedNode!.name,
                    parent: selectedNode!.parentId,
                });
            },
        },
        {
            label: 'Delete',
            key: 'delete',
            danger: true,
            icon: <DeleteOutlined />,
        },
    ];

    const onFinish = async (values: CreateCategory | EditCategory) => {
        setCreateCategoryLoading(true);
        try {
            if (values?.id) await categoryService.editCategory(values as EditCategory);
            else await categoryService.createCategory(values as CreateCategory);
            setEditingNode(null);
            setFormHidden(true);
            form.resetFields();

            const categories = await fetchCategories();
            setData(categories);
            message.success(`Category ${values?.id ? 'updated' : 'created'} successfully`);
        } catch (e) {
            const err = e as AxiosError;
            message.error(
                (err.response?.data as string) ||
                    `Failed to ${values.id ? 'update' : 'create'} category`
            );
        } finally {
            setCreateCategoryLoading(false);
        }
    };

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
                        <Form.Item label="ID" name="id" hidden></Form.Item>
                        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <ParentSelect categories={data} />

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
                        // draggable
                        // onDragEnter={onDragEnter}
                        // onDrop={onDrop}
                        blockNode
                        onRightClick={onRightClick}
                        filterTreeNode={(node) => {
                            return node.id === selectedNode?.id;
                        }}
                        selectable={false}
                        fieldNames={{
                            key: 'id',
                            title: 'name',
                            children: 'children',
                        }}
                        treeData={data}
                    />
                </Dropdown>
            </Col>
        </Row>
    );
};

export default View;
