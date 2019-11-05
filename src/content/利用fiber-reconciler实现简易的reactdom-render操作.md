---
id: 74bbb2a4a5074a0aa182511e12c2d7ef
slug: /
title: 利用fiber-reconciler实现简易的ReactDOM render操作
date: 2019-10-31T08:49:34.718Z
description: |-
  Fiber Reconciler是React 16默认的协调器，它抽象了宿主平台的特征，以实现不同的渲染需求。
  笔者最近在看React Conf，发现一个很有意思的demo，跟大家一起分享一下。
tags:
  - React Conf
  - React Fiber
headerImage: >-
  https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/react-fiber_zpstvbw5mlw.jpg
templateKey: blog-post
---
## Reconciler作用
目前React的应用场景不仅限于Web App，也有很多人用来完成2D画图库、3D图形库、命令行库等工具。无论处于哪种宿主环境中，React生态大致包括如下基本概念/功能：
- host内置组件（div, span, img等）
- 函数式组件
- 类组件
- props, state
- effects, lifecycle
- key, ref, context
- React.lazy, error boundaries
- concurrent mode, Suspense

除内置组件与宿主相关(如React Native中包括View, Text等特定组件）以外，上述逻辑功能在跨平台的环境中是通用的。

这些通用的部分就交给reconciler来实现，当有更新出现时，reconciler就会调用render。这篇文章不会介绍调度算法的内容，可以阅读[理解React Fiber架构](https://libin1991.github.io/2019/07/01/%E7%90%86%E8%A7%A3-React-Fiber-%E6%9E%B6%E6%9E%84/)了解更多。

Sophie Alpert在会上还提到了react-reconciler使用时的两个模式：Mutation模式和Persistent模式。
1. Mutation模式

我们对DOM的修改，即ReactDOM就遵循该模式。我们通过改变已有的BOM/DOM的属性来render，这也是DOM自身的工作原理。伪代码如下：

```js
view = createView()
updateView(view, {color: 'red'}) // 更新已有视图

div = document.createElement('div');
div.style.color = 'red';
```

2. Persistent模式

当API将系统当成Immutable Object时，我们会将整个视图替换成另一版本。因为React Native拥有对host的绝对控制，所以下一版本的RN采用此模式实现Concurrency。

```js
view = createView();
cloneView(view, {color: 'red'}); // 克隆新视图
```

现在我们要用react-reconciler来替代ReactDOM，做一个简版的渲染器，以便更好的了解React的工作原理。实现诸如以下指令：
- 渲染一个新视图
- 动态显示dom
- 利用自定义props更新背景色

## 实现ReactDOMMini
首先，我们用create-react-app创建一个项目，安装react-reconciler依赖。然后，用我们要实现的ReactDOMMini替代ReactDOM。

```js
// import ReactDOM from 'react-dom';
import ReactDOMMini from './ReactDOMMini';
...
ReactDOMMini.render(<App />, document.getElementById('root'));
```  

### 渲染基础视图
在ReactDOMMini中，我们需要对宿主环境进行配置，然后更新视图。react-reconciler的API如下：
```js
const Reconciler = require('react-reconciler');

const HostConfig = {
  // You'll need to implement some methods here.
  // See below for more information and examples.
};
const MyRenderer = Reconciler(HostConfig);
const RendererPublicAPI = {
  render(element, container, callback) {
    // Call MyRenderer.updateContainer() to schedule changes on the roots.
    // See ReactDOM, React Native, or React ART for practical examples.
  }
};

module.exports = RendererPublicAPI;
```

我们需要在hostConfig里对宿主环境进行配置，描述协调器工作时需要宿主环境发生怎样的变化。HostConfig相当于一个桥梁，用户通过参数声明的方式传给[配置项](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js)，reconciler将其作为module引入。

在这里也可以看到DOM的[HostConfig的实现](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js)。

我们先写一些基本的配置项：

```js
const hostConfig = {
    supportsMutation: true, // 开启mutating模式
    createInstance: (
        type,
        props,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle
    ) => {},
    createTextInstance: (
        text,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle
    ) => {},
    appendInitialChild: (parent, child) => {},
    appendChildToContainer: (container, child) => {},
    removeChildFromContainer: (container, child) => {},
    getRootHostContext: () => {},
    prepareForCommit: () => {},
    resetAfterCommit: () => {},
    getChildHostContext: () => {},
    shouldSetTextContent: () => {},
    finalizeInitialChildren: () => {}
}
const reconciler = reactReconciler(hostConfig);
export default {
    render(reactElement, domEle, callback) {
        if (!domEle._rootContainer) {
            domEle._rootContainer = reconciler.createContainer(domEle, false, false);
        }
        reconciler.updateContainer(reactElement, domEle._rootContainer, null, callback);
    }
};
```

render方法就做了两件事，创建rootContainer和根据reconciler更新container。它接收的第三个参数是可选回调，这里不需要。

我们写的这些配置项防止页面报错，也是告诉reconciler引入这些函数。我们使用mutation模式，以便目标（例如DOM）UI API支持UI树的更新（像appendChild, removeChild的操作等）。

目前页面上还是空白的，下面是见证奇迹的时刻。为createInstance、createTextInstance、appendInitialChild、appendChildToContainer增加渲染逻辑:
```js
createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
) => document.createElement(type),
createTextInstance: (
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
) => document.createTextNode(text),
appendInitialChild: (parent, child) => {
    parent.appendChild(child);
},
appendChildToContainer: (container, child) => {
    container.appendChild(child);
},
```  

- createInstance用于根据目标创建UI元素实例
- createTextInstance用于创建文本节点，因为DOM Target是使用独立的文本节点创建文本的，所以我们需要它
- appendInitialChild用于初始化UI树的创建
- appendChildToContainer在React-Reconciler的Commit阶段被调用（这里可想象成git的分支commit操作）

可以看到页面上，文本节点已经被渲染出来了。但是我们的图片元素没有展示，a标签链接功能失效。基于上述描述，修改createInstance：
```js
createInstance: (
    type,
    props,
    rootContainer,
    hostContext,
    internalInstanceHandle
) => {
    const el = document.createElement(type);
    Object.keys(props).forEach(propName => {
        if (propName !== 'children') {
            el[propName] = props[propName];
        }
        else {
          // 打印一下children是什么
          console.log(propName, props[propName]);
        }
    });
    return el;
}
```

- 当props不是children时，我们把props映射到元素上。包括alt、className、href、rel、src、target等，其中className会被react处理成class
- props是children时，我们打印出子树可以看到有host组件、文本等类型，由于文本已经被createTextInstance创建了节点，这里不用额外处理。

为实例元素增加attribute之后，可以看到背景及图片都显示正常，我们的小目标也实现了。

### 动态显示Logo
接下来的工作是，通过点击class为App的DOM，使react logo动态显示。首先写我们的业务：
```js
// App.js
    ...
    const [showLogo, setShowLogo] = useState(true);
    return (
        <div className="App" onClick={() => {
            setShowLogo(show => !show);
        }}>
            <header className="App-header">
                {showLogo && <img src={logo} className="App-logo" alt="logo" />}
    ...
```

点击却发现onClick没有反应，说明我们刚才只赋值了静态属性，没有添加事件监听。在createInstance添加以下逻辑:

```js
if (propName === 'onClick') {
    el.addEventListener('click', props[propName]);
}
else {
    el[propName] = props[propName];
}
```

满心欢喜的点了一下页面以为everything under control了，结果。。。
![size200](//images.ctfassets.net/49fdbwmpdowy/2FvoJn52wrvyFknULPEirW/f367201b0d80abf697121d181c9e5f98/5628dd6ecd9fa100f371_size30_w521_h534.jpg)

！！！控制台报错了，查看以下API我们发现，需要配置dom remove及insert的module。

```js
removeChildFromContainer: (container, child) => {
    container.removeChild(child);
},
removeChild: (parent, child) => {
    parent.removeChild(child);
},
insertInContainerBefore: (container, child, before) => {
    container.insertBefore(child, before);
},
insertBefore: (parent, child, before) => {
    parent.insertBefore(child, before);
},
```

四个模块都比较好理解，包含container的是commit阶段触发的行为。又实现了一个小目标。

### 使自定义props工作
最后一个任务是，用一个自定义属性控制p标签的背景色定时切换，我们还是先写简单的业务逻辑：

```js
// App.js
...
const [color, setColor] = useState('red');
useEffect(() => {
    const colors = ['red', 'green', 'blue'];
    let i = 0;
    const interval = setInterval(() => {
        i++;
        setColor(colors[i % 3]);
    }, 1000);
    return () => clearInterval(interval);
}, []);
...
<p bgColor={color}>
    Edit <code>src/App.js</code> and save to reload.
</p>
...
```

要完成这个任务，我们需要两个新的module，prepareUpdate和commitUpdate：

```js
prepareUpdate: (
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
) => {
    let payload;
    if (oldProps.bgColor !== newProps.bgColor) {
        payload = {newBgColor: newProps.bgColor};
    }
    return payload;
},
commitUpdate: (
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
) => {
    if (updatePayload.newBgColor) {
        instance.style.backgroundColor = updatePayload.newBgColor;
    }
}
```

- prepareUpdate用于diff元素的oldProps和newProps。在这里，当bgColor的props变化时，我们硬编码了一个新的props叫newBgColor
- commitUpdate用于随后更新实例props，这里当有newBgColor时，就将它赋予backgroundColor。

## 总结

到这里我们就依赖fiber-reconciler完成了一个mini版本的ReactDOM的render操作，仔细想想我们还是有很多功能没有实现，例如form controls、refs、svg、portals、事件冒泡等。要想用好fiber-reconciler的module，需要理解currentTree和workInProgressTree，render阶段和commit阶段，感兴趣的同学可以接下来自己深入研究。

附上ReactDOMMini不到100行的全部代码，去掉了没用到的参数：

```js
/**
 * @file ReactDOMMini.js
 * @create date 2019-10-30 15:53:15
 * @modify date 2019-10-31 15:15:29
 */
import reactReconciler from 'react-reconciler';

const hostConfig = {
    /* 宿主环境配置 */
    supportsMutation: true,
    getRootHostContext: () => { },
    prepareForCommit: () => { },
    resetAfterCommit: () => { },
    getChildHostContext: () => { },
    shouldSetTextContent: () => { },
    finalizeInitialChildren: () => { },
    createInstance: (
        type,
        props
    ) => {
        const el = document.createElement(type);
        Object.keys(props).forEach(propName => {
            if (propName !== 'children') {
                if (propName === 'onClick') {
                    el.addEventListener('click', props[propName]);
                }
                else {
                    el[propName] = props[propName];
                }
            }
        });
        return el;
    },
    createTextInstance: text => document.createTextNode(text),
    appendInitialChild: (parent, child) => {
        parent.appendChild(child);
    },
    appendChildToContainer: (container, child) => {
        container.appendChild(child);
    },
    removeChildFromContainer: (container, child) => {
        container.removeChild(child);
    },
    removeChild: (parent, child) => {
        parent.removeChild(child);
    },
    insertInContainerBefore: (container, child, before) => {
        container.insertBefore(child, before);
    },
    insertBefore: (parent, child, before) => {
        parent.insertBefore(child, before);
    },
    prepareUpdate: (
        instance,
        type,
        oldProps,
        newProps
    ) => {
        let payload;
        if (oldProps.bgColor !== newProps.bgColor) {
            payload = {newBgColor: newProps.bgColor};
        }
        return payload;
    },
    commitUpdate: (
        instance,
        updatePayload,
    ) => {
        if (updatePayload.newBgColor) {
            instance.style.backgroundColor = updatePayload.newBgColor;
        }
    }
};

const reconciler = reactReconciler(hostConfig);
export default {
    render(reactElement, domEle, callback) {
        if (!domEle._rootContainer) {
            domEle._rootContainer = reconciler.createContainer(domEle, false, false);
        }
        reconciler.updateContainer(reactElement, domEle._rootContainer, null, callback);
    }
};
```

## 相关资料

1. [React Conf](https://www.youtube.com/watch?v=UxoX2faIgDQ)
2. [React Reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)
3. [Fiber Reconciler](https://reactjs.org/docs/codebase-overview.html#fiber-reconciler)
4. [React ART](https://github.com/reactjs/react-art)
5. [hello-world-custom-react-renderer](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc)
