const resolve = require('path').resolve


module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: [ './server.js' ],
  output: {
    filename: "server.js",
    path: resolve(__dirname, './../dist')
  }
}
