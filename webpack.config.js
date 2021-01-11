const path = require('path');
module.exports={
    entry:'./index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'mian2.js'
    },
    externals: {
        jquery: 'jQuery'
    }
}