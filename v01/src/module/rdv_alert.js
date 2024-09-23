const Alert = ({ children, type, className }) => {
    const textcolor = type ? theme(type) : theme();

    function theme(color) {
        switch (color) {
        case "success":
            return "rdv-alert-success";
        case "info":
            return "rdv-alert-info";
        case "danger":
            return "rdv-alert-error";
        case "warning":
            return "rdv-alert-warning";
        default:
            return "";
        }
    }

    return (
        children && (
            <div
                className={`${
                    className
                        ? className
                        : "z-[1000] fixed top-20 left-1/2 transform -translate-x-1/2 text-sm"
                }`}
            >
                <div className={`rdv-alert ${textcolor}`}>
                    <span className="ml-3">{children}</span>
                </div>
            </div>
        )
    );
};

export default Alert;
