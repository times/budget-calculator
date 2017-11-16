const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

// The top-level component (entry file)
const entryFile = JSON.parse(fs.readFileSync('package.json', 'utf8')).main;

// Get all the components
const componentFilePath = path.resolve(__dirname, '../app');
const componentFiles = fs
  .readdirSync(componentFilePath)
  .filter(f => fs.statSync(path.join(componentFilePath, f)).isDirectory())
  .filter(f => f !== 'static');

// Build the components into an object for the webpack config
const componentFileObj = componentFiles.reduce(
  (obj, f) => Object.assign({ [f]: `./app/${f}/script.js` }, obj),
  {}
);

// Create one StaticSiteGeneratorPlugin instance per component
const staticSiteGenerators = componentFiles.map(
  f => new StaticSiteGeneratorPlugin(f, [`./${f}/index.html`])
);

// Plugins common to every config
const plugins = [new ExtractTextPlugin('[name]/styles.css')].concat(
  staticSiteGenerators
);

// The base config
const config = {
  // Entry points (one per component)
  entry: componentFileObj,
  // Output destinations (one folder per component)
  output: {
    filename: '[name]/bundle.js',
    library: 'times-component',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      // Lint our JS files
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../app')],
        exclude: [/(node_modules)/, path.resolve(__dirname, '../app/index.js')], // Exclude app/index.js because eslint has a problem with it
        use: [
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre',
            },
          },
        ],
      },
      // Compile JS files with Babel
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../app')],
        exclude: [/(node_modules)/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            },
          },
        ],
      },
      // Compile SCSS files to CSS and then extract into separate files
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '../app')],
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader!sass-loader',
          fallbackLoader: 'style-loader',
        }),
      },
      // Allow images to be require()'d inside JS files
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        include: [path.resolve(__dirname, '../app/static')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `./[hash].[ext]`,
            },
          },
        ],
      },
    ],
  },
  plugins: plugins,
};

module.exports = {
  base: config,
};
