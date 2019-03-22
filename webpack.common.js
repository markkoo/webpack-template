const pathHelper = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // create index.html
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // split out css 
const webpack = require('webpack');

module.exports = {
    entry: {
        'index': pathHelper.resolve(__dirname, 'index.ts')
    },
    plugins: [
        new CleanWebpackPlugin(['wwwroot/assets']),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].css'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: pathHelper.resolve(__dirname, 'index-template.html'),
            inject: true,
            filename: pathHelper.resolve(__dirname, 'index.html'),
        })
    ],
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
            minSize: 30000,
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
                test: /\.(gif|png|jpe?g)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // limit should be 8192, but 因为 ldjson 和 fb 都不可以放 base64, 但又没有方法 disable 某一些 image 不然它变 base64, 只好把全部都关掉不转 base64 了. 
                            limit: 1, 
                            fallback: 'file-loader',
                            outputPath: '/',
                            publicPath: '/assets/'
                        }
                    },
                  {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                          progressive: true,
                          quality: 65
                        }
                      }
                  },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        //outputPath: '/',
                        publicPath: '/assets/'
                    }
                }]
            },
            {
                test: /\.webmanifest$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/assets/'
                    }
                  }
                ]
              }
        ]
    }
};
