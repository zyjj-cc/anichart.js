import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";
import { BarChart, BarChartOptions } from "./BarChart";
import { BaseChart } from "./BaseChart";

interface MultiColumnBarBarOptions extends BarChartOptions {
  cols?: number;
}
export class MultiColumnBarChart extends BarChart {
  cols: number = 2;

  c: Component = new Component();
  itemCount: number = 20;
  constructor(options?: MultiColumnBarBarOptions) {
    super(options);
    if (!options) return;
    for (let i = 0; i < this.cols; i++) {
      let bar = new BarChart(options);
      this.c.addChild(bar);
    }
  }

  setup(stage: Stage) {
    super.setup(stage);

    this.c.children.forEach((v: BarChart, i) => {
      if (i == this.cols - 1) {
        v.showDateLabel = true;
      } else {
        v.showDateLabel = false;
      }
      v.shape = {
        width: stage.canvas.width / this.cols,
        height: stage.canvas.height,
      };
      v.position = { x: (stage.canvas.width / this.cols) * i, y: 0 };
      v.itemCount = this.itemCount * this.cols;

      v.indexToDate = this.indexToDate;
      v.nonstandardDate = this.nonstandardDate;
      v.setup(stage);
      v.itemCount = this.itemCount;
      v.getCurrentData = (sec) => {
        let list = this.getCurrentData(sec);
        return list.splice(i * this.itemCount);
      };
      v.labelPlaceholder = v.maxLabelWidth;
      v.valuePlaceholder = v.maxValueLabelWidth;
    });
  }
  getComponent(sec) {
    let barchart = this.c.children[1] as BarChart;
    // console.log(barchart.getCurrentData(sec));
    // console.log(barchart);
    return this.c;
  }
}
