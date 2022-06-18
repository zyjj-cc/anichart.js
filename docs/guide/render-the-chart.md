# Render the Chart

I created a [template](https://github.com/Jannchie/anichart-remotion-template) for render the chart by [Remotion](https://www.remotion.dev/).

## Step 1. Clone the repository

First we need to clone this repository.

``` bash
git clone https://github.com/Jannchie/anichart-remotion-template
cd anichart-remotion-template
```

Or, since this repository is defined as a github template, you can click `Use this template` button on the github page to create a repository of your own.

## Step 2. Install the dependencies

We need to install the dependencies. The package manager I'm using here is pnpm, but you can use other package managers as well.

``` bash
pnpm i
```

## Step 3. Run the development server

We can start a development server for preview with the following command. By default, the server will run on port 3000.

``` bash
pnpm start
```

## Step 4. Implement the definition of charts

We define the chart in the file `src/DemoChart.tsx`.

In @anichart/remotion, there is a React function component for Remotion called "Anichart".

``` tsx
import { Anichart } from '@anichart/remotion';
```

This component requires passing in a callback function called `initStage`, whose only parameter is `anichart.Stage`.

``` tsx
<Anichart initStage={initStage} />;
```

In this callback function, we need to define the chart and mount it to this stage.

``` ts
function initStage(stage: ANI.Stage) {
  ANI.recourse.loadCSV('path/to/data', 'data');
  const barChart = new ANI.BarChart();
  stage.addChild(barChart);
}
```

At this point, we can view the visualization in the development server's page.

## Step 5. Render the video

After confirming that the visualization is correct, it can be rendered into a video with the following command.

``` bash
pnpm build
```
