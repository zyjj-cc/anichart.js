import { Component } from "../component/Component";
import { Image } from "../component/Image";
import { Rect } from "../component/Rect";
import { Text, TextOptions } from "../component/Text";
import { colorPicker } from "../ColorPicker";
import { canvasHelper } from "../CanvasHelper";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGenerate } from "./BaseChart";
import { recourse } from "../Recourse";
import { font } from "../Constant";
import {
  extent,
  max,
  mean,
  range,
  ScaleLinear,
  scaleLinear,
  timeFormat,
} from "d3";

export interface BarChartOptions extends BaseChartOptions {
  barFontSizeScale?: number;
  itemCount?: number;
  barPadding?: number;
  barGap?: number;
  barInfoFormat?: KeyGenerate;
  showDateLabel?: boolean;
  dateLabelOptions?: TextOptions;
}

export interface BarOptions {
  id: string;
  data: any;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
  alpha: number;
  image?: string;
}
export class BarChart extends BaseChart {
  dateLabelOptions: TextOptions | undefined;
  barFontSizeScale: number = 0.9;
  constructor(options?: BarChartOptions) {
    super(options);
    if (!options) return;
    if (options.itemCount) this.itemCount = options.itemCount;
    if (options.barPadding !== undefined) this.barPadding = options.barPadding;
    if (options.barGap !== undefined) this.barGap = options.barGap;
    if (options.barFontSizeScale !== undefined)
      this.barFontSizeScale = options.barFontSizeScale;
    if (options.barInfoFormat !== undefined)
      this.barInfoFormat = options.barInfoFormat;
    if (options.showDateLabel !== undefined)
      this.showDateLabel = options.showDateLabel;
    this.dateLabelOptions = options.dateLabelOptions;
  }

  itemCount = 20;

  barPadding = 8;
  barGap = 8;
  swap = 0.25;
  lastValue = new Map<string, number>();
  labelPlaceholder: number;
  valuePlaceholder: number;
  showDateLabel: boolean = true;

  get sampling() {
    if (this.stage) {
      return Math.round(this.stage.options.fps * this.swap);
    } else {
      return Math.round(30 * this.swap);
    }
  }

  barInfoFormat = (
    id: any,
    data?: Map<string, any>,
    meta?: Map<string, any>
  ) => {
    return this.labelFormat(id, data, meta);
  };

  historyIndex: Map<any, any>;
  IDList: string[];
  setup(stage: Stage) {
    super.setup(stage);
    // 获得曾出现过的Label集合
    this.setShowingIDList();
    this.labelPlaceholder = this.maxLabelWidth;
    this.valuePlaceholder = this.maxValueLabelWidth;
    this.setHistoryIndex();
  }

  private setShowingIDList() {
    const idSet = new Set<string>();
    this.dataGroupByDate.forEach((_, date) => {
      const dt = this.secToDate.invert(date);
      [...this.dataScales.entries()]
        .filter((d) => {
          const data = d[1](dt);
          return data != undefined && !isNaN(data[this.valueField]);
        })
        .sort((a, b) => {
          return b[1](dt)[this.valueField] - a[1](dt)[this.valueField];
        })
        .slice(0, this.itemCount)
        .forEach((item) => {
          let id = item[0];
          idSet.add(id);
        });
    });
    this.IDList = [...idSet.values()];
  }

  private setHistoryIndex() {
    const dataRange = range(
      this.aniTime[0] - this.swap,
      this.aniTime[0],
      this.swap / this.sampling
    );
    const data = dataRange.map((t) =>
      this.getCurrentData(t).map((v) => v[this.idField])
    );
    this.historyIndex = this.IDList.reduce((d, id) => {
      const indexList: number[] = [];
      for (const dataList of data) {
        let index = dataList.indexOf(id);
        if (index === -1) index = this.itemCount;
        indexList.push(index);
      }
      d.set(id, indexList);
      return d;
    }, new Map());
  }

