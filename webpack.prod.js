const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    plugins: [
        // tree share and 压缩 执行 webpack -p 更好
        //  new UglifyJSPlugin({
        //    sourceMap: true
        //  }),
        //  new webpack.DefinePlugin({
        //    'process.env.NODE_ENV': JSON.stringify('production')
        //  })
    ]
});