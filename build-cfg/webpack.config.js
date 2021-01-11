const  path=require('path');
module.exports = {
    entry: './index',
    output: {
        path: path.resolve(__dirname, '../html'),
        filename: 'main.js'
    },
};