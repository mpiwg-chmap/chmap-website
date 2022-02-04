// const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    // Define the entry points of our application (can be multiple for different sections of a website)
    entry: {
        index: './src/js/index.js',
        map: './src/js/map.js'
    },

    // Define the destination directory and filenames of compiled resources
    output: {
        publicPath: '/',
        filename: "js/[name].[chunkhash].js",
        path: path.resolve(__dirname, "./dist")
    },

    // Define development options
    devtool: "source-map",

    devServer: {
      static: path.resolve(__dirname, './dist'), //default is ./public
      port: 8888,
    },

    optimization: {
        minimize: true,
        moduleIds: 'deterministic',
        runtimeChunk: true,
        // if chunks: 'all' adopted, leaflet component cannot be displayed in default. chunks: 'async' is default
        splitChunks: {
            chunks: 'async'
        }
    },

    performance: {
      hints: false,
    },

    resolve: {
        alias: {
            '~': require('path').resolve(__dirname, 'src', 'js'),
            '%': require('path').resolve(__dirname, 'src', 'js', 'components'),
        },
    },

    // Define loaders
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            // Use babel for JS files
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                }
            },
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            sourceMap: true,
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer',
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ],
            },
        ],
    },

    // Define used plugins
    plugins: [

        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: 'body',
            chunks: ['index'],
            template: 'public_html/index.html'
        }),

        new HtmlWebpackPlugin({
            filename: 'map.html',
            inject: 'body',
            chunks: ['map'],
            template: 'public_html/map.html'
        }),

        new HtmlInlineScriptPlugin([/runtime~.+[.]js$/]),

        // Extracts CSS into separate files
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),

        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'public') },
                { from: path.resolve(__dirname, 'fonts'),
                    to: 'css/fonts',
                },
                { from: path.resolve(__dirname, 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff'),
                  to: 'css/fonts/bootstrap-icons.woff',
                  toType: 'file'
                },
                { from: path.resolve(__dirname, 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2'),
                  to: 'css/fonts/bootstrap-icons.woff2',
                  toType: 'file'
                }
            ],
        }),
    ],
};

module.exports = (webpackEnv, argV) => {

    const isProduction = (argV.mode === "production");

    const dotenvCfg =  { path: "./.env_dev" };

    if (isProduction) {
        config.performance.hints = 'warning';
        dotenvCfg.path = "./.env_prd";
        config.output.publicPath = process.env.PUBLIC_URL || "/lgtu-new/";
    }

    // Load .env_dev file for environment variables in JS
    config.plugins.push(new Dotenv(dotenvCfg))

    return config;
};
