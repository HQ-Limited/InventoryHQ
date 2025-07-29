import { Form, TreeSelect } from 'antd';
import { Category } from '../types/EditProductTypes';

export default function CategoryField({
    categories,
    createNewCategory,
}: {
    categories: Category[];
    createNewCategory: (name: string) => Promise<void>;
}) {
    const prevCategories = Form.useWatch('categories');
    return (
        <Form.Item
            label="Categories"
            name="categories"
            getValueFromEvent={(values: (number | string)[]) => {
                if (values.length == 0) {
                    return [];
                }
                // find out which value was added/removed
                const added = values.find((v) => !prevCategories.find((a) => a.id == v));
                const removed = prevCategories.find((a) => !values.find((v) => v == a.id));

                if (removed) {
                    return prevCategories.filter((a: Category) => a.id != removed.id);
                }

                if (added) {
                    if (typeof added === 'string') {
                        createNewCategory(added);
                        return [
                            ...prevCategories,
                            {
                                name: added,
                                values: [],
                                isVariational: false,
                            },
                        ];
                    }
                    const category = categories.find((a) => a.id == added)!;
                    return [
                        ...prevCategories,
                        {
                            id: category.id,
                            name: category.name,
                            children: [],
                        },
                    ];
                }
            }}
            getValueProps={(value) => {
                return {
                    value: value.map((v: Category) => v.id),
                };
            }}
        >
            <TreeSelect
                showSearch
                style={{ width: '100%' }}
                styles={{
                    popup: { root: { maxHeight: 400, overflow: 'auto' } },
                }}
                allowClear
                multiple
                treeNodeFilterProp="title"
                treeDefaultExpandAll
                treeData={categories.map((c) => ({
                    id: c.id,
                    pId: c.parentId,
                    value: c.id,
                    title: c.name,
                }))}
                treeDataSimpleMode={true}
                treeLine
            />
        </Form.Item>
    );
}
