const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    projectController:  './src/controller/project-controller.js',
    storageController:  './src/controller/storage-controller.js',
    index:              './src/index.js',
    project:            './src/modules/project.js',
    todo:               './src/modules/todo.js',
    button:             './src/utilities/button.js',
    domManager:         './src/utilities/dom-manager.js',
    uiController:       './src/view/ui-controller.js',
    uiProjectCtrl:      './src/view/ui-project-controller.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'WebPage Title',
      template: './src/index.html',
      favicon: './src/assets/icon/site.ico',
      inject: 'body',
      cache: false,
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'src/assets'),
      Controller: path.resolve(__dirname, 'src/controller'),
      Modules: path.resolve(__dirname, 'src/modules'),
      Style: path.resolve(__dirname, 'src/style'),
      Utilities: path.resolve(__dirname, 'src/utilities'),
      View: path.resolve(__dirname, 'src/view'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            // Creates `style` nodes from JS strings
            loader: 'style-loader',
          },
          {
            // Translates CSS into CommonJS
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
        // Use 'generator' to output unique name (based on webpack pattern e.g. [name], [ext], etc.)
        generator: {
          filename: "[name][ext][query]",
          outputPath: "images/",
          publicPath: "images/",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: "[name][ext][query]",
          outputPath: "fonts/",
          publicPath: "fonts/",
        },
      }
    ],
  },
};