import { Form, TreeSelect } from 'antd';
import { CategoriesTree } from '../../../../types/ProductTypes';

export default function CategoryField({ categoriesTree }: { categoriesTree: CategoriesTree[] }) {
    //TODO: Try to map the categories to form.categories instead of selectedCategories

    //TODO: Check out treeDataSimpleMode property (https://ant.design/components/tree-select?theme=dark#tree-props)
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
            />
        </Form.Item>
    );
}
