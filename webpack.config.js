/* eslint-disable import/no-commonjs */

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    mode: 'development',
    entry: ['@babel/polyfill', './src/server.js'],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      publicPath: '/',
    },
    devtool: 'source-map',
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    externals: nodeExternals(),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
  },
  {
    mode: 'development',
    entry: ['@babel/polyfill', './src/app/browser.js'],
    output: {
      path: path.join(__dirname, 'dist/assets'),
      publicPath: '/',
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  },
];
