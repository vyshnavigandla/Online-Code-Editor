/**
 * webpack-resolver.js
 * Custom webpack module resolver for Ace Editor.
 * Maps ace worker and mode paths to the correct built files.
 */

const path = require("path");

module.exports = {
  resolve: {
    alias: {
      ace: path.resolve(__dirname, "src"),
      "ace-min": path.resolve(__dirname, "src-min"),
      "ace-noconflict": path.resolve(__dirname, "src-noconflict"),
      "ace-min-noconflict": path.resolve(__dirname, "src-min-noconflict"),
    },
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
  plugins: [],
};
