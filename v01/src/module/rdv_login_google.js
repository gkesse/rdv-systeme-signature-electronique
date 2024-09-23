import { useTranslation } from "react-i18next";
import Loader from "./rdv_loader";
import ModalUi from "./rdv_modal_ui";
import { useRef, useState } from "react";

const GoogleSignInBtn = (
    GoogleCred,
    thirdpartyLoginfn,
    thirdpartyLoader,
    setThirdpartyLoader
) => {
    const { t, i18n } = useTranslation();
    const [isModal, setIsModal] = useState(false);
    const googleBtn = useRef();

    return (
        <div className="relative">
            {thirdpartyLoader && (
                <div className="fixed flex justify-center items-center inset-0 bg-black bg-opacity-25 z-20 ">
                    <Loader />
                </div>
            )}
            <div ref={googleBtn} className="text-sm"></div>
            <ModalUi showClose={false} isOpen={isModal} title={t("sign-up-form")}>
                <form className="px-4 py-3 text-base-content">
                    <div className="mb-3">
                        <label className="block text-xs font-semibold">
                            {t("phone")} <span className="text-[13px] text-[red]">*</span>
                        </label>
                        <input
                            className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                            type="tel"
                            id="Phone"
                        />
                    </div>
                </form>
            </ModalUi>
        </div>
    );
};

export default GoogleSignInBtn;
