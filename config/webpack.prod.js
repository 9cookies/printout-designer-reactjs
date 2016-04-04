var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.join(__dirname, '..', 'src');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index.tsx'
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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
    root: [path.resolve('../src')],
    extensions: ['', '.jsx', '.js', '.tsx', '.ts']
  }
}
