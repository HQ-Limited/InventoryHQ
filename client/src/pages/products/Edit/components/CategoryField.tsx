import { Form, TreeSelect } from 'antd';
import { CategoriesTree } from '../../../../types/ProductTypes';

export default function CategoryField({ categoriesTree }: { categoriesTree: CategoriesTree[] }) {
    const form = Form.useFormInstance();
    return (
        <Form.Item label="Categories" name="selectedCategories">
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
                value={form.getFieldValue('categories')?.map((a) => a.id)}
            />
        </Form.Item>
    );
}
