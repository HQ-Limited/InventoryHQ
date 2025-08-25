import { Button, Space } from 'antd';

import { Flex } from 'antd';

export const ActionButtons = ({
    close,
    clearFilters,
    applyFilters,
}: {
    close: () => void;
    clearFilters: () => void;
    applyFilters: () => void;
}) => {
    return (
        <Flex
            style={{
                marginTop: 10,
            }}
            justify="space-between"
        >
            <Button type="link" size="small" onClick={close}>
                Close
            </Button>
            <Space>
                <Button size="small" onClick={() => clearFilters()}>
                    Clear
                </Button>
                <Button size="small" type="primary" onClick={() => applyFilters()}>
                    Apply
                </Button>
            </Space>
        </Flex>
    );
};
