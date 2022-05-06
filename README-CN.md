<p align="center">
    <img height="250px" src="https://github.com/Jannchie/anichart.js/blob/master/public/image/ANI.png?raw=true"><br/>
</p>

<p align="center">
    <img alt="Code Time" src="https://img.shields.io/endpoint?style=flat-square&url=https://codetime-api.datreks.com/badge/2?logoColor=white%26project=anichart%26recentMS=0%26showProject=false" />
    <img src="https://data.jsdelivr.com/v1/package/npm/anichart/badge">
    <img alt="NPM" src="https://img.shields.io/npm/l/anichart?style=flat-square">
    <img alt="npm" src="https://img.shields.io/npm/v/anichart?style=flat-square">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Jannchie/anichart.js?style=flat-square">
    <img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed/Jannchie/anichart.js?style=flat-square">
    <a href="https://lgtm.com/projects/g/Jannchie/anichart.js/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/Jannchie/anichart.js.svg?style=flat-square&logo=lgtm&logoWidth=18"/></a>
</p>

中文 | [English](/readme.md)

轻松地制作数据可视化动画视频。

**Version 3.x is currently under development.** Version 3.x will streamline the project by removing the FFMpeg.awsm calling code and the node.js rendering part that you implemented yourself. The online browsing functionality is retained. As for the rendering process, I'm going to use the [Remotion](https://www.remotion.dev/) project. I will develop a template combining Anichart and Remotion for your reference.

## 示例

![anichart-preview](/public/image/anichart-preview.png)

### 在线编辑（v2.x）

> **警告**
> 由于浏览器安全策略的更新，在线编辑目前仅支持浏览，而不再直接支持视频导出。

[![Edit anichart 2.x](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/anichart-2x-m3xbz?fontsize=14&hidenavigation=1&theme=dark)

## 写在前面

**开发过程中我认识到架构上的不合理之处，API正在重构中，仅有测试用例，没有项目文档。请谨慎使用。**

本项目开源、自由、免费。

这是一个 Web 等环境下，利用 TypeScript 编程的动画库。可用于数据可视化、视频动画展示、片头片尾等领域。

目前正在开发中，虽然该有的功能已经实现了，但是没有提供友好的接口，想要做出自己的作品需要阅读源代码并了解 Typescript 编程。

目前前端、后端导出视频均使用内置的FFmpeg。能够直接导出MP4。如果觉得wasm版本的FFmpeg速度过慢，也支持导出Png序列，调用本地FFmpeg生成视频。

本项目需要各位技术人员的技术支持。但如果你只是一个普通的使用者，也能通过赞助的方式支持。你可以通过[爱赞助](https://azz.net/jannchie)利用支付宝或者微信进行支持。也能通过GitHub Sponsor功能支持（需要信用卡一张）。

## 简介

这是一个更好的可视化模板。

相较于它的[前身](https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-js)，主要优势在于：

- 可编程化：开放接口，允许插入自定义的代码，利用框架计算的数据，基于Canvas Api进行绘图。
- 直出视频：可以直接通过每一帧的图像渲染视频，无需借助任何录屏工具。保持了FPS的稳定和渲染的速度。并且归功于此，现在能够导出任何分辨率而不依赖于显示的屏幕范围。同时能够通过内置的API实现进度的拖动，便于调试。
- 约定优于配置：最大程度简化了用户的配置，无需太多复杂的设定便可以获得美观的图表。
- 虚拟组件：类似于虚拟DOM，通过拆分组件和渲染器，进一步增强了扩展能力。便于移植到更多的平台，以后会支持使用效率更高的webgl进行渲染。

## 使用

目前，针对普通用户的 anichart 正在开发中，下面要介绍的内容面向开发者，比较硬核。如果目前就有数据可视化需求，可以使用[前身](https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-js)项目，或者使用前述[在线编辑项目](https://codesandbox.io/s/anichart-2x-m3xbz?fontsize=14&hidenavigation=1&theme=dark)。

---

针对一般开发人员，可以使用[这个仓库](https://github.com/Jannchie/anichart-template)作为模板，进行数据可视化项目的开发。你需要有一定的 Javascript 或者 Typescript 的开发基础。

### 步骤

```bash
yarn install
```

```bash
yarn start
```

## 安装

针对高级开发人员，如果想要把 anichart 用于自己的项目中，可以进行如下操作进行安装。

### 通过包管理器

```bash
yarn add anichart

# 或者
npm i anichart
```

### 标签导入

```html
<script src="https://cdn.jsdelivr.net/npm/anichart@latest/dist/anichart.min.js"></script>
```

## 用法

### 使用Npm或者Yarn导入

如果使用标签导入可以跳过这一步，如果使用npm或者Yarn需要通过以下代码引入包：

``` js
const anichart = require("anichart");
```

或者

``` js
import * as anichart from "anichart";
```

### 准备数据

以CSV文件为例。

``` csv
name,date,value,channel,other
Jannchie,2020-01-01,1,科技,other
Jannchie,2020-01-03,6,科技,other
Jannchie,2020-01-05,3,科技,other
Jannchie,2020-01-07,-,科技,other
Jannchie,2020-01-09,7,科技,other
Jannchie,2020-01-12,12,科技,other
Cake47,2020-01-03,10,生活,other
Cake47,2020-01-02,5,生活,other
Cake47,2020-01-06,2,生活,other
Cake47,2020-01-09,3,生活,other
Cake47,2020-01-11,4,生活,other
```

### 载入数据

```js
// 默认情况下，需要通过内置的recourse对象载入数据
// 第一个参数是数据的路径，第二个参数是数据的名称
anichart.recourse.loadData("path/to/data.csv", "data")
```

### 创建对象

```js
// 创建一个舞台
let stage = new anichart.Stage();
// 创建一个图表，默认情况下会载入名称为data的数据
let chart = new anichart.BarChart();
// 挂载图表
stage.addChild(chart);
```

### 播放动画

可以使用代码控制播放。

```js
stage.play();
```

### 导出视频

内置了ffmpeg进行导出。输出信息会在console中打印。

```js
// 配置导出视频
stage.output = true;
```

### 测试

#### Browser环境

使用yarn:

```bash
yarn serve
```

或者npn：

```bash
npm run serve
```

#### Node.js环境

如果有特殊需求，比如服务器端定时导出视频的用户，可以使用 Node.js 环境。

该项目现已提供 node.js 的相关支持，你可以直接使用 node 运行该项目，无需任何配置，你将能够直接导出 PNG 序列，以便于在 FFmpeg 等工具中整合成视频（暂时没有提供调用本地 FFmpeg 功能的计划，期待开发者提出 PR）。但是 node 环境并不是主要开发测试环境，在该环境下进行开发可能会遇到未知的 BUG。我的精力有限，不一定能够及时给予反馈，希望有能力的开发者能够一起维护。

你可以使用下列命令测试 Node.js 下的 anichart：

```bash
cd test
ts-node index.ts # 该项目使用 Typescript 编写，因此需要 ts-node 环境，你也可以先编译成 js 后测试编译好的文件。
```
