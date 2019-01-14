const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appTitle = 'Ribbon';
const appVersion = '0.1';

const basePath = __dirname + '/..';
exports.basePath = basePath;

exports.webpackConfig = {
  entry: {
    main: path.resolve(basePath, 'src/scripts/main.ts')
  },
  output: {
    path: path.resolve(basePath, 'build/js'),
    filename: '[name].js',
    publicPath: 'js/'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      // FOLLOW tsconfig.json: "include": [
      path.resolve(basePath, 'src/scripts'),
      path.resolve(basePath, 'node_modules')
    ],
    alias: {
      // FOLLOW tsconfig.json: "paths": {
      phaser: path.resolve(basePath, 'node_modules/phaser/src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        query: {
          pretty: true
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'typed-css-modules-loader',
            options: {
              camelCase: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: basePath,
      exclude: [],
      verbose: true
    }),
    new webpack.DefinePlugin({
      // App Config
      APP_TITLE: JSON.stringify(appTitle),
      APP_VERSION: JSON.stringify(appVersion),

      // Phaser Build Config
      'typeof CANVAS_RENDERER': true,
      'typeof WEBGL_RENDERER': true,
      'typeof EXPERIMENTAL': false,
      'typeof PLUGIN_CAMERA3D': false,
      'typeof PLUGIN_FBINSTANT': false
    }),
    // Move .htmls to build to publish
    new HtmlWebpackPlugin({
      title: appTitle + ' v' + appVersion,
      filename: '../index.html',
      template: path.resolve(basePath, 'src/index.pug'),
      inject: true,
      alwaysWriteToDisk: true
    }),
    // Add defer property to auto inserted <script>
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: '../assets',
        ignore: ['.DS_Store']
      },
      {
        from: 'src/css',
        to: '../css',
        ignore: ['.DS_Store']
      }
    ])
  ],
  performance: {
    hints: false
  }
};
