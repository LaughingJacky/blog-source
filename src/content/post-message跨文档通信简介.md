---
id: 7d15c5c496b35e601dae
slug: yyy-mm-dd-title
title: postMessage跨文档通信简介
date: 2018-11-15T06:11:26.077Z
description: >-
  window.postMessage()
  方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为https），端口号（443为https的默认值），以及主机 
  (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。
tags:
  - postMessage
  - Web Worker
headerImage: >-
  https://2img.net/h/i968.photobucket.com/albums/ae170/laughingjacky/Blog%20Assets%202019/broadcastchannel_zpsimqib898.jpeg
templateKey: blog-post
---
## 概述

web通信主要是为了实现独立上下文之间共享数据, 满足业务需求, 同时尽量避免暴露数据的一种技术手段。通常可通过获取句柄、共享存储或结合事件通知等方式来实现。

## html文档间通信

实现方式主要有

1. 父子文档通信(借助window对象[postMessage](https://caniuse.com/#search=postMessage));

2. 借助[localStorage](https://caniuse.com/#search=localStorage)监听;

3. 使用广播隧道([BroadcastChannel](https://caniuse.com/#search=BroadcastChannel));

4. 借助服务器向另一窗口推送信息(WebSocket, SSE)。

### 父子文档通信

window对象上的postMessage方法包含三个参数:

- message为消息体,它将会被结构化克隆算法序列化

- targetOrigin定义窗口的origin属性, 保证协议、主机地址或端口的完全匹配

- transfer是一个消息上下文, 供目标环境调用

parent.html:

```js
const childPage = window.open('./child.html', 'child')
childPage.onload = () => {
    childPage.postMessage('hello', location.origin);
}
```

child.html:

```js
window.onmessage = evt => {
    console.log(evt)
    // evt.data
}
```

iframe通信与此类似, 获取对象分别为window.frames[0]和window.parent。
此方案比较普遍, 局限在html为父子关系的页面。

### localStorage监听

源页面

```js
localStorage.setItem('message', 'hello')
```

接收页面

```js
window.onstorage = e => {
    console.log(e.key, e.oldValue, e.newValue)
}
```

实现较简单, 但数据会暴露给Web Storage, 并且赋值两次相同时onStorage不会触发。

### 广播隧道BroadcastChannel

发送页面

```js
const channel = new BroadcastChannel('tab')
channel.postMessage('hello')
```

接收页面

```js
const channel = new BroadcastChannel('tab')
channel.onmessage = e => {
    console.log(e)
}
```

数据较安全, 但是兼容性不好。

### 服务端推送

WebSocket为全双工通道, 可以双向通信; SSE为单向通道, 只能服务器向浏览器发送。实现方法可以参考[Server-Sent Events 教程](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)。

## Web Worker间通信

worker的postMessage方法向worker内部作用域发送一个消息, worker本身可以使用DedicatedWorkerGlobalScope.postMessage  方法将信息发送回生成它的线程。worker没有浏览器环境, postMessage方法可有两个参数, 第一个为消息体, 第二个是隧道数组。

调用worker的文档

```js
var w1 = new Worker('worker1.js')
var w2 = new Worker('worker2.js')
var mc = new MessageChannel()
w1.postMessage('port1', [mc.port1])
w2.postMessage('port2', [mc.port2])
w2.onmessage = function(e) {
    console.log(`get ${e.data} on html`)
}
```

worker1.js

```js
self.onmessage = e => {
    console.log(`get ${e.data} from ${e.currentTarget.origin}`)
    const port = e.ports[0]
    port.postMessage('message send from worker1')
    port.onmessage = function(evt) {
        console.log(`get ${evt.data} on ${e.currentTarget.location}`)
    }
}
```

worker2.js

```js
self.onmessage = e => {
    console.log(`get ${e.data} from ${e.currentTarget.origin}`)
    const port = e.ports[0]
    port.onmessage = function(evt) {
        console.log(`get ${evt.data} on ${e.currentTarget.location}`)
        postMessage(`${evt.data} from worker2`)
    }
}

```

可以看到控制台输出

```js
get port1 from http://localhost:端口号
get port2 from http://localhost:端口号
get message send from worker1 on http://localhost:端口号/worker2.js
get message send from worker1 from worker2 on html
```

还有一种允许多个脚本共享单一worker的Shared Web Workers, 兼容性不太好, 以后有机会再说。
