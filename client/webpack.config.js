// Example webpack configuration with asset fingerprinting in production.
'use strict';

var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// must match config.webpack.dev_server.port
var production = process.env.NODE_ENV === 'production';
var devServerPort = 3808;
var root = process.cwd();

// set NODE_ENV=production on the environment to add asset fingerprints

var config = {
  entry: {
    application: path.join(root, 'app', 'startup', 'registration.js'),
    common: ['react', 'react-dom', 'react-on-rails']
  },

  output: {
    path: path.join(root, '..', 'public', 'assets'),
    publicPath: '/assets/',
    filename: production ? '[name]-[chunkhash:8].js' : '[name].js'
  },

  resolve: {
    root: root,
    extensions: ['', '.js', '.jsx'],
    alias: {
      styles: 'styles',
      components: 'app/components'
    }
  },

  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /\/node_modules\//
      },
      {
        loader: `file?name=${production ? '[name]-[hash:8].[ext]' : '[name].[ext]'}`,
        test: /\.(jpe?g|png|gif|woff)$/i
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract('css!postcss!sass')
      }
    ]
  },

  plugins: [
    // must match config.webpack.manifest_filename
    new StatsPlugin('manifest.json', {
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    }),
    new ExtractTextPlugin(production ? '[name]-[chunkhash:8].css' : '[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
  })],
  postcss: [
    require('autoprefixer')({
      browsers: ['last 20 versions']
    })
  ]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
  config.output.publicPath = '//localhost:' + devServerPort + '/assets/';
  config.devtool = 'source-map';
}

module.exports = config;
