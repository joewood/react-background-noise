const path = require("path");
var webpack = require("webpack");

module.exports = {
	entry: ["./test.tsx"],
	output: {
		pathinfo: true,
		filename: ".lib/test.js",
		publicPath: "/"
	},
	devtool: "cheap-module-source-map",
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
	},
	module: {
		loaders: [{ test: /\.ts.?$/, loader: "ts-loader" }]
	}
};
