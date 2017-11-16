const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Import the base config
const { base } = require('./base.config');

// Plugins used only for dev
const plugins = [
  // Clear out the /.tmp directory
  new CleanWebpackPlugin(['.tmp'], {
    root: path.resolve(__dirname, '..'),
  }),
  // BrowserSync for live-reloading
  new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    server: {
      baseDir: ['./'],
      // Map some directories so that the filepaths work out
      routes: {
        '/.tmp/budget-calculator': '.tmp',
        '/.tmp': 'bower_components',
      },
    },
  }),
];

// The dev specific config
const config = {
  output: {
    path: path.resolve(__dirname, '../.tmp'),
  },

  module: {
    rules: [],
  },

  plugins: [].concat(base.plugins, plugins),
};

// Merge over the top of the base config
module.exports = _.merge({}, base, config);
