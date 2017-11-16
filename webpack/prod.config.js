const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');

const CleanWebpackPlugin = require('clean-webpack-plugin');

// Import the base config
const { base } = require('./base.config');

// Plugins used only for prod
const plugins = [
  new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, '..'),
  }),
  new webpack.optimize.UglifyJsPlugin(),
];

// The prod specific config
const config = {
  output: {
    path: path.resolve(__dirname, '../dist/'),
  },
  plugins: [].concat(base.plugins, plugins),
};

// Merge over the top of the base config
module.exports = _.merge({}, base, config);
