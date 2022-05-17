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
import { extent, max, range, sum } from "d3-array";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { timeFormat } from "d3-time-format";
export interface BarChartOptions extends BaseChartOptions {
  domain?: (data: any) => [number, number];
  dy?: number;
  barFontSizeScale?: number;
  itemCount?: number;
  barPadding?: number;
  barGap?: number;

  clipBar?: boolean;
  barInfoFormat?: KeyGenerate;
  showDateLabel?: boolean;
  dateLabelOptions?: TextOptions;
  showRankLabel?: boolean;
  barInfoOptions?: TextOptions;
  swapDurationMS?: number;
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
  isUp?: boolean;
}
export class BarChart extends BaseChart {
  dateLabelOptions: TextOptions = {};
  barFontSizeScale: number = 0.9;
  showRankLabel: boolean;
  private readonly rankPadding = 10;
  rankLabelPlaceholder: number;
  reduceID = true;
  dy: number;
  barInfoOptions: TextOptions = {};
  domain: (data: any) => [number, number];
  totalHistoryIndex: Map<any, any>;
  clipBar: boolean = true;
  get maxRankLabelWidth(): number {
    return canvasHelper.measure(
      new Text(this.getRankLabelOptions(this.itemCount))
    ).width;
  }

  constructor(options: BarChartOptions = {}) {
    super(options);
    if (options.itemCount) this.itemCount = options.itemCount;
    if (options.barPadding !== undefined) this.barPadding = options.barPadding;
    if (options.barGap !== undefined) this.barGap = options.barGap;
    if (options.barFontSizeScale !== undefined)
      this.barFontSizeScale = options.barFontSizeScale;
    if (options.barInfoFormat !== undefined)
      this.barInfoFormat = options.barInfoFormat;
    if (options.showDateLabel !== undefined)
      this.showDateLabel = options.showDateLabel;
    if (options.domain) this.domain = options.domain;
    if (options.barInfoOptions !== undefined)
      this.barInfoOptions = options.barInfoOptions;
    if (options.dateLabelOptions !== undefined)
      this.dateLabelOptions = options.dateLabelOptions;
    if (options.swapDurationMS !== undefined)
      this.swapDurationMS = options.swapDurationMS;
    this.showRankLabel = options.showRankLabel ?? false;
    if (options.clipBar !== undefined) this.clipBar = options.clipBar;
    this.dy = options.dy ?? 0;
  }

  itemCount = 20;

  barPadding = 8;
  barGap = 8;
  swapDurationMS = 300;
  rankOffset = 1;
  lastValue = new Map<string, number>();
  labelPlaceholder: number;
  valuePlaceholder: number;
  showDateLabel: boolean = true;

  barInfoFormat = (id: any, meta: Map<string, any>, data: Map<string, any>) => {
    return this.labelFormat(id, meta, data);
  };

  IDList: string[];
  setup(stage: Stage) {
    super.setup(stage);
    // 获得曾出现过的Label集合
    this.setShowingIDList();
    this.rankLabelPlaceholder = this.maxRankLabelWidth;
    this.labelPlaceholder = this.maxLabelWidth;
    this.valuePlaceholder = this.maxValueLabelWidth;
    const historyIndex = this.getTotalHistoryIndex();
    const kernel = this.getConvolveKernel(3);
    for (let [key, _] of historyIndex) {
      historyIndex.set(key, this.convolve(historyIndex.get(key), kernel));
    }
    this.totalHistoryIndex = historyIndex;
  }
  private getConvolveKernel(kw: number) {
    const normalFunc = function normal(x: number) {
      return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x ** 2 / 2));
    };
    let kernel = range(
      -kw,
      kw,
      (((2 * kw) / this.swapDurationMS) * 1000) / this.stage!.options.fps
    ).map((v) => normalFunc(v));
    if (kernel.length % 2 !== 1) {
      kernel.shift();
    }
    const ks = sum(kernel);
    kernel = kernel.map((v) => v / ks);
    return kernel;
  }

  private getTotalHistoryIndex() {
    const secRange = range(
      0,
      this.stage!.options.sec,
      1 / this.stage!.options.fps
    );
    const data = secRange.map((t) =>
      this.getCurrentData(t).map((v) => v[this.idField])
    );
    return this.IDList.reduce((d, id) => {
      const indexList: number[] = [];
      for (const dataList of data) {
        let index = dataList.indexOf(id);
        if (this.reduceID) {
          if (index === -1 || index > this.itemCount) index = this.itemCount;
        } else {
          if (index === -1) index = this.itemCount;
        }
        indexList.push(index);
      }
      d.set(id, indexList);
      return d;
    }, new Map());
  }

  /**
   * 卷积的一种实现，特别地，这个函数对左右两边进行 padding 处理。
   *
   * @param array 被卷数组
   * @param weights 卷积核
   * @returns 卷积后的数组，大小和被卷数组一致
   */
  private convolve(array: number[], weights: number[]) {
    if (weights.length % 2 !== 1)
      throw new Error("weights array must have an odd length");

    let al = array.length;
    let wl = weights.length;
    let offset = ~~(wl / 2);
    let output = new Array<number>(al);

    for (let i = 0; i < al; i++) {
      let kmin = 0;
      let kmax = wl - 1;

      output[i] = 0;
      for (let k = kmin; k <= kmax; k++) {
        let idx = i - offset + k;
        if (idx < 0) idx = 0;
        if (idx >= array.length) idx = array.length - 1;
        output[i] += array[idx] * weights[k];
      }
    }

    return output;
  }

  /**
   * 获得所有能显示在图表上的数据 ID 列表。
   * 这个列表可以用于筛去无用数据。
   */
  private setShowingIDList() {
    const idSet = new Set<string>();
    this.dataGroupByDate.forEach((_, date) => {
      const dt = this.secToDate.invert(date);
      let tmp = [...this.dataScales.entries()]
        .filter((d) => {
          const data = d[1](dt);
          return data != undefined && !isNaN(data[this.valueField]);
        })
        .sort((a, b) => {
          return b[1](dt)[this.valueField] - a[1](dt)[this.valueField];
        });
      if (this.reduceID) {
        tmp = tmp.slice(0, this.itemCount);
      }
      tmp.forEach((item) => {
        let id = item[0];
        idSet.add(id);
      });
    });
    this.IDList = [...idSet.values()];
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

  get totalRankPlaceHolder() {
    if (this.showRankLabel) return this.rankPadding + this.rankLabelPlaceholder;
    else return 0;
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
    let currentData = this.getCurrentData(sec).splice(0, this.itemCount);
    let scaleX: ScaleLinear<number, number, never> = this.getScaleX(
      currentData
    );
    const barComponent = new Component({
      alpha: this.alphaScale(sec),
      position: this.position,
    });
    const barGroup = new Component();
    barComponent.addChild(barGroup);
    // 获取非 NaN 的条目数
    let barCount = currentData.filter((d) => !Number.isNaN(d[this.idField]))
      .length;
    const options = currentData
      .map((data) => this.getBarOptions(data, scaleX, barCount))
      .filter((options) => options.alpha > 0)
      .sort((a, b) => {
        if (a.isUp && !b.isUp) {
          return 1;
        } else if (!a.isUp && b.isUp) {
          return -1;
        } else {
          return a.value - b.value;
        }
      });
    barGroup.children = options.map((o) => this.getBarComponent(o));
    if (this.showRankLabel) {
      this.appendRankLabels(barComponent);
    }

    if (this.showDateLabel) {
      let dateLabelText = this.getDateLabelText(sec);

      let dateLabelOptions = Object.assign(
        {
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
        },
        this.dateLabelOptions
      );
      dateLabelOptions.text = dateLabelText;
      const dateLabel = new Text(dateLabelOptions);
      barComponent.children.push(dateLabel);
    }
    return barComponent;
  }

  private appendRankLabels(res: Component) {
    const rankLabelGroup = new Component();
    for (let idx = 0; idx < this.itemCount; idx++) {
      let text = new Text(this.getRankLabelOptions(idx));
      rankLabelGroup.addChild(text);
    }
    res.addChild(rankLabelGroup);
  }

  private getRankLabelOptions(idx: number): TextOptions | undefined {
    return {
      text: `${idx + this.rankOffset}`,
      textBaseline: "middle",
      textAlign: "right",
      fontSize: this.barHeight * this.barFontSizeScale,
      position: {
        x: this.getBarX() - this.labelPlaceholder - this.rankPadding,
        y: this.getBarY(idx) + this.barHeight / 2,
      },
    };
  }

  getScaleX(currentData: any[]) {
    let scaleX: ScaleLinear<number, number, never>;
    let domain: number[];
    if (this.domain != undefined) {
      domain = this.domain(currentData);
    } else if (this.visualRange != "history") {
      const [_, max] = extent(currentData, (d) => d[this.valueField]);
      domain = [0, max];
    } else {
      domain = [0, max(this.data, (d) => d[this.valueField])];
    }
    scaleX = scaleLinear(domain, [
      0,
      this.shape.width -
        this.margin.left -
        this.barPadding -
        this.labelPlaceholder -
        this.totalRankPlaceHolder -
        this.margin.right -
        this.valuePlaceholder,
    ]);
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

  getTotalHistoryByID(id: any) {
    return this.totalHistoryIndex.get(id);
  }

  private getBarOptions(
    data: any,
    scaleX: ScaleLinear<number, number, never>,
    count: number
  ): BarOptions {
    const cFrame = this.stage!.frame;
    const hisIndex = this.getTotalHistoryByID(data[this.idField]);
    let idx = this.getBarIdx(hisIndex, cFrame);

    // 判断这一帧，柱状条是否在上升
    let isUp = this.barIsUp(cFrame, hisIndex);
    let alpha = scaleLinear([-1, 0, count - 1, count], [0, 1, 1, 0]).clamp(
      true
    )(idx);
    if (Number.isNaN(data[this.valueField])) {
      alpha = 0;
    }
    // 保存非 NaN 数据
    if (!Number.isNaN(data[this.valueField])) {
      this.lastValue.set(data[this.idField], data[this.valueField]);
    } else {
      // 如果当前数据就是 NaN，则使用上次的数据
      data[this.valueField] = this.lastValue.get(data[this.idField]);
    }
    data[this.valueField] = this.lastValue.get(data[this.idField]);
    let color: string;
    if (typeof this.colorField === "string") {
      color = data[this.colorField];
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
    return {
      id: data[this.idField],
      pos: {
        x: this.getBarX(),
        y: this.getBarY(idx),
      },
      alpha,
      data,
      image,
      isUp,
      value: data[this.valueField],
      shape: { width: scaleX(data[this.valueField]), height: this.barHeight },
      color: colorPicker.getColor(color),
      radius: 4,
    };
  }

  getBarIdx(hisIndex: number[], cFrame: number) {
    return hisIndex ? hisIndex[cFrame - 1] : this.itemCount;
  }

  /**
   * 判断当前帧，柱状条是否在上升
   *
   * @param cFrame  当前帧
   * @param hisIndex  历史排序数据
   * @returns 是否在上升
   */
  private barIsUp(cFrame: number, hisIndex?: number[]) {
    if (hisIndex && cFrame > 0 && hisIndex[cFrame] < hisIndex[cFrame - 1]) {
      return true;
    }
    return false;
  }

  private getBarX(): number {
    return (
      this.margin.left +
      this.barPadding +
      this.labelPlaceholder +
      this.totalRankPlaceHolder
    );
  }

  private getBarY(idx: number): number {
    return this.margin.top + idx * (this.barHeight + this.barGap);
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
      clip: this.clipBar,
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
        y: (options.shape.height * this.barFontSizeScale) / 2 + this.dy,
      },
      fontSize: options.shape.height * this.barFontSizeScale,
      font,
      fillStyle: options.color,
    });
    const imagePlaceholder =
      options.image && recourse.images.get(options.image)
        ? options.shape.height
        : 0;

    let defaultBarInfoOptions = {
      textAlign: "right",
      textBaseline: "bottom",
      position: {
        x: options.shape.width - this.barPadding - imagePlaceholder,
        y: options.shape.height,
      },
      fontSize: options.shape.height * this.barFontSizeScale,
      font,
      fillStyle: "#fff",
      strokeStyle: options.color,
      lineWidth: 0,
    };

    let barInfoOptions = Object.assign(
      defaultBarInfoOptions,
      this.barInfoOptions
    );
    barInfoOptions.text = this.barInfoFormat(
      options.id,
      this.meta,
      this.dataGroupByID
    );
    const barInfo = new Text(barInfoOptions);
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
    // const rank = new Text({
    //   textAlign: "left",
    //   textBaseline: "bottom",
    //   text: `${index + this.rankOffset}`,
    //   position: {
    //     x: this.barPadding - imagePlaceholder,
    //     y: options.shape.height,
    //   },
    //   fontSize: options.shape.height * this.barFontSizeScale,
    //   font,
    //   fillStyle: "#fff",
    //   strokeStyle: options.color,
    //   lineWidth: 4,
    // });
    // bar.children.push(rank);
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
        y: (fontSize * this.barFontSizeScale) / 2 + this.dy,
      },
      fillStyle: color,
    };
  }
}
