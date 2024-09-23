import { useEffect, useState } from "react";
import Title from "./rdv_title";
import { useDispatch } from "react-redux";
import { fetchAppConfig } from "./rdv_app_config_redux";
import Loader from "./rdv_loader";
import { appConfig } from "./rdv_app_config";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleSignInBtn from "./rdv_login_google";
import LoginImg from "../data/img/svg/ms_edge.svg";
import SelectLanguage from "./rdv_select_language";
import Alert from "./rdv_alert";
import ModalUi from "./rdv_modal_ui";
import Parse from "parse";

function Login() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        isLoading: false,
        alertType: "success",
        alertMsg: "",
        email: "",
        passwordVisible: false,
        password: "",
    });
    const [image, setImage] = useState();
    const [isLoginSSO, setIsLoginSSO] = useState(false);
    const navigate = useNavigate();
    const [isModal, setIsModal] = useState(false);

    useEffect(() => {
        checkUserExt();
    });

    const checkUserExt = async () => {
        setImage(appConfig.appLogo);
        dispatch(fetchAppConfig());
    };

    const handleSubmit = async (event) => {
        localStorage.removeItem("accesstoken");
        event.preventDefault();
        const { email, password } = state;

        if (email && password) {
            try {
                const user = await Parse.User.logIn(email, password);
                console.log(user);

            } catch (error) {
                setState({
                    ...state,
                    isLoading: false,
                    alertType: "danger",
                    alertMsg: "Invalid username or password!"
                });
                console.error("Error while logging in user|error=", error);
            } finally {
                setTimeout(() => setState((prev) =>
                    ({ ...prev, alertMsg: "" })), 2000);
            }
        }

        console.log("===>|email=" + email);
        console.log("===>|password=" + password );
    };

    const handleChange = (event) => {
        let { name, value } = event.target;
        if (name === "email") {
            value = value?.toLowerCase()?.replace(/\s/g, "");
        }
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <Title title={"ReadySign™ - Connexion d'utilisateur"} />
            {state.isLoading && (
                <div
                    className="fixed w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50"
                    aria-live="assertive"
                >
                    <Loader />
                </div>
            )}
            {appConfig && appConfig.appId ? (
                <>
                    <div
                        className="md:p-10 lg:p-16"
                        role="region"
                        aria-labelledby="loginHeading"
                    >
                        <div className="md:p-4 lg:p-10 p-4 bg-base-100 text-base-content rdv-card">
                            <div className="w-[250px] h-[66px] inline-block overflow-hidden">
                                {image && (
                                    <img
                                        className="object-contain h-full"
                                        src={image}
                                        alt="app-logo"
                                    />
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                                <div>
                                    <form aria-label="Login Form" onSubmit={handleSubmit}>
                                        <h1 className="text-[30px] mt-6">{t("welcome")}</h1>
                                        <fieldset>
                                            <legend className="text-[12px] text-[#878787]">
                                                {t("Login-to-your-account")}
                                            </legend>
                                            <div className="w-full px-6 py-3 my-1 rdv-card bg-base-100 shadow-md outline outline-1 outline-slate-300/50">
                                                <label className="block text-xs" htmlFor="email">
                                                    {t("email")}
                                                </label>
                                                <input
                                                    className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    autoComplete="username"
                                                    value={state.email}
                                                    onChange={handleChange}
                                                    onInput={(e) => e.target.setCustomValidity("")}
                                                    onInvalid={(e) =>
                                                        e.target.setCustomValidity(t("input-required"))
                                                    }
                                                    required
                                                />
                                                <hr className="my-1 border-none" />
                                                {!isLoginSSO && (
                                                    <>
                                                        <label className="block text-xs" htmlFor="password">
                                                            {t("password")}
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                                                id="password"
                                                                type={
                                                                    state.passwordVisible ? "text" : "password"
                                                                }
                                                                name="password"
                                                                value={state.password}
                                                                autoComplete="current-password"
                                                                onChange={handleChange}
                                                                onInvalid={(e) =>
                                                                    e.target.setCustomValidity(
                                                                        t("input-required")
                                                                    )
                                                                }
                                                                onInput={(e) => e.target.setCustomValidity("")}
                                                                required
                                                            />
                                                            <span
                                                                className="absolute cursor-pointer top-[50%] right-[10px] -translate-y-[50%] text-base-content"
                                                            >

                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="relative mt-1">
                                                    <NavLink
                                                        className="text-[13px] rdv-link rdv-link-primary underline-offset-1 focus:outline-none ml-1"
                                                        to="/forget-password"
                                                    >
                                                        {t("forgot-password")}
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center text-xs font-bold mt-2">
                                            <button
                                                className="rdv-btn rdv-btn-primary"
                                                type="submit"
                                                disabled={state.isLoading}
                                            >
                                                {state.isLoading ? t("loading") : t("login")}
                                            </button>
                                            <button
                                                className="rdv-btn rdv-btn-accent"
                                                disabled={state.isLoading}
                                                onClick={() =>
                                                    navigate(
                                                        location.search
                                                            ? "/signup" + location.search
                                                            : "/signup"
                                                    )
                                                }
                                            >
                                                {t("create-account")}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="rdv-divider my-4 text-sm">{t("or")}</div>
                                    <div className="flex flex-col justify-center items-center gap-y-3">
                                        <GoogleSignInBtn />
                                        <div
                                            className="cursor-pointer border-[1px] border-gray-300 rounded px-[40px] py-2 font-semibold text-sm hover:border-[#d2e3fc] hover:bg-[#ecf3feb7]"
                                        >
                                            {t("sign-SSO")}
                                        </div>
                                    </div>
                                </div>
                                <div className="place-self-center">
                                    <div className="mx-auto md:w-[300px] lg:w-[400px] xl:w-[500px]">
                                        <img
                                            src={LoginImg}
                                            alt="L'image montre une personne de dos, assise à un bureau avec un ordinateur à quatre écrans, dans un environnement aux couleurs bleu clair et blanc, avec une plante en pot à droite."
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SelectLanguage />
                        <Alert type={state.alertType}>{state.alertMsg}</Alert>
                    </div>
                    <ModalUi
                        title={t("additional-info")}
                        isOpen={isModal}
                        showClose={false}
                    >
                        <form className="px-4 py-3 text-base-content">
                            <div className="mb-3">
                                <label
                                    className="block text-xs text-gray-700 font-semibold"
                                >
                                    {t("company")}{" "}
                                    <span className="text-[red] text-[13px]">*</span>
                                </label>
                                <input
                                    className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                    id="Company"
                                    type="text"
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    className="block text-xs text-gray-700 font-semibold"
                                >
                                    {t("job-title")}{" "}
                                    <span className="text-[red] text-[13px]">*</span>
                                </label>
                                <input
                                    className="rdv-input rdv-input-bordered rdv-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                                    id="JobTitle"
                                    type="text"
                                />
                            </div>

                            <div className="mt-4 gap-2 flex flex-row">
                                <button
                                    className="rdv-btn oprdv-btn-primary"
                                    type="button"
                                >
                                    {t("login")}
                                </button>
                                <button
                                    className="rdv-btn rdv-btn-ghost"
                                    type="button"
                                >
                                    {t("cancel")}
                                </button>
                            </div>
                        </form>
                    </ModalUi>
                </>
            ) : (
                <div
                    className="fixed w-full h-full flex justify-center items-center z-50"
                    aria-live="assertive"
                >
                    <Loader />
                </div>
            )}
        </div>
    );
}

export default Login;
