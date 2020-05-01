const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
let {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = merge(baseConfig, {	
    mode: 'production',                                     // 设置为生产模式
    devtool: 'cheap-module-source-map',              // 增加 devtool调试工具，源码映射 可以很方便的调试源代码  
    plugins: [                                             
        new CleanWebpackPlugin(),                           // 打包前先清空输出目录       
    ],
    // //监控，实时打包，当代码更改后改动build文件，一般开发时不要用
    // watch: true,
    // //监控的选项
    // watchOptions: {
    //     poll: 1000, //  每秒问1000次
    //     aggregateTimeout: 500 ,//   防抖 （类似于函数防抖，代码改变0.5秒后开始更改）
    //     ignored: /node_modules/ //忽略哪个文件
    // }
});