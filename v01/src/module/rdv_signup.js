import { useEffect, useState } from "react";
import Loader from "./rdv_loader";
import Title from "./rdv_title";
import { appConfig } from "./rdv_app_config";
import { useTranslation } from "react-i18next";
import Parse from "parse";
import { saveLanguageInLocal } from "./rdv_i18n_language";
import { openInNewTab } from "./rdv_link_external";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "./rdv_window_size";
import LoginImg from "../data/img/svg/ms_edge.svg";
import SelectLanguage from "./rdv_select_language";
import Alert from "./rdv_alert";

const Signup = () => {
    const [state, setState] = useState({
        isLoading: false,
        alertType: "success",
        alertMsg: ""
    });
    const [image, setImage] = useState();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [lengthValid, setLengthValid] = useState(false);
    const [isAuthorize, setIsAuthorize] = useState(false);

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        saveLogo();
    }, []);

    const saveLogo = async () => {
        setImage(appConfig?.appLogo || undefined);
    };

    const handleSubmit = (event) => {
        clearStorage();
    };

    const clearStorage = async () => {
        try {
            await Parse.User.logOut();
        } catch (error) {
            console.log("Erreur lors de la déconnexion.", error);
        }

        let baseUrl = localStorage.getItem("baseUrl");
        let appid = localStorage.getItem("parseAppId");
        let applogo = localStorage.getItem("appLogo");
        let defaultmenuid = localStorage.getItem("defaultmenuid");
        let PageLanding = localStorage.getItem("PageLanding");
        let userSettings = localStorage.getItem("userSettings");

        localStorage.clear();
        saveLanguageInLocal(i18n);

        localStorage.setItem("baseUrl", baseUrl);
        localStorage.setItem("parseAppId", appid);
        localStorage.setItem("appLogo", applogo);
        localStorage.setItem("defaultmenuid", defaultmenuid);
        localStorage.setItem("PageLanding", PageLanding);
        localStorage.setItem("userSettings", userSettings);
        localStorage.setItem("baseUrl", baseUrl);
        localStorage.setItem("parseAppId", appid);
    };

    const handlePasswordChange = (e) => {

    };

    return (
        <div className="">
            {state.isLoading && (
                <div className="fixed w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                    <Loader />
                </div>
            )}
            <Title title="ReadySign™ - Création d'un compte"/>
            {appConfig && appConfig.appLogo ? (
                <div className="md:p-10 lg:p-16">
                    <div className="md:p-4 lg:p-10 p-4 bg-base-100 text-base-content rdv-card">
                        <div className="w-[250px] h-[66px] inline-block overflow-hidden">
                            {image && (
                                <img src={image} className="object-contain h-full" alt="logo" />
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-[30px] mt-6">{t("create-account")}!</h2>
                                    <div className="w-full my-4 rdv-card bg-base-100 shadow-md outline outline-1 outline-slate-300/50">
                                        <div className="px-6 py-4 text-xs">
                                            <label className="block ">
                                                {t("name")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <input
                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                onInput={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                            <hr className="my-2 border-none" />
                                            <label>
                                                {t("email")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <input
                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value?.toLowerCase()?.replace(/\s/g, ""))}
                                                onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                onInput={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                            <hr className="my-2 border-none" />
                                            <label>
                                                {t("phone")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <input
                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                onInput={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                            <hr className="my-2 border-none" />
                                            <label>
                                                {t("company")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <input
                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                onInput={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                            <hr className="my-2 border-none" />
                                            <label>
                                                {t("job-title")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <input
                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                type="text"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                onInput={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                            <hr className="my-2 border-none" />
                                            <label>
                                                {t("password")}{" "}
                                                <span className="text-[red] text-[13px]">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => handlePasswordChange(e)}
                                                    onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                    onInput={(e) => e.target.setCustomValidity("")}
                                                    required
                                                />
                                                <span
                                                    className={`absolute top-[50%] right-[10px] -translate-y-[50%] cursor-pointer text-base-content`}
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? (
                                                        <i className="fa-light fa-eye-slash" />
                                                    ) : (
                                                        <i className="fa-light fa-eye" />
                                                    )}
                                                </span>
                                            </div>
                                            {password.length > 0 && (
                                                <div className="mt-1 text-[11px]">
                                                    <p
                                                        className={`${
                                                            lengthValid ? "text-green-600" : "text-red-600"
                                                        }`}
                                                    >
                                                        {lengthValid ? "✓" : "✗"}
                                                        {t("password-length")}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="mt-2.5 ml-1 flex flex-row items-center">
                                                <input
                                                    className="rdv-checkbox rdv-checkbox-sm"
                                                    type="checkbox"
                                                    id="termsandcondition"
                                                    checked={isAuthorize}
                                                    onChange={(e) => setIsAuthorize(e.target.checked)}
                                                    onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                                                    onInput={(e) => e.target.setCustomValidity("")}
                                                    required
                                                />
                                                <label
                                                    className="text-xs cursor-pointer ml-1 mb-0"
                                                    htmlFor="termsandcondition"
                                                >
                                                    {t("agreee")}
                                                </label>
                                                <span
                                                    className="underline cursor-pointer ml-1"
                                                    onClick={() => openInNewTab("https://www.opensignlabs.com/terms-and-conditions")}
                                                >
                                                    {t("term")}
                                                </span>
                                                <span>.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center text-xs font-bold mt-2">
                                        <button
                                            className="rdv-btn rdv-btn-primary"
                                            type="submit"
                                            disabled={state.isLoading}
                                        >
                                            {state.isLoading ? t("loading") : t("register")}
                                        </button>
                                        <button
                                            className="rdv-btn rdv-btn-secondary"
                                            type="button"
                                            disabled={state.isLoading}
                                            onClick={() => navigate(location.search ? "/" + location.search : "/")}
                                        >
                                            {t("login")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {width >= 768 && (
                                <div className="self-center">
                                    <div className="mx-auto md:w-[300px] lg:w-[400px] xl:w-[500px]">
                                        <img src={LoginImg} alt="loader" width="100%" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <SelectLanguage />
                    <Alert type={state.alertType}>{state.alertMsg}</Alert>
                </div>
            ) : (
                <div className="fixed w-full h-full flex justify-center items-center z-50">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Signup;
