const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist',
        //  hot: true // hot module 
    },
    plugins: [
        //  new webpack.NamedModulesPlugin(), // hot module 
        //  new webpack.HotModuleReplacementPlugin() // hot module 
    ]
});