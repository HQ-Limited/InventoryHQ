export default function RequiredFieldText({ children }: { children: React.ReactNode }) {
    return (
        <span className="ant-form-item">
            <span className="ant-form-item-label">
                <label className="ant-form-item-required">{children}</label>
            </span>
        </span>
    );
}
