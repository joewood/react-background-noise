const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: ["./test.tsx"],
    mode: "development",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "test.js",
        publicPath: "/",
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.glsl?$/,
                use: "webpack-glsl-loader",
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
