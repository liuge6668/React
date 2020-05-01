# 安装 webpack

## 初始化 项目

- `yarn init -y`
- 输入命令并执行，会生成 package.json 文件（package.json 是记录安装模块的数量）
  
## 安装本地的 webpack
- `yarn add webpack webpack-cli -D`
- 现在webpack的版本是 4.x 的，webpack 和 webpack-cli 分开管理了，需要两个都安装。在终端中进入你的项目中输入命令,这里的 -D：表示 上线的时候不需要这两个包（这两个包都是开发依赖,-S是生产依赖）

## vscode快捷键
- ctrl + ` 打开终端
## 在根目录下创建src文件夹并创建index.js文件  
## 如何手动配置 webpack
- 默认配置文件的名字： webpack.config.js or webpackfile.js 有两种，一般我们用第一种 。在我们项目的根目录下建立配置文件。
- 简单配置文件：
 ```javascript
 let path = require('path') //引入内置的 path 模块  
module.exports = {
    mode: 'production', //模式：这里有两种模式  production(生产模式)(打包后压缩的代码) 	
                        // development(开发模式)
    entry: './src/index.js', // 入口（从哪个地方开始打包）
    output: { //出口
        filename: 'bundle.js', //打包后的的文件名
        path: path.resolve(__dirname, 'build') //路径，打包后的文件存放的地方 。 要求：路径必须是一个绝对路径，resolve() 解析：可以把相对路径解析成绝对路径。join() 拼接路径                 
    }
}
 ```
- 配置package.json文件，添加的scripts对象是yarn run XXX的执行文件，"build": "webpack --config webpack.config.js"是执行的node-modules 里面的 webpack。配置完脚本之后 ，启动 webpack 的命令 为： npm run build . 我们在终端输入这条命令，同样可以启动 webpack。
 ```json
  {
  "name": "demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {     
    "build": "webpack --config webpack.config.js"
  },
  "devDependencies": {
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  }
}
 ```
# webpack 开发服务的配置
- webpack 内置开发服务：yarn add webpack-dev-server -D  (安装开发服务，它也是开发依赖)
- 运行开发服务的命令： npx webpack-dev-server
- 好处：它并不会去真实的打包文件，它只是生成了一个内存中的打包。

- 安装好之后，我们来运行一下看一看：输入命令  npx webpack-dev-server,在浏览器打开http://localhost:8080/能看到文件夹结构
## 配置服务 添加以下代码到 webpack.config.js
- contentBase在没有配置html模板的情况下会直接到dist文件内找index.html
- 在dist文件夹内添加index.html并引入bundle.js
  
```javascript
    devServer: { //开发服务器的配置
        port: 3000, //端口配置
        contentBase: './dist', // 以 build 目录作为我们的静态服务(直接访问我们的 build 目录)
        open:true,  //启动服务后打开浏览器
        progress:true,  //进度条
        compress: true,     //是否启用gzip压缩
    },
```

## 热更新   添加以下代码到 webpack.config.js
```javascript
+   const webpack = require('webpack');
+   devServer: { //开发服务器的配置
            hot:true
    },
+ plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]    
```
## 添加开发环境启动   添加以下代码到package.json
```json
"dev": "webpack-dev-server"  //开发服务器配置  
```
- 运行yarn run dev启动开发环境
  
## 安装html模板插件
- 文件夹里面只有 js 文件，当我们启动开发服务访问服务地址的时候只会进入到 build 目录下面，这个时候我们还得在打包文件中新建一个 index.html 文件，这样太麻烦了，我们的 src 目录下面建立一个 html 模板文件，打包的时候直接将 html 文件也打包到 build 目录下面。
- 安装 html 插件 （html-webpack-plugin）
`yarn add html-webpack-plugin -D` 执行这条命令来安装 html 插件。
  ```javascript
  let HtmlWebpackPlugin = require("html-webpack-plugin") //引入 htmlwebpack 插件    

  plugins: [ //数组， 放着所有的 webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',  //模板文件（html文件）的位置
            filename: 'index.html',  //打包后的文件名字
            minify: {  //压缩 html 文件
                removeAttributeQuotes:true,  //删除属性的双引号
                collapseWhitespace:true //折叠空行，变成一行
            },
            hash: true,
        })
    ],
  ```
  ## 处理样式文件
  `yarn add css-loader style-loader  less less-loader sass-loader node-sass -D`
- 安装好之后，到配置文件中配置我们的样式规则
  ```javascript
    module: { //模块
        rules: [ //规则
            // css-loader(处理我们的css，主要负责解析 @import这种语法的)
            // style-loader 它是把 css 插入到 head 的标签中
            // loader的特点： 希望单一性（一个loader处理一件事情）
            // loader 的用法 ：一个 loader 用字符串表示，多个loader 需要用 []表示
            // loader 的顺序，默认是从右向左执行 从下到上执行
            // loader 还可以写成对象的方式，可以传参数
            {
                test: /\.css$/, //用正则来匹配以 css 结尾的文件
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader' //把 less --->转换为 css
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader' //把 sass/sacss --->转换为 css, loader顺序自下而上执行
                ]
            }
        ]
    }
  ```


