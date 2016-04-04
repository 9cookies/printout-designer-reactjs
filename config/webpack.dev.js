var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.join(__dirname, '..', 'src');

module.exports = {
  debug: true,
  devtool: 'eval-source-map',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client', 
    './src/index.tsx',
  ],
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel', 'ts'],
        include: APP_DIR
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: APP_DIR
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    root: [path.resolve('../src')],
    extensions: ['', '.jsx', '.js', '.tsx', '.ts']
  }
};
