---
slug: /
title: 【webpack配置】二、插件系统
date: 2019-12-17T08:46:53.247Z
description: >-
  Sean
  Larkin曾在演讲中表示，webpack中80%的部分都是由插件系统完成。随着我们对webpack研究的深入，会发现其内部的每样东西，都被模块化为单一职责的抽象类和工具。
tags:
  - webpack
  - tapable
headerImage: '  https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/webpacn-series-2-headimage_zps1wcoczne.png'
templateKey: blog-post
---
webpack本身可以定义为事件驱动的、基于插件的打包器。插件是webpack生态系统的关键拼图，使得社区开发者可以hook到关键事件中、可以侵入到webpack的编译过程的每一切面。

## AOP

[AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming)（Aspect-Oriented Programming）：面向切面编程，是对面向对象编程的扩充，在实现对关注点模块化扩展的同时，保证对原系统的低耦合性。即使你没了解过这个概念，在前端开发的工作中，或多或少也有用到这种思想。像表单验证、埋点日志收集、路由钩子、装饰器decorators等等场景。

webpack的tapable就是遵循AOP模式的一个实现。

## Tapable

Tapable作为webpack扩展功能的骨架与核心，与Nodejs的EventEmitter类似。扩展tapable的类和对象，我们称之为tapable实例。借助tapable提供的钩子，我们可以进入到编译阶段的每个过程中。
![Tapable skeleton](https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/tapable-skeleton_zpsbr3gitgy.png)

下面是一个简单的demo👇：

```js
// 为了测试拦截器的loop，我们选用loopHook
const {SyncLoopHook} = require('tapable');

const syncLoopHook = new SyncLoopHook(['name', 'age']);

// tap第一个插件，传入上下文
syncLoopHook.tap({
    name: 'firstPlugin',
    context: true
}, (context, name, age) => console.log({name, age, ...context}));

// tap第零个插件，放在第一个前面
syncLoopHook.tap({
    name: 'zeroPlugin',
    before: 'firstPlugin'
}, (name, age) => console.log({name, age}));

// 添加上下文，观察call、register、loop、tap四个阶段
syncLoopHook.intercept({
    context: true,
    call: (context, ...args) => console.log('arguments: ', ...args),
    register: tap => console.log('tap name: ', tap.name) || tap,
    loop: (context, ...args) => console.log('loop args: ', ...args),
    tap: (context, tap) => {
        console.log('tap event: ', tap);
        if (context) {
            context.name = 'John';
            context.age = 36;
        }
    }
});

// call the hook
syncLoopHook.call('David', 25);
```

通过控制台的输出，可以看到整个流程为register➡️call➡️loop➡️tap➡️tap callback。

在写这篇文章时，发现网上介绍其API的文章很多，这里就不赘述了。建议直接看github的[README](https://github.com/webpack/tapable/tree/tapable-1)。

## webpack工作流
要写好一个插件，必须了解webpack插件的这些切面是怎样工作的。模块打包器的大致流程是依赖解析➡️模块映射➡️打包，在webpack中，为了使用nodeJS的文件系统，第一个被这样处理的就是[NodeEnvironmentPlugin](https://webpack.js.org/plugins/internal-plugins/#nodeenvironmentplugin)。

下面是webpack的七大模块：
![webpack arch](https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/webpack-arch_zpsaossyeof.png)

### 开机键Compiler

Compiler的作用可以用两行伪代码来表示：
```js
const webpack = require('webpack');
const compiler = webpack(someConfig);
```
对于插件开发者的你来说，需要从webpack机制/流程/事件发生的时间点来切入，添加你想实现的功能及特性，compiler作为top-level实例，同时也是webpack runtime, 正担任这个角色。正因为它控制着webpack的启动与停止，你可以使用run、emit这些钩子。

### 藏宝图Compilation

compilation作为compiler的产物，描绘了你整个app依赖关系的深度遍历藏宝图，webpack通过compilation掌握你的代码依赖全貌。


## 相关资料
1. [webpack4核心模块tapable源码解析](https://www.cnblogs.com/tugenhua0707/p/11317557.html)
1. [everything-is-a-plugin](https://www.youtube.com/watch?v=H3g0BdyVVxA&list=PLw5h0DiJ-9PDZ0i7cZK7NqrsMRENAR48i&index=3)
1. [The Contributors Guide to webpack — Part 2
](https://medium.com/webpack/the-contributors-guide-to-webpack-part-2-9fd5e658e08c)
1. [Webpack - Behind the Scenes](https://medium.com/@imranhsayed/webpack-behind-the-scenes-85333a23c0f6)
1. [Creating a Custom webpack Plugin
](https://alligator.io/js/create-custom-webpack-plugin/)
1. 头图来自：[从Webpack源码探究打包流程，萌新也能看懂～](https://juejin.im/post/5c0206626fb9a049bc4c6540)
