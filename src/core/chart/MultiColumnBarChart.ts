import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BarChart, BarChartOptions } from "./BarChart";

interface MultiColumnBarBarOptions extends BarChartOptions {
  cols?: number;
}
export class MultiColumnBarChart extends BarChart {
  cols: number = 2;

  c: Component = new Component();
  itemCount: number;
  constructor(options: MultiColumnBarBarOptions = {}) {
    super(options);
    this.itemCount = options.itemCount ?? 20;
    for (let i = 0; i < this.cols; i++) {
      let bar = new BarChart(options);
      this.c.addChild(bar);
    }
  }

  setup(stage: Stage) {
    super.setup(stage);

    this.c.children.forEach((v: BarChart, i) => {
      if (i === this.cols - 1) {
        v.showDateLabel = true;
      } else {
        v.showDateLabel = false;
      }
      v.shape = {
        width: stage.canvas.width / this.cols,
        height: stage.canvas.height,
      };
      v.position = { x: (stage.canvas.width / this.cols) * i, y: 0 };

      v.nonstandardDate = this.nonstandardDate;
      v.reduceID = false;
      v.setup(stage);
      v.rankOffset = 1 + i * this.itemCount;
      v.getBarIdx = (his: number[], c: number) => {
        return his[c] - i * this.itemCount;
      };
      v.getCurrentData = (sec) => {
        let list = this.getCurrentData(sec);
        return list.splice(i * this.itemCount);
      };
      v.labelPlaceholder = v.maxLabelWidth;
      v.valuePlaceholder = v.maxValueLabelWidth;
    });
  }
  getComponent(sec: number) {
    let barchart = this.c.children[1] as BarChart;
    let first = this.c.children[0] as BarChart;
    barchart.getScaleX = (c) => {
      return first.getScaleX(first.getCurrentData(sec));
    };
    // console.log(barchart.getCurrentData(sec));
    // console.log(barchart);
    return this.c;
  }
}
