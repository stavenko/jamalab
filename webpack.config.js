var path = require('path');

module.exports = {
  cache: true,
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'client', 'js'),
    publicPath: 'js/app.js',
    filename: 'app.js'
  },

  module:{
    loaders:[
      {test: /\.jsx?/, loader: 'jsx'}
]
}
}
