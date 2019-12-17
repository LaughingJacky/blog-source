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
作为插件开发者的你，需要从webpack机制/流程/事件发生的时间点来切入，添加你想实现的功能及特性，compiler作为top-level实例，同时也是webpack runtime, 正担任这个角色。正因为它控制着webpack的启动与停止，你才能使用run、emit这些钩子。

### 藏宝图Compilation

compilation作为compiler的产物，描绘了你整个app依赖关系的深度遍历藏宝图，webpack通过compilation掌握你的代码依赖全貌。webpack的load, seal, optimize, chunk, hash都在这一阶段完成，具有optimize-modules、seal及optimize-chunk-assets等hook。

### 寻路resolver

类似于nodejs的resolver处理文件路径，webpack的resolver由(enhanced-resolver)[https://github.com/webpack/enhanced-resolve]创建。我们也可以通过resolveLoader或者自己写的(插件)[https://github.com/shaketbaby/directory-named-webpack-plugin]自定义模块解析策略。

### 同声传译loaders
在resolve文件依赖进行build过程中，肯定会查询到非JS的文件。这时就需要loader根据ruleSet将!@#$%$^&变成标准模块，加到chunk中。

### 模块工厂Module Factory
ModuleFactory将resolver、loaders和源模块实例零件进行黏合加工，产出模块对象到内存中。
除了Normal类型之外，Context工厂用于处理上下文的动态依赖。

### 寻宝科学家Parser
AST是计算机与人类的桥梁，Parser是Module与bundle template的桥梁。webpack parser使用acorn实现AST。

### 圣诞树的外衣Template

template顾名思义作为文件输出的数据模版，将template subclass组合到一起，生成最后打包文件的框架结构。当然，由于模块类型的不同，template有多种类型，包括:
- MainTemplate: 运行时bundle的wrapper
- ChunkTemplate: 控制chunk wrapper的形式和格式
- ModuleTemplate: 模块模版
- DependencyTemplate: 依赖模版
- RuntimeTemplate: 运行时模版

## 总结
当我们开启热更新的时候，webpack会按照这种运作机制不断地解析文件、生成依赖图、输出bundle文件。正是因为有基于切面设计的插件系统和基于插件的运作体系，我们才能够持续的添加特性，提升打包效率、增量更新，从而实现科学快速的工程化解决方案。

## 相关资料
1. [webpack4核心模块tapable源码解析](https://www.cnblogs.com/tugenhua0707/p/11317557.html)
1. [everything-is-a-plugin](https://www.youtube.com/watch?v=H3g0BdyVVxA&list=PLw5h0DiJ-9PDZ0i7cZK7NqrsMRENAR48i&index=3)
1. [The Contributors Guide to webpack — Part 2
](https://medium.com/webpack/the-contributors-guide-to-webpack-part-2-9fd5e658e08c)
1. [Webpack - Behind the Scenes](https://medium.com/@imranhsayed/webpack-behind-the-scenes-85333a23c0f6)
1. [Creating a Custom webpack Plugin
](https://alligator.io/js/create-custom-webpack-plugin/)
1. 头图来自：[从Webpack源码探究打包流程，萌新也能看懂～](https://juejin.im/post/5c0206626fb9a049bc4c6540)
