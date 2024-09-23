import { createSlice } from "@reduxjs/toolkit";
import { appConfig } from "./rdv_app_config";

const appConfigRedux = createSlice({
    name: "info",
    initialState: {},
    reducers: {
        fetchAppConfig: () => {
            localStorage.setItem("appLogo", appConfig.appLogo);
        }
    }
});

export const { fetchAppConfig } = appConfigRedux.actions;
export default appConfigRedux.reducer;
