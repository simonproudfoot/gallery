const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')


const options = {
    devServer: false, // false or string with server entry point, e.g: app.js or
    outPutPath: false, // false for default webpack path of pass string to specify
    assetsPathPrefix: '',
    phpClassName: 'WebpackBuiltFiles', //
    phpFileName: 'WebpackBuiltFiles',
    nameSpace: false, // false {nameSpace: 'name', use: ['string'] or empty property or don't pass "use" property}
    path: ''
}

module.exports = {
    entry: path.resolve(__dirname, '../src/script.js'),
    output:
    {
        // hashFunction: 'xxhash64',
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:[
        
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new HtmlWebpackPlugin({
               // template: path.resolve(__dirname, '../src/index.html'),
                //template: `./test.pug`,
                template: path.resolve(__dirname, '../index.php'),
               // filename: `test.php`,
                foo: 'bar',
                minify: true
            }),
            new MiniCSSExtractPlugin()
        ],
    experiments: {

        topLevelAwait: true,
    },
    module:
    {
        rules:
            [{
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // HTML
            {
                test: /\.(html)$/,
             
                use:
                    [
                        'html-loader'
                    ]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                    [
                        'babel-loader'
                    ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                    [
                        MiniCSSExtractPlugin.loader,
                        'css-loader'
                    ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[hash][ext]'
                }
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[hash][ext]'
                }
            }
            ]
    }
}
