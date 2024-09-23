import { Helmet } from "react-helmet";

function Title({title}) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={title} />
            <link rel="icon"
                type="image/png"
                sizes="40x40"
                href={localStorage.getItem("appLogo")}
            />
        </Helmet>
    );
}

export default Title;
