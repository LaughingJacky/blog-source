---
id: d4b8d9c3ddc0e95c88f753df86ba56c7
slug: /
title: "【webpack配置】一、常用基础插件\U0001F389"
date: 2019-08-08T08:32:38.416Z
description: |-
  随着业务代码规模化，开发者对工程化也该引起足够重视。
  业务不断，优化不止。本着对最佳实践的持续探索，让我们从头开始，打怪升级成一名webpack配置攻城狮✌️
tags:
  - webpack
  - 工程化
headerImage: >-
  https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/webpack-how-it-works_zpsu9wcudnq.png
templateKey: blog-post
---
## 初始化目录
1. yarn init -y
2. yarn add webpack webpack-cli webpack-dev-server --dev
3. 根目录初始化一个html, 加入一个id为app的div节点（为了之后react挂载）
4. 创建src/index.js.

```js
import _ from 'lodash';
export default _.join;
```

5. package.json中加入脚本配置。笔者机器上目前的npm版本为3.x.x，5.2以上的npm版本也可以使用npx命令。

```js
"build:dev": "rm -rf dist && ./node_modules/.bin/webpack --mode development",
"build": "rm -rf dist && ./node_modules/.bin/webpack --mode production"
```

6. 分别执行两个脚本，发现dev模式产出size为552kb,prod模式为70.6kb，生产环境进行了代码压缩混淆。我们在index.js里加一行console.log(process.env.NODE_ENV)，打包后执行node dist/main.js，可以发现process.env.NODE_ENV变量已被注入到脚本执行环境的全局变量中。

## webpack配置文件
为了更细粒化定制打包工具，我们需要手写webpack配置以支持生产环境。先定一个小目标，让我们输出一个支持react组件的html页面。
1. yarn add @babel/core @babel/polyfill @babel/preset-env @babel/preset-react babel-loader --dev
2. 写一个简单的组件

```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import {join} from 'lodash';

    const Comp = () => <div>
        {join(['Hello', 'webpack'], ' ')}
        <br />
    </div>;
    
    ReactDOM.render(
        <Comp />,
        document.getElementById('app')
    );
```

3. webpack配置如下，其中entry和path注释的为webpack默认值。我们基于contenthash输出output，引入了preset-env插件兼容new ES syntax，使用preset-react兼容JSX。

```js
module.exports = {
    // entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        // path: path.resolve(__dirname, 'dist')
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }) // 将模版写入output path
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
```

执行webpack-dev-server，我们将在9000端口看到输出。
### split Chunks
我们利用optimization对打包出的main.js进行拆分。
1. 首先加入runtimeChunk，可以看到有6.12Kb的webpack runtime被提取了出来，这部分代码是webpack用来进行模块解析时所需要的。这样，当我们hash模块变更时，runtime所包含的模块信息清单就会单独更新。
2. 效果依然不明显，我们接下来配置splitChunks。

```js
splitChunks: {
    chunks: 'all', // async只作用于异步模块，all针对所有模块，initial对同步模块生效
    minSize: 0, // 合并前模块文件大小
    minChunks: 1, // 最小被引用次数
    automaticNameDelimiter: '-', // 命名链接符
    cacheGroups: {  // 设置缓存chunk
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            minChunks: 1,
            priority: -10 // 优先级更高
        },
        default: {
            test: /[\\/]src[\\/]js[\\/]/,
            minChunks: 2, // 非第三方，被引用两次以上
            priority: -20,
            reuseExistingChunk: true // 复用已有模块
        }
    }
},
```

修改后的开发环境打包结果如下：

|Asset|Size|Chunks| 
|---|---|---|
|index.html|450 bytes|| 
|main.d4c9204ebd45eed48786.js|3.39 KiB|main| 
|runtime.acfdeda3904d25c72cbb.js|6.12 KiB|runtime| 
|vendors-main.804e8227ca2da7b727a5.js|1.91 MiB|vendors-main|

可以看到，vendors即node_modules按我们的命名规则被提出来了。并且业务代码只有3.39Kb，这样我们每次修改代码时只会更新这3.39Kb的文件，大大提高了打包速度。
3. 在production模式，minimize默认为true会进行压缩混淆代码，我们也可以用uglifyJS实现定制。

```js
new UglifyJsPlugin({
    exclude: /\.min\.js$/, // 已压缩文件不再处理
    cache: '.cache', // 缓存文件夹
    parallel: true, // 多进程
    sourceMap: false,
    extractComments: false,
    uglifyOptions: {
        compress: {
            unused: true,
            drop_debugger: true,
            collapse_vars: true,
            reduce_vars: true
        },
        output: {
            comments: false // 不输出注释
        }
    }
})
```
### dynamic import
让我们添加一个promisePolyfill，并通过一个btn click动态引入它。

