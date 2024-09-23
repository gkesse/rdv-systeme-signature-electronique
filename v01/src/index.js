import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { DndProvider, Preview, MouseTransition, TouchTransition } from "react-dnd-multi-backend";
import { store } from "./module/rdv_store_redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import "./module/rdv_i18n"
import Parse from "parse";
import { appConfig } from "./module/rdv_app_config";

Parse.initialize(appConfig.appId);
Parse.serverURL = appConfig.serverURL;

const HTML5toTouch = {
    backends: [
        {
            id: "html5",
            backend: HTML5Backend,
            transition: MouseTransition
        },
        {
            id: "touch",
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition
        }
    ]
}

const generatePreview = (props) => {
    const { item, style } = props;
    const newStyle = {
        ...style
    };

    return (
        <div style={newStyle}>

        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Provider store={store}>
            <DndProvider options={HTML5toTouch}>
                <Preview>{generatePreview}</Preview>
                <App />
            </DndProvider>
        </Provider>
    </CookiesProvider>
);