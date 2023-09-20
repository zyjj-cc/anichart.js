const path = require('path')
module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'anichart.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'anichart',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: { configFile: 'tsconfig.json' },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: '/node_modules/',
      },
    ],
  },
}
