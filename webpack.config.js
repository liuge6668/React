let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let TerserPlugin = require('terser-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool:'eval-source-map',
    mode:'production',
    performance: {        
        hints: "warning",            // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        maxEntrypointSize: 5000000,  // 开发环境设置较大防止警告，根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位        
        maxAssetSize: 3000000        // 最大单个资源体积，默认250000 (bytes)
    },
    entry:'./src/index.js',
    output:{
        filename:'bundle_[hash:8].js',
        path:path.resolve(__dirname, './dist')
    },
    optimization: { 														//优化项
        minimizer: [														//压缩体积
            new TerserPlugin({											//压缩js
                cache: true, 												//是否用缓存
                parallel: true, 											//是否是并发打包（一起压缩多个）
                sourceMap: true,                                            //源码映射模式
            }),
            new OptimizeCssAssetsWebpackPlugin()            				//压缩css
        ]
},
    module: { //模块
        rules: [ //规则
            {
                test: /\.css$/, //用正则来匹配以 css 结尾的文件
                use: [
                    MiniCssExtractPlugin.loader,//这个loader的作用是：抽离出来 css然后用 link 标签引入到 模板文件中
                    {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 1, // 用于配置 css-loader 作用于 @import 的资源之前」有多少个 loader，当前只有 postcss-loader 1个
                        },
                      },
                    'postcss-loader'             // 转化成postcss 借助此来方便自动补全 注：需要在 css-loader之前处理
                ]
						},
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 2, 
                        },
                      },                   
                    'less-loader', //把 less --->转换为 css
                    'postcss-loader',
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',							//这个是直接放到head标签中，用上边的替换掉
                    {
                        loader: 'css-loader',
                        options: {
                          importLoaders: 2, 
                        },
                      },                    
                    'sass-loader' ,//把 sass --->转换为 css
                    'postcss-loader',
                ]
            },
            {
                test: /\.(jsx|js)$/,
                  exclude: /node_modules/,          //排除文件夹
                    use: [
                      {
                        loader: "babel-loader"
                      }
                    ]
            }, 
            {
                test: /\.(png|jpg|svg|gif|ico)?$/,
                use: [{
                    loader: 'url-loader',
                    options: { // 这里的options选项参数可以定义多大的图片转换为base64
                        fallback: "file-loader",
                        limit: 10, // 表示小于10kb的图片转为base64,大于10kb的是路径
                        outputPath: 'images', //定义输出的图片文件夹
                        name: '[name]_[hash:8].[ext]'
                    }
                }]
            },    

        ]
    },
    devServer: {                               //开发服务器的配置
        port: 3000,                            //端口配置
        contentBase: './dist',                // 以 build 目录作为我们的静态服务(直接访问我们的 build 目录，优先本地载从内存找)
        // open:true,                             //启动服务后打开浏览器
        progress:true,                         //进度条
        compress: true,                        //是否启用gzip压缩
        hot:true                                //热更新
    },    
    //插件的配置
    plugins: [                                              //数组， 放着所有的 webpack插件
        new webpack.HotModuleReplacementPlugin(),           //自带热更新插件
        new HtmlWebpackPlugin({
            template: './src/index.html',                   //模板文件（html文件）的位置
            filename: 'index.html',                         //打包后的文件名字
            minify: {                                       //压缩 html 文件
                removeAttributeQuotes:true,                 //删除属性的双引号
                collapseWhitespace:true                     //折叠空行，变成一行
            },
            // hash: true,                                  //模板中自动引入的文件添加hash值（建议自己配，不自动加）
        }),
        new MiniCssExtractPlugin({
            filename:'main_[hash:8].css', 							//抽离出来的css的文件的名字
        }),
        new CleanWebpackPlugin(),                           // 打包前先清空输出目录
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname,'src/public'),//静态资源目录源地址
                to:'./public' //目标地址，相对于output的path目录
            },
            {
                from:'./src/jtopo', to:'jtopo'
            }
        ])
    ],

}