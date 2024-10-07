export const saveLanguageInLocal = (i18n) => {
    const detectedLanguage = i18n.language || "en";
    localStorage.setItem("i18nextLng", detectedLanguage);
};
