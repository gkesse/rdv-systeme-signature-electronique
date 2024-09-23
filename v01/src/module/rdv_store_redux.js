import { configureStore } from "@reduxjs/toolkit";
import rdv_app_config_redux from "./rdv_app_config_redux";

export const store = configureStore({
    reducer: {
        appConfig: rdv_app_config_redux
    }
});
