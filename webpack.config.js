/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
"use strict";

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const webpack = require("webpack");

/** @type WebpackConfig */
const webExtensionConfig = {
  mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: "webworker", // extensions run in a webworker context
  entry: {
    extension: "./src/web/extension.ts",
    "test/suite/index": "./src/web/test/suite/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist/web"),
    libraryTarget: "commonjs",
    devtoolModuleFilenameTemplate: "../../[resource-path]",
  },
  resolve: {
    mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
    extensions: [".ts", ".js"], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      assert: require.resolve("assert"),
      // Polyfill Node.js for the jscad fakeFS
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
    new webpack.ProvidePlugin({
      process: "process/browser", // provide a shim for the global `process` variable
    }),
  ],
  externals: {
    vscode: "commonjs vscode", // ignored because it doesn't exist
  },
  performance: {
    hints: false,
  },
  devtool: "nosources-source-map", // create a source map that points to the original source file
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

/** @type WebpackConfig */
const webViewConfig = {
  mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: "web", // extensions run in a webworker context
  entry: {
    webview: "./webview/src/index.ts",
    webworker: "./webview/src/worker/webworker.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist/web"),
    devtoolModuleFilenameTemplate: "../../[resource-path]",
  },
  resolve: {
    mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
    extensions: [".ts", ".js"], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Polyfill Node.js for the jscad fakeFS
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
  ],
  performance: {
    hints: false,
  },
  devtool: "inline-source-map", // create a source map that points to the original source file
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

module.exports = [webExtensionConfig, webViewConfig];
