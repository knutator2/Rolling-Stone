const webpack = require('webpack')
const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }]
              ]
            }
          }]
      },
      {
        enforce: 'pre',
        test: /.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!postcss-loader!sass-loader',
          }
          // other vue-loader options go here
        }
      }
    ]
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      }
  },
  plugins: [
    new StylelintPlugin({
        files: ['**/*.vue']
    })
  ]
}

module.exports = config
