import { Suspense } from "react";
import Loader from "./rdv_loader";

const LazyPage = ({ Page }) => {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-[100vh]">
                    <Loader />
                </div>
            }
        >
            <Page />
        </Suspense>
    );
};

export default LazyPage;