  get maxValueLabelWidth() {
    const d = [...this.data.values()];
    const maxWidth =
      max(d, (item) => {
        const text = new Text(
          this.getLabelTextOptions(
            this.valueFormat(item),
            "#FFF",
            this.barHeight
          )
        );
        const result = canvasHelper.measure(text);
        return result.width;
      }) ?? 0;
    return maxWidth;
  }
  get maxLabelWidth() {
    const maxWidth =
      max(this.IDList, (id) => {
        const text = new Text(
          this.getLabelTextOptions(
            this.labelFormat(id, this.meta, this.dataGroupByID),
            "#FFF",
            this.barHeight
          )
        );
        const result = canvasHelper.measure(text);
        return result.width;
      }) ?? 0;
    return maxWidth;
  }

  getComponent(sec: number) {
    let currentData = this.getCurrentData(sec);
    currentData.forEach((d, i) => {
      const index = Number.isNaN(d[this.valueField])
        ? this.itemCount
        : i > this.itemCount
        ? this.itemCount
        : i;
      this.historyIndex.get(d[this.idField])?.push(index);
    });
    for (const history of this.historyIndex.values()) {
      const len = history.length;
      if (len === this.sampling) {
        history.push(this.itemCount);
      }
      history.shift();
    }
    const indexes = this.IDList.reduce((map, id) => {
      let h = this.historyIndex.get(id) as number[];
      if (h.includes(0) && h.includes(this.itemCount)) {
        for (let idx = 0; idx < h.length; idx++) {
          const element = h[idx];
          if (element === this.itemCount) {
            h[idx] = -1;
          }
        }
      }
      let m = mean(h);
      return map.set(id, m);
    }, new Map());

    let scaleX: ScaleLinear<number, number, never> = this.getScaleX(
      currentData
    );
    const res = new Component({
      alpha: this.alphaScale(sec),
      position: this.position,
    });
    currentData.forEach((data) => {
      const barOptions = this.getBarOptions(data, scaleX, indexes);
      if (barOptions.alpha > 0) {
        res.children.push(this.getBarComponent(barOptions));
      }
    });

    if (this.showDateLabel) {
      let dateLabelText = this.getDateLabelText(sec);

      let dateLabelOptions = this.dateLabelOptions ?? {
        font,
        fontSize: 60,
        fillStyle: "#777",
        textAlign: "right",
        fontWeight: "bolder",
        textBaseline: "bottom",
        position: {
          x: this.shape.width - this.margin.right,
          y: this.shape.height - this.margin.bottom,
        },
      };
      dateLabelOptions.text = dateLabelText;
      const dateLabel = new Text(dateLabelOptions);
      res.children.push(dateLabel);
    }
    return res;
  }

  getScaleX(currentData: any[]) {
    let scaleX: ScaleLinear<number, number, never>;
    if (this.visualRange != "history") {
      const [_, max] = extent(currentData, (d) => d[this.valueField]);
      scaleX = scaleLinear(
        [0, max],
        [
          0,
          this.shape.width -
            this.margin.left -
            this.barPadding -
            this.labelPlaceholder -
            this.margin.right -
            this.valuePlaceholder,
        ]
      );
    } else {
      scaleX = scaleLinear(
        [0, max(this.data, (d) => d[this.valueField])],
        [
          0,
          this.shape.width -
            this.margin.left -
            this.barPadding -
            this.labelPlaceholder -
            this.margin.right -
            this.valuePlaceholder,
        ]
      );
    }
    return scaleX;
  }

  getDateLabelText(sec: number): string {
    if (this.nonstandardDate) {
      let index = Math.floor(this.secToDate(sec).getTime());
      return this.indexToDate.get(index) ?? "";
    }
    return timeFormat(this.dateFormat)(this.secToDate(sec));
  }
  private get barHeight() {
    return (
      (this.shape.height -
        this.margin.top -
        this.margin.bottom -
        this.barGap * (this.itemCount - 1)) /
      this.itemCount
    );
  }

