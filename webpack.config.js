const path = require('path');

module.exports = {
    entry: './src/tfrp.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'tfrp',
        libraryTarget: 'umd',
    },
    mode: 'production'
}