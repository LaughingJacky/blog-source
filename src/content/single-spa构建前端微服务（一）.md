---
slug: /
title: Single-SPA构建前端微服务（一）
date: 2020-03-28T09:16:08.915Z
description: >-
  Engineering is all about tradeoffs, and micro frameworks give you another
  dimension along which you can make tradeoffs.
tags:
  - single-spa
  - micro frontend
headerImage: >-
  https://2img.net/h/oi968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202020/single-spa-head-image_zpsk3dwt2o4.jpeg
templateKey: blog-post
---
## 前言
对于各大互联网公司中后台业务线的前端团队来说，多项目多技术栈之间业务依赖不可避免。

同学们最普遍的实现方案是采用新开页面实现系统关联的MPA模式。尽管部署简单、天然硬隔离，但域名变化与全页重刷又会带来用户体验上的痛点；使用iframe，也会暴露出UI不同步、内存无法共享、资源加载慢等操作上的不快。

随着团队发展与人员变迁，每个普通SPA中小型项目又会演变成一个Monolith。维护成本高、上线部署耗时长，都给团队开发效率制造了很大的瓶颈。

我们曾采用yog2做子项目拆分，一定程度上减小了巨石应用的体积，但其本质是路由分发思路。各project共享同一runtime，多框架场景支持不佳。

## 微前端架构

![portal](https://2img.net/h/oi968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202020/portal_zps9qpfup5g.png)
￼
微前端理念来源于后端微服务实践，其架构大致可分为：

* 单实例：同一时刻，只有一个子应用框架实例展示在页面上，具备完整生命周期
* 多实例：引申web components的方案封装组件，同一时刻展示多个子应用，[Micro Frontends](https://micro-frontends.org/)阐述的就是这套方案

下面就借助single-spa框架，展示一种单实例场景下的设计方案。对大部分中后台应用都有参考价值。

我们要实现的页面如图所示，要支持React、Vue、Svelte、Riot、Inferno五种子应用的挂载与切换：

![result](https://2img.net/h/oi968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202020/result_zpsa0xrqdml.png)
￼

### 子应用编写

我们知道，spa项目都需要一个dom挂载点，dom配置如下：
```js
    <div id="navbar"></div>
    <div style="margin-top: 100px;">
        <div id="react"></div>
        <div id="vue"></div>
        <div id="svelte"></div>
        <div id="inferno"></div>
        <div id="riot"></div>
    </div>
```

接下来用五种UI lib编写基本页面

![folder](https://2img.net/h/oi968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202020/folder_zpsdvxj4cvx.png)

其中, root文件是我们子应用的根入口。日后设计子应用路由也要由此而生;app.js就涉及到了我们的主题single-spa，该文件负责关联single-spa与子框架。

### single-spa
借助[single-spa-ecosystem](https://single-spa.js.org/docs/ecosystem)提供的框架生命周期适配，可以抹平各框架之间的差异，拿到归一化的生命周期。

```js
import {render} from 'inferno';
import singleSpaInferno from 'single-spa-inferno';
import {createElement} from 'inferno-create-element';

import rootComponent from './root.component.js';

const infernoLifecycles = singleSpaInferno({
    Inferno: {
        render
    },
    createElement,
    rootComponent,
    domElementGetter: () => document.getElementById('inferno')
});

export const bootstrap = infernoLifecycles.bootstrap;
export const mount = infernoLifecycles.mount;
export const unmount = infernoLifecycles.unmount;

```

接下来我们需要将子应用注册到portal，并做异步加载：

```js
import {registerApplication, start} from 'single-spa';

registerApplication(
    'navbar',
    () => import('./src/navbar/main.app.js'),
    () => true
);

registerApplication(
  'react',
  () => import('./src/react/main.app.js'),
  location => location.pathname.startsWith('/react')
);
...
start();
```

整体架构如下： 
￼![single-spa-arch](https://2img.net/h/oi968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202020/Single%20SPA%20arch_zpsfmpnj036.png)

最后，我们需要处理五种框架的的打包构建,加入特定loader及babel plugins：

```js
const getBabelConfig = () => ({
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['last 2 versions']
                }
            }
        ],
        ['@babel/preset-react']
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-class-properties',
        '@babel/plugin-syntax-function-bind'
    ]
});

const infernoBabelConfig = getBabelConfig();
infernoBabelConfig.plugins.push('inferno');


...
           {
                test: /\.js$/,
                exclude: /node_modules|inferno/,
                loader: 'babel-loader',
                query: getBabelConfig()
            },
            {
                test: /inferno.+\.js$/,
                loader: 'babel-loader',
                query: infernoBabelConfig
            },
            {
                test: /\.svelte$/,
                loader: 'svelte-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.riot$/,
                exclude: /node_modules/,
                loader: '@riotjs/webpack-loader'
            }
```

注意到，由于inferno属于react-like框架，为避免构建时解析组件受到影响，我们配置了两套babel；也可以使用inferno-compat和alias避免两种框架的冲突。但从这里可以看出，目前将五种框架合并打包的方式有改进空间，并不算best practice。

## 总结

以上便是基于single-spa设计前端微服务的大致轮廓与思路，支持独立开发、独立运行。它还有很大的优化空间，如应用间通信、独立打包、样式隔离等等。

附录资料里有篇文章，是社区对微前端利弊的一个激烈讨论。笔者认为，抛去portal的配置与维护上的复杂性，与web components一样，实践微前端的意义在于技术栈无关。

正如描述引言，工程化是一种权衡，技术实现代表可行性分析。只有idea逐步落地，才有对遍地开花的憧憬。

源码：[simple-micro-frontend](https://github.com/LaughingJacky/simple-micro-frontend)

## 参考资料
1. [用微前端的方式搭建类单页应用](https://tech.meituan.com/2018/09/06/fe-tiny-spa.html)
1. [Microfrontends: the good, the bad, and the ugly](https://zendev.com/2019/06/17/microfrontends-good-bad-ugly.html)
1. [Avoiding monolithic frontends](https://www.youtube.com/watch?v=pU1gXA0rfwc)
1. [Recommended Setup](https://single-spa.js.org/docs/recommended-setup/)
