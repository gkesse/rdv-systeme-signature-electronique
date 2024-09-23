const ModalUi = ({
    children,
    title,
    isOpen,
    handleClose,
    showHeader = true,
    showClose = true,
    reduceWidth
}) => {
    const width = reduceWidth;

    return (
        <>
            {isOpen && (
                <dialog className="rdv-modal rdv-modal-open">
                    <div
                        className={`${
                            width || "md:min-w-[500px]"
                        } rdv-modal-box p-0 max-h-90 overflow-y-auto hide-scrollbar text-sm`}
                    >
                        {showHeader && (
                            <>
                                {title && (
                                    <h3 className="text-base-content font-bold text-lg pt-[15px] px-[20px]">
                                        {title}
                                    </h3>
                                )}
                                {showClose && (
                                    <button
                                        className="rdv-btn rdv-btn-sm rdv-btn-circle rdv-btn-ghost text-base-content absolute right-2 top-2"
                                        onClick={() => handleClose && handleClose()}
                                    >
                                        ✕
                                    </button>
                                )}
                            </>
                        )}
                        <div>{children}</div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default ModalUi;
