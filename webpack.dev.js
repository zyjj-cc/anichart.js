const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = merge(common, {
  entry: {
    anichart: './src/index.ts',
    test: './src/test/index.ts',
  },
  output: {
    filename: '[name].js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/test'),
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Test',
      meta: {
        referrer: 'never',
      },
    }),
  ],
})
