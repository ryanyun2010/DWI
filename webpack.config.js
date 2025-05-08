const path = require('path');
    module.exports = {
      entry: './js/main.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack.bundle.js'
      },
      resolve: {
        alias: {
          'node_modules': path.join(__dirname, 'node_modules'),
        }
      },
    };

