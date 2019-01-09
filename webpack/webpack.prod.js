const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = merge(common.webpackConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ImageminPlugin({
      optipng: {
        optimizationLevel: 7
      },
      pngquant: {
        quality: '70',
        speed: 1
      }
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          ie8: false,
          ecma: 8,
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            dead_code: true,
            warnings: true
          },
          warnings: false
        }
      })
    ]
  }
});
