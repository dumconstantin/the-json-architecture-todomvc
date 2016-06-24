var webpack = require('webpack')

module.exports = {
  entry: __dirname + '/src/bundle.js',
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'jsontodomvc'
  },
  resolveLoader: {
    modulesDirectories: [__dirname + '/../../', 'node_modules']
  },
  module: {
    noParse: [
      'ramda'
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' ,
        query: { presets: ['es2015'] }
      },
      { test: /\.js|\.tag$/, exclude: /node_modules/, loader: 'ramda-loader' }
    ]
  }
}