  private getBarOptions(
    data: any,
    scaleX: ScaleLinear<number, number, never>,
    indexes: Map<string, number>
  ): BarOptions {
    if (!Number.isNaN(data[this.valueField])) {
      this.lastValue.set(data[this.idField], data[this.valueField]);
    }
    data[this.valueField] = this.lastValue.get(data[this.idField]);
    let alpha = scaleLinear(
      [-1, 0, this.itemCount - 1, this.itemCount],
      [0, 1, 1, 0]
    ).clamp(true)(indexes.get(data[this.idField])!);
    let color: string;
    if (typeof this.colorField === "string") {
      color = data[this.idField];
    } else {
      color = this.colorField(
        data[this.idField],
        this.meta,
        this.dataGroupByID
      );
    }
    const image =
      typeof this.imageField === "string"
        ? data[this.imageField]
        : this.imageField(data[this.idField], this.meta, this.dataGroupByID);
    var idx: number;
    if (data[this.valueField] !== undefined) {
      idx = indexes.get(data[this.idField])!;
    } else {
      idx = this.itemCount;
      alpha = 0;
    }
    return {
      id: data[this.idField],
      pos: {
        x: this.margin.left + this.barPadding + this.labelPlaceholder,
        y: this.margin.top + idx * (this.barHeight + this.barGap),
      },
      alpha,
      data,
      image,
      value: data[this.valueField],
      shape: { width: scaleX(data[this.valueField]), height: this.barHeight },
      color: colorPicker.getColor(color),
      radius: 4,
    };
  }

  private getBarComponent(options: BarOptions) {
    const res = new Component({
      position: options.pos,
      alpha: options.alpha,
    });
    const bar = new Rect({
      shape: options.shape,
      fillStyle: options.color,
      radius: options.radius,
      clip: false,
    });
    const label = new Text(
      this.getLabelTextOptions(
        this.labelFormat(options.id, this.meta, this.dataGroupByID),
        options.color,
        options.shape.height
      )
    );
    const valueLabel = new Text({
      textBaseline: "middle",
      text: `${this.valueFormat(options.data)}`,
      textAlign: "left",
      position: {
        x: options.shape.width + this.barPadding,
        y: (options.shape.height * this.barFontSizeScale * 0.9) / 2,
      },
      fontSize: options.shape.height * this.barFontSizeScale,
      font,
      fillStyle: options.color,
    });
    const imagePlaceholder =
      options.image && recourse.images.get(options.image)
        ? options.shape.height
        : 0;
    const barInfo = new Text({
      textAlign: "right",
      textBaseline: "bottom",
      text: this.barInfoFormat(options.id, this.meta),
      position: {
        x: options.shape.width - this.barPadding - imagePlaceholder,
        y: options.shape.height,
      },
      fontSize: options.shape.height * this.barFontSizeScale,
      font,
      fillStyle: "#fff",
      strokeStyle: options.color,
      lineWidth: 4,
    });
    if (options.image && recourse.images.get(options.image)) {
      const img = new Image({
        src: options.image,
        position: {
          x: options.shape.width - options.shape.height,
          y: 0,
        },
        shape: {
          width: options.shape.height,
          height: options.shape.height,
        },
      });
      bar.children.push(img);
    }
    bar.children.push(barInfo);
    res.children.push(bar);
    res.children.push(valueLabel);
    res.children.push(label);
    return res as Component;
  }

  private getLabelTextOptions(
    text: string,
    color = "#fff",
    fontSize: number = 16
  ): TextOptions {
    return {
      text: `${text}`,
      textAlign: "right",
      textBaseline: "middle",
      fontSize: fontSize * this.barFontSizeScale,
      font,
      position: {
        x: 0 - this.barPadding,
        y: (fontSize * this.barFontSizeScale * 0.9) / 2,
      },
      fillStyle: color,
    };
  }
}
