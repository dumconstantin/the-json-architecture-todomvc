var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  entry: {
    server: [
      `webpack-dev-server/client?http://localhost:3000`,
      'webpack/hot/dev-server'
    ],
    app: [__dirname + '/src/entry.js'],
    vendor: [
      'jquery',
      'riot',
      'kefir',
      'ramda',
      'baobab',
      'json-patch-utils'
    ]
  },
  devtool: '#source-map',
  filename: __filename,
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/build`,
    pathinfo: true,
    publicPath: '/'
  },
  devServer: {
    contentBase: __dirname + '/build',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    port: '3000',
    host: 'localhost'
  },
  resolve: {
    root: [
      __dirname + '/src'
    ],
    modulesDirectories: [
      'node_modules'
    ],
    alias: {
      lib: __dirname + '/src/lib',
      schema: __dirname + '/src/schema'
    },
    extensions: ['', '.js', '.yaml', '.tag']
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        inject: false,
        template: __dirname + '/src/assets/index.ejs',
        mobile: true,
        baseHref: 'localhost',
        appMountId: 'app',
        devServer: 'http://localhost:3000',
        title: 'The JSON Architecture TodoMVC demo',
        hash: true
      })
  ],
  module: {
    noParse: [
      /^jquery$/,
      /^riot$/,
      /^kefir$/,
      /^baobab$/,
      /^ramda$/,
      /^json-patch-utils$/
    ],
    preLoaders: [
      { test: /\.yml|\.yaml$/, exclude: /node_modules/, loader: 'json-loader!yaml-loader' }
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' ,
        query: { presets: ['es2015'] }
      },
      { test: /\.js|\.tag$/, exclude: /node_modules/, loader: 'ramda-loader?debug=true' },
      { test: /\.tag$/, exclude: /node_modules/, loader: 'tag' }
    ]
  }
}
