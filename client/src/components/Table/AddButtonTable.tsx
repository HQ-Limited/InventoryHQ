import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function AddButtonTable({
    disabled = false,
    onClick,
    style,
    text = 'Add',
}: {
    disabled?: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
    text?: string;
}) {
    const elementStyle = {
        width: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        ...style,
    };
    return (
        <Button
            icon={<PlusOutlined />}
            onClick={onClick}
            size="large"
            style={elementStyle}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}
