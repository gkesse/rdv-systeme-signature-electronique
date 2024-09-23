import AppLogo from "../data/img/png/logo48.png"

export const appConfig = {
    appLogo: AppLogo,
    appId: process.env.REACT_APP_APP_ID ? process.env.REACT_APP_APP_ID : "",
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ? process.env.REACT_APP_GOOGLE_CLIENT_ID : "",
    settings: [
        {
            role: "contracts_Admin",
            menuId: "VPh91h0ZHk",
            pageType: "dashboard",
            pageId: "35KBoSgoAK",
            extended_class: "contracts_Users"
        },
        {
            role: "contracts_OrgAdmin",
            menuId: "VPh91h0ZHk",
            pageType: "dashboard",
            pageId: "35KBoSgoAK",
            extended_class: "contracts_Users"
        },
        {
            role: "contracts_Editor",
            menuId: "H9vRfEYKhT",
            pageType: "dashboard",
            pageId: "35KBoSgoAK",
            extended_class: "contracts_Users"
        },
        {
            role: "contracts_User",
            menuId: "H9vRfEYKhT",
            pageType: "dashboard",
            pageId: "35KBoSgoAK",
            extended_class: "contracts_Users"
        }
    ]
};
