import { Form, TreeSelect } from 'antd';
import { DataNode } from 'antd/es/tree';
import { CategoriesTree } from '../../../types/ProductTypes';

export default function CategoryField({
    categoriesTree,
    onChange,
}: {
    categoriesTree: CategoriesTree[];
    onChange?: (value: number[]) => void;
}) {
    return (
        <Form.Item
            label="Categories"
            name="categories"
            rules={[{ required: true, message: 'Please select atleast one category!' }]}
        >
            <TreeSelect
                showSearch
                style={{ width: '100%' }}
                styles={{
                    popup: { root: { maxHeight: 400, overflow: 'auto' } },
                }}
                allowClear
                multiple
                treeDefaultExpandAll
                treeData={categoriesTree}
                onChange={onChange}
            />
        </Form.Item>
    );
}
