const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const fileNamePrefix = isProduction ? '[contenthash].' : '';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/js/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name].js`,
    clean: true,
  },
  target: 'web',
  devtool: isProduction ? 'inline-source-map' : 'source-map',
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: isProduction ? [MiniCssExtractPlugin.loader, 'css-loader'] : ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL || ''),
      GMAP_KEY: JSON.stringify(process.env.GMAP_KEY || '')
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  }
};

if (isProduction) {
  module.exports.plugins.push(
    new MiniCssExtractPlugin({
      filename: `${fileNamePrefix}style.css`
    })
  );
}

