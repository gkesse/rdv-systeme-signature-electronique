import { useEffect, useState } from "react";
import AppLoader from "./module/rdv_loader_app";
import Login from "./module/rdv_login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleCredentials();
    }, []);

    const handleCredentials = () => {
        try {
            setIsLoading(false);
        } catch (error) {
            console.log("Le chargement de l'URL de base et l'API_ID a échoué.|error=", error);
        }
    };

    return (
        <div className="bg-base-200">
            {isLoading ? (
                <AppLoader />
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
}

export default App;
