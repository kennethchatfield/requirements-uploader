const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
    entry: [
        'whatwg-fetch',
        'babel-polyfill',
        'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails
        './lib/index'
    ],
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'bundle.js'
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader:'babel-loader' ,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.jsx','.css' ]
    }
};

module.exports = config;
