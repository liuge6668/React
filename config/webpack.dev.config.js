const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
let path = require('path');

module.exports = merge(baseConfig, {
    // 设置为开发模式
    mode: 'development',
    //  'source-map'源码映射 单独生成一个 source-map文件 出错会标识出错的列和行 大和全
    //  'eval-source-map' 不会单独生成一个文件 但会显示行和列
    //  'cheap-module-source-map' 不会产生单独列 但会生成一个映射文件
    //  'cheap-module-eval-source-map'不会单独生成文件 集成在打包文件中 也不产生列
    devtool: 'inline-source-map',              // 增加 devtool调试工具，源码映射 可以很方便的调试源代码  
    // 配置服务端目录和端口
    devServer: {                               //开发服务器的配置
        port: 3000,                            //端口配置
        contentBase: './dist',                // 以 build 目录作为我们的静态服务(直接访问我们的 build 目录，优先本地载从内存找)
        // open:true,                             //启动服务后打开浏览器
        progress: true,                         //进度条
        compress: true,                        //是否启用gzip压缩
        hot: true,                                //热更新           
        // /user的用法   2解决方法
        proxy: {        //代理解决跨域 
            "/api": {   //将请求路径中有api的请求转发到target
                target: "http://localhost:3500",          //这个ip
                changeOrigin: true,                       // target是域名的话，需要这个参数，
                pathRewrite: {"^/api": ""},               // 将路径中/api重写为空
                secure: false,                            // 设置支持https协议的代理
            }         
        },      
       
        before(app) { // 前端只想单纯模拟方法提供的方法 相当于钩子，但是一般不这么mock 
            //写这些代码就不存在跨域问题 
            app.get('/user', (req, res) => {
                res.json({
                    name: 'myname-before'
                })
            })
        }
        },
        resolve: {	//解析     
            modules: [                       // 优化模块查找路径, 指定解析的模块，只在当前目录下查找    
                path.resolve('src'),
                path.resolve('node_modules') // 指定node_modules所在位置 当你import 第三方模块时 直接从这个路径下搜索寻找
            ],            
            extensions: ['.js','.jsx','.css'],			// 扩展名,依次尝试查找数组中拓展名结尾的文件，    
            alias: {																//别名
                bootstrap: 'bootstrap/dist/css/bootstrap.css',	//	可以是一个文件
                utils: './src/utils'					//	可以是一个路径
            }
      }
    })