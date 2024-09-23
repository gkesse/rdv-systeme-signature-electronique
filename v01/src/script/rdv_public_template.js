import { pdfjs } from "react-pdf";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../module/rdv_store_redux";
import Parse from "parse";
import PdfRequestFiles from "../module/rdv_pdf_request_files";
import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const appId = process.env.REACT_APP_APP_ID;
const serverUrl = process.env.REACT_APP_SERVER_URL;

localStorage.setItem("baseUrl", serverUrl);
localStorage.setItem("parseAppId", appId);

Parse.initialize(appId);
Parse.serverURL = serverUrl;

const scriptComponent = document.createElement("div");
scriptComponent.id = "script-component";
document.body.appendChild(scriptComponent);

const link = document.createElement("link");
link.href = "https://cdn.opensignlabs.com/fonts.css";
link.rel = "stylesheet";
document.head.appendChild(link);

const tailwindCssLink = document.createElement("link");
tailwindCssLink.href = "http://localhost:3000/static/js/rdv_public_template.bundle.css";
tailwindCssLink.rel = "stylesheet";
document.head.appendChild(tailwindCssLink);

const PublicScriptFileWrapper = ({ initialProps }) => {
    const [props, setProps] = useState(initialProps);

    useEffect(() => {
        window.updatePublicTemplateProps = setProps;

        return (() => {
            window.updatePublicTemplateProps = undefined;
        });
    }, []);

    return (<PdfRequestFiles {...props} />);
};

const root = ReactDOM.createRoot(document.getElementById("script-component"));

root.render(
    <div data-theme="readysigncss">
        <Provider store={store}>
            <PublicScriptFileWrapper initialProps={{text: "templateId"}}/>
        </Provider>
    </div>
);
