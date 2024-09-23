const path = require("path");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { watch } = require("fs");

const isProduction = (process.env.NODE_ENV !== "development");

module.exports = {
    mode: isProduction ? "production" : "development",
    context: path.join(__dirname, 'src'),
    entry: "./script/rdv_public_template.js",
    output: {
        path: path.resolve(__dirname, "public/static/js"),
        filename: "rdv_public_template.bundle.js",
        library: {
            name: "rdv_public_template",
            type: "umd",
            umdNamedDefine: true,
        },
        globalObject: "this",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader :
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "data/img/[name].[hash].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
    plugins: [
        new Dotenv(),
        ...(isProduction ? [
                new MiniCssExtractPlugin({
                    filename: "rdv_public_template.bundle.css"
                })
            ] : []
        )
    ],
    optimization: {
        minimize: isProduction ? true : false,
        minimizer: [new TerserPlugin()]
    },
    devtool: isProduction ? "source-map" : "inline-source-map"
};
