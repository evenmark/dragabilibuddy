const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

const devMode = process.env.NODE_ENV !== 'production';

const rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
        ],
        plugins: [
          [
            '@babel/plugin-proposal-class-properties',
            { loose: true },
          ],
        ]
      },
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: devMode,
          importLoaders: 1,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: devMode,
        },
      },
    ],
  },
];

module.exports = [
  {
    entry: './lib/index.js',
    externals: [nodeExternals()],
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.js',
        library: {
          name: 'dragabilibuddy',
          type: 'umd',
        },
    },
    module: {
      rules,
    },
  },
  {
    entry: './demo/src/index.js',
    output: {
        path: path.join(__dirname, '/demo'),
        filename: 'index.js',
    },
    devServer: {
        inline: true,
        port: 8001,
        openPage: 'demo/index.html',
    },
    module: {
      rules,
    },
    plugins:[
        new HtmlWebpackPlugin({
          title: 'Dragabilibuddy Demo',
          template: './demo/src/index.html',
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
      }),
    ],
  },
];
