const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  plugins: [new HtmlWebpackPlugin()],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 8000,
  },
};
