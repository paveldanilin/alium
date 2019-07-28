const Path                  = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CopyPlugin            = require('copy-webpack-plugin');


module.exports = {
    entry: './src/index.js',

    mode: "development",

    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        library: "app",
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: "this"
    },

    devServer: {
        contentBase: Path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },

    plugins: [
        new CopyPlugin([
            { from: './src/HomeComponent.html', to: 'templates/' },
            { from: './src/AboutComponent.html', to: 'templates/' },
            { from: './src/ContactsComponent.html', to: 'templates/' },
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            hash: true,
            inject: false
        }),
    ],

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './fonts',
                        },
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                ],
            },
        ]
    }
};
