import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },
        fallbackLng: "en",
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"]
        },
        ns: ["translation"],
        defaultNS: "translation",
        debug: false,
        interpolation: {
            escapeValue: false
        },
        whitelist: ["en", "fr"]
    });

export default i18n;
