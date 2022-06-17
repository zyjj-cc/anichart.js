# Getting Started

## Setup

You can use the tag to import the latest version of the project.

### CDN

You can start using anichart with CDN services, which is great for prototyping.

``` html
<script src="https://cdn.jsdelivr.net/npm/anichart@latest/dist/anichart.min.js"></script>
```

But it may be temporarily unavailable due to unstable third-party CDN network connection and other reasons.

### NPM

Anichart is available as an npm package, but it is recommended to use Yarn or pnpm to install it.

``` bash
npm install anichart
```

## Usage

::: tip
This project is written in Typescript. If you also use Typescript, you can get richer type inference and code hints.
:::

You can skip this step if you use label import. If you install locally, you need to import:

``` js
import * as anichart from "anichart"
```

First, we need to create a Stage. Stage is the carrier of the entire animation.

``` js
const stage = new anichart.Stage();
```

Then, Add an component to the stage, such as adding a white rectangle to the stage:

``` js
// create a white rectangle
const rect = new anichart.Rect({
  shape: { width: 50, height: 50}, // set the width and height
  fillStyle: "white" // set the color
});
// add the rectangle to the stage
stage.addChild(rect);
```

### Start rendering

After adding all the components, it only takes one line of code to play the animation.

``` js
stage.play();
```

The above is the basic usage process. Next I'll briefly show you how to render a data visualization video of a bar chart.
