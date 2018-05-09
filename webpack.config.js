const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'whatwg-fetch',
        'babel-polyfill',
        'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails
         path.resolve(__dirname, 'lib/index'),
    ],
    target: 'web',
    output: {
        path: `${ __dirname }/src`,
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'lib'),
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/
        }),
    ],
    module: {
        loaders: [
            {
              test: /\.(js|jsx)$/,
              include: path.join(__dirname, 'lib'),
              loaders: [ 'babel-loader' ],
            },
            {
              test: /(\.css)$/,
              loaders: [
                'style-loader?sourceMap',
                'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
              ],
            },
            {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=100000',
            },
            {
              test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000',
            },
            {
              test: /\.(ttf|otf)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
            },
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
            },
        ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css' ],
    },
};
