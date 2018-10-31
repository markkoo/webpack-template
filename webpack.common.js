const pathHelper = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // create index.html
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // split out css 
const webpack = require('webpack');
//  const InlineSourcePlugin = require('html-webpack-inline-source-plugin');

const entryPaths = [
    'Web/Home/home.ts'
];

const componentPaths = [
];

function changePathLastSegment(path, splitSymbol, to) {
    let segments = path.split(splitSymbol);
    segments.pop();
    segments.push(to);
    return segments.join(splitSymbol);
}

const entry = entryPaths.reduce((result, path, index) => {
    result[index.toString()] = pathHelper.resolve(__dirname, path);
    return result;
}, {});

const entryHtmlWebpacks = entryPaths.map((path, index) => {
    
    return new HtmlWebpackPlugin({
        template: pathHelper.resolve(__dirname, changePathLastSegment(path, '.', 'html')),
        inject: false,
        filename: pathHelper.resolve(__dirname, changePathLastSegment(path, '/', 'Index.html')),
        sName: index.toString()
    });
});

const compoentHtmlWebpacks = componentPaths.map(path => {
    return new HtmlWebpackPlugin({
        template: pathHelper.resolve(__dirname, path),
        inject: false,
        filename: pathHelper.resolve(__dirname, changePathLastSegment(path, '/', 'Default.cshtml'))
    });
});

const allHtmlWebpacks = entryHtmlWebpacks.concat(compoentHtmlWebpacks);
// allHtmlWebpacks.push(new HtmlWebpackPlugin({
//     template: pathHelper.resolve(__dirname, 'Web/Shared/layout.cshtml'),
//     inject: false,
//     filename: pathHelper.resolve(__dirname, 'Web/Shared/Index.cshtml')
// }));


module.exports = {
    entry: entry,
    plugins: allHtmlWebpacks.concat([
        new CleanWebpackPlugin(['assets']),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].css'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]),
    output: {
        publicPath: '/assets',
        // publicPath: '/',
        filename: '[name].[chunkhash].bundle.js',
        path: pathHelper.resolve(__dirname, 'assets')
    },
    // vendor
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== 'polyfills' && chunk.name !== 'landingPage';
            },
            minSize: 1,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 2,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'resolve-url-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader', // base64
                    options: {
                        limit: 8192,
                        fallback: 'file-loader',
                        outputPath: '/',
                        publicPath: '/assets/'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|webmanifest)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        //outputPath: '/',
                        publicPath: '/assets/'
                    }
                }]
            }
        ]
    }
};
