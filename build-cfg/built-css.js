({
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
//    appDir: "../../../src/main/webapp/html/css",
    
    // 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
//    baseUrl: './',

    // 指定输出目录，若值未指定，则相对 build 文件所在目录
//    dir: "../html/css",

    // 在 RequireJS 2.0.2 中，输出目录的所有资源会在 build 前被删除
    // 值为 true 时 rebuild 更快，但某些特殊情景下可能会出现无法预料的异常
    //keepBuildDir: true,

    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    optimize: "uglify",

    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },

    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss: "standard",

    // 是否忽略 CSS 资源文件中的 @import 指令
//     cssImportIgnore: false,


    // 配置文件目录
    // mainConfigFile: 'js-build-config.js',

    // 一般用于命令行，可将多个 CSS 资源文件打包成单个 CSS 文件
     cssIn: "../html/css/built-css-cfg.css",
//     cssIn: "../html/css/builtcofig.css",
     out: "../html/css/index.css",

    // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求
    inlineText: true,

    // 是否开启严格模式
    // 由于很多浏览器不支持 ES5 的严格模式，故此配置默认值为 false
    useStrict: false,

    // 处理级联依赖，默认为 false，此时能够在运行时动态 require 级联的模块。为 true 时，级联模块会被一同打包
    findNestedDependencies: false,

    //If set to true, any files that were combined into a build layer will be
    //removed from the output folder.
    removeCombined: true,

   

    // 不优化某些文件
//     fileExclusionRegExp: /^\./,

   
})