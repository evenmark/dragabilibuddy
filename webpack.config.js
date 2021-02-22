const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const module = {
  rules: [
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
        },
        },
    },
  ],
};

module.exports = [
  {
    entry: './lib/index.js',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.js',
    },
    module,
  },
  {
    entry: './demo/index.js',
    output: {
        path: path.join(__dirname, '/demo'),
        filename: 'index.js',
    },
    devServer: {
        inline: true,
        port: 8001,
    },
    module,
    plugins:[
        new HtmlWebpackPlugin({
          template: './demo/index.html',
        }),
    ],
  },
];