```js
import '@babel/polyfill';

const Comp = () => {
    const onClick = e => {
        const asyncModule = async () =>
            await import(/* webpackChunkName: "promise" */ './promisePolyfill');
        asyncModule().then(res => console.log(res.PromisePolyfill));
    }
    return (<div>
        {join(['Hello', 'webpack'], ' ')}
        <br />
        <button onClick={onClick}>Click me and look at your console!</button>
        <br />
    </div>);
}
```

其中babel-polyfill的引入是为了支持async/await需要的regeneratorRuntime。webpack使用require.ensure标记异步模块，并通过window.webpackJsonp连接chunk文件。所以当我们调用import函数时，webpack使用一种类似jsonp的方式在文档头部动态添加script标签，再通过webpackJsonpCallback把异步函数加载到主文件供之后调用。
打开DevTools Network我们可以看到，当我们点击按钮之后，promise脚本才开始下载，并且不会多次重复下载。

### dll config

dll plugin用于将第三方模块打包到动态链接库中，二次加载时参考dll从打包好的一个js中获得模块。
1. 我们再写一个webpack配置输出dll缓存文件。
```js
const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const dllPath = path.resolve(__dirname, './dll'); // dll文件存放的目录

module.exports = {
    entry: {
        // 把react, lodash放到一个单独的动态链接库
        react: ['react', 'react-dom', 'lodash']
    },
    output: {
        filename: '[name]-[hash].dll.js',
        path: dllPath,
        library: '_dll_[name]'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.join(__dirname, './', '[name].dll.manifest.json')
        })
    ]
};
```
2. 添加并执行dll命令"./node_modules/.bin/webpack --mode production --config webpack.dll.config.js"
3. yarn run dll生成react.dll.manifest.json及打包react、lodash之后的模块js
4. 此时dll文件是带有hash的，为了将js注入到页面上,这里我们借助add-asset-html-webpack-plugin。

```js
const autoAddDllRes = () => {
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
  return new AddAssetHtmlPlugin([{   // 往html中注入dll js
    publicPath: './dll/', // 注入到html中的路径
    outputPath: 'dll', // 最终输出的目录
    filepath: path.resolve('./dll/*.js'),
    includeSourcemap: false,
    typeOfAsset: 'js' // options js、css; default js
  }]);
};
```

5. webpack.config.js中添加plugin

```js
new webpack.DllReferencePlugin({
    manifest: require('./react.dll.manifest.json')
}),
autoAddDllRes(),
```

当不使用.cache及dll缓存时，build一次的时间为6000ms左右;使用dll时，二次构建的时间可以提升到3000ms。当然这里我们用到uglifyjs的cache文件夹时，打包速度会达到1000ms的量级，使得dll的配置效果不是那么明显。

### Tree Shaking
Tree Shaking是指webpack利用ES6 import静态编译的特点, 打包时去除无用代码的一种方法。
1. @babel/preset-env的默认modules为auto，此时若在package.json指定没有sideEffects的话，webpack在production模式自动开启tree-shaking；
2. 我们这里手动试验一下这个特性，写一个sideCode文件用ES6语法导出一个函数一个无用变量。

```js
  // sideCode.js
  export const a = () => {};
  export const unused = 'unused';
```

3. 避免杂项干扰，我们设置webpack mode为'none', optimization作如下配置：

```js
// providedExports: true,
usedExports: true,
minimize: true,
minimizer: [
    new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 已压缩文件不再处理
        cache: '.cache', // 缓存文件夹
        parallel: true, // 多进程
        sourceMap: false,
        extractComments: false,
        uglifyOptions: {
            compress: {
                unused: true
            },
            output: {
                beautify: true,
                comments: false // 不输出注释
            }
        }
    })
]
```

  其中usedExports依赖默认为true的providedExports, 我们开启usedExports后，会发现导出的文件中包含 _/* unused harmony export unused */_的标示，此时我们开启minimize为true，由于compress中设置了unused为true，便发现再次打包时 我们的unused变量已经被去除了。

4. 需要注意一点的是，因为这个功能依赖ES6 import优先执行的特性，所以当我们显式设置 `presets: [['@babel/preset-env', {modules: 'cjs'}]`时，会发现我们的未使用变量又被打包进来了。所以必须告诉webpack不要转换模块。

## 总结

这篇主要介绍了配置webpack时经常涉及到的**Code Split**、**Dynamic Import**、**Tree Shaking**及**DLL**常用技巧，希望能够在日常工作中得以运用。
