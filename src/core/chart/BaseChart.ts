import dayjs from "dayjs";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { extent, group, max, min, rollup } from "d3-array";
import { format } from "d3-format";
import { Ani } from "../ani/Ani";
import { canvasHelper } from "../CanvasHelper";
import { Component } from "../component/Component";
import { Text, TextOptions } from "../component/Text";
import { font } from "../Constant";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";
import cloneDeep from "lodash/clonedeep";
function isValidDate(date: any) {
  return date instanceof Date && !isNaN(date.getTime());
}
export interface BaseChartOptions {
  interpolateInitValue?: number;
  aniTime?: [number, number];
  fadeTime?: [number, number];
  freezeTime?: [number, number];

  position?: { x: number; y: number };

  shape?: { width: number; height: number };
  margin?: { left: number; top: number; bottom: number; right: number };
  xTickFormat?: (n: number | { valueOf(): number }) => string;
  yTickFormat?: (n: number | { valueOf(): number }) => string;

  showAxis?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  idField?: string;
  colorField?: string | KeyGenerate;
  imageField?: string | KeyGenerate;
  dateField?: string;
  valueField?: string;

  /**
   * 数据消失和进入时的动画时间
   */
  dataFadeMS?: number;
  valueKeys?: string[];

  valueFormat?: (cData: any) => string;
  labelFormat?: (
    id: string,
    meta: Map<string, any>,
    data: Map<string, any>
  ) => string;
  dateFormat?: string;
  visualRange?: "total" | "current" | "history" | [number, number];
  dataName?: string;
  metaName?: string;
  maxIntervalMS?: number;
}
export type KeyGenerate =
  | ((id: string) => string)
  | ((id: string, meta: Map<string, any>) => string)
  | ((id: string, meta: Map<string, any>, data: Map<string, any>) => string);
export abstract class BaseChart extends Ani {
  yAxisWidth: number;
  xAxisHeight: number;
  yAxisPadding: number = 4;
  xAxisPadding: number = 4;
  maxIntervalMS: number;
  dataGroupByDate: Map<any, any[]>;
  visualRange: "total" | "current" | "history" | [number, number];
  interpolateInitValue: number;
  indexToDate: Map<number, string>;
  nonstandardDate: any;
  dataFadeMS: number;
  showAxis: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  constructor(options: BaseChartOptions = {}) {
    super();
    if (!options) return;
    if (options.fadeTime) this.fadeTime = options.fadeTime;
    if (options.aniTime) this.aniTime = options.aniTime;
    if (options.freezeTime) this.freezeTime = options.freezeTime;
    if (options.idField) this.idField = options.idField;
    if (options.colorField) this.colorField = options.colorField;
    if (options.dateField) this.dateField = options.dateField;
    if (options.valueKeys) this.valueKeys = options.valueKeys;
    if (options.valueField) this.valueField = options.valueField;
    if (options.imageField) this.imageField = options.imageField;
    if (options.margin !== undefined) this.margin = options.margin;
    if (options.shape) this.shape = options.shape;
    if (options.dateFormat) this.dateFormat = options.dateFormat;
    if (options.labelFormat) this.labelFormat = options.labelFormat;
    if (options.valueFormat) this.valueFormat = options.valueFormat;
    if (options.dataName) this.dataName = options.dataName;
    if (options.metaName) this.metaName = options.metaName;
    if (options.visualRange) this.visualRange = options.visualRange;
    if (options.position) this.position = options.position;
    this.interpolateInitValue = options.interpolateInitValue ?? NaN;
    this.dataFadeMS = options.dataFadeMS ?? 1000;
    this.maxIntervalMS = options.maxIntervalMS ?? Number.MAX_VALUE;
    if (options.xTickFormat) this.xTickFormat = options.xTickFormat;
    if (options.yTickFormat) this.yTickFormat = options.yTickFormat;
    this.showAxis = options.showAxis ?? true;
    this.showXAxis = options.showXAxis ?? true;
    this.showYAxis = options.showYAxis ?? true;
  }
  tickKeyFrameDuration: number = 1;
  dataScales: Map<string, any>;
  idField = "id";
  colorField: string | KeyGenerate = "id";
  imageField: string | KeyGenerate = "id";
  dateField = "date";
  valueField = "value";
  valueKeys = ["value"];
  imageKey = "image";
  shape: { width: number; height: number };
  position = { x: 0, y: 0 };
  margin = { left: 20, top: 20, right: 20, bottom: 20 };
  aniTime: [number, number];
  freezeTime: [number, number] = [2, 2];
  fadeTime: [number, number] = [0.5, 0];
  data: any[];
  dataGroupByID: Map<string, any>;
  meta: Map<string, any>;

  dataName = "data";
  metaName = "meta";
  alphaScale: ScaleLinear<number, number, never>;
  secToDate: ScaleLinear<any, any, never>;
  dateFormat = "%Y-%m-%d";

  xTickFormat = format(",d");
  yTickFormat = format(",d");
  totallyMax: number;
  totallyMin: number;
  currentMax: number;
  currentMin: number;
  historyMax: number;
  historyMin: number;

  setup(stage: Stage) {
    super.setup(stage);
    this.setData();
    this.setMeta();
    this.setDefaultAniTime(stage);
    this.setDataScales();
    this.setAlphaScale();
    // 初始化整体最值
    this.totallyMax = max(this.data, (d) => d[this.valueField]);
    this.totallyMin = min(this.data, (d) => d[this.valueField]);
    // 初始化历史最值
    this.historyMax = this.totallyMin;
    this.historyMin = this.totallyMin;
    // 用于计算坐标
    this.currentMax = this.historyMin;
    this.currentMin = this.historyMax;

    if (!this.shape) {
      this.shape = {
        width: stage.canvas.width,
        height: stage.canvas.height,
      };
    }
  }
  setData() {
    this.data = cloneDeep(recourse.data.get(this.dataName));
    let dateSet = new Set();
    let dateIndex = 0;
    this.indexToDate = new Map<number, string>();
    this.data.forEach((d: any) => {
      if (!dateSet.has(d[this.dateField])) {
        dateSet.add(d[this.dateField]);
        dateIndex += 1;
        this.indexToDate.set(dateIndex, d[this.dateField]);
      }
      Object.keys(d).forEach((k) => {
        switch (k) {
          case this.dateField:
            // 日期字符串转成日期
            let date = dayjs(d[this.dateField]).toDate();
            if (isValidDate(date)) {
              d[k] = date;
              this.nonstandardDate = false;
            } else {
              this.nonstandardDate = true;
              d[k] = new Date(dateIndex);
            }
            break;
          case this.idField:
            // ID保持不变
            break;
          default:
            // 数值转成数字
            if (
              typeof d[k] === "string" &&
              (this.valueKeys.includes(k) || this.valueField === k)
            ) {
              d[k] = +d[k].replace(/,/g, "");
            }
        }
      });
    });
    this.dataGroupByID = group(this.data, (d) => d[this.idField]);
    const dataGroupByDate = group(this.data, (d) =>
      (d[this.dateField] as Date).getTime()
    );
    const result = new Map<Date, any>();
    dataGroupByDate.forEach((v: any[], k: number) => {
      result.set(new Date(k), v);
    });
    this.dataGroupByDate = result;
  }
  private setDataScales() {
    // 整体日期范围
    const dateExtent = extent(this.data, (d) => d[this.dateField]);
    // 播放进度到日期的映射
    this.secToDate = scaleLinear(this.aniTime, dateExtent).clamp(true);
    const g = group(this.data, (d) => d[this.idField]);
    const dataScales = new Map();
    g.forEach((dataList, k) => {
      dataList.sort(
        (a, b) => a[this.dateField].getTime() - b[this.dateField].getTime()
      );
      // 插入 NaN
      this.insertNaN(dataList, dateExtent);
      // 可优化: 删掉连续的重复值
      // FIXME: 此处有BUG。目前的实现，会干掉连续两个重复值的后一个。
      // 然而只有出现连续的三个重复值，才能忽略了中间的一个重复值。
      // if (true) {
      //   let temp: any[] = [];
      //   temp.push(dataList[0]);
      //   for (let i = 1; i < dataList.length; i++) {
      //     if (
      //       dataList[i][this.valueField] != dataList[i - 1][this.valueField]
      //     ) {
      //       temp.push(dataList[i]);
      //     }
      //   }
      //   temp.push(dataList[dataList.length - 1]);
      //   dataList = temp;
      // }
      const dateList = dataList.map((d) => d[this.dateField]);
      const secList = dateList.map((d) => this.secToDate.invert(d));
      // 线性插值
      const dataScale = scaleLinear(secList, dataList).clamp(true);
      dataScales.set(k, dataScale);
    });
    this.dataScales = dataScales;
  }

  private insertNaN(dataList: any[], dateExtent: [any, any]) {
    // 总之，第一次出现之前需要插入NaN
    const first = dataList[0];
    const obj = Object.assign({}, first);
    obj[this.valueField] = this.interpolateInitValue;
    // 默认 fade 为 1
    const fadeDuration =
      -this.secToDate(this.aniTime[0]).getTime() +
      this.secToDate(this.aniTime[0] + this.dataFadeMS / 1000).getTime();
    obj[this.dateField] = new Date(
      obj[this.dateField].getTime() - fadeDuration
    );
    dataList.unshift(obj);

    if (this.maxIntervalMS !== Number.MAX_VALUE) {
      // 如果间隔时间大于一定值，则插入一个 NaN
      // 在后面插入NaN
      const last = dataList[dataList.length - 1];
      if (
        dateExtent[1].getTime() - last[this.dateField].getTime() >
        this.maxIntervalMS
      ) {
        const obj = Object.assign({}, last);
        obj[this.valueField] = this.interpolateInitValue;

        obj[this.dateField] = new Date(
          obj[this.dateField].getTime() + fadeDuration
        );
        dataList.push(obj);
      }

      for (let i = 0; i < dataList.length - 1; i++) {
        const prev = dataList[i];
        const next = dataList[i + 1];
        const delta =
          next[this.dateField].getTime() - prev[this.dateField].getTime();
        // 如果间隔比最大允许间隔大，则需要插入
        if (delta > this.maxIntervalMS) {
          // 如果大于两倍 fade，则在前后间隔 fade 的地方插入两个默认数据
          if (delta > 2 * fadeDuration) {
            const obj = Object.assign({}, prev);
            obj[this.valueField] = this.interpolateInitValue;
            obj[this.dateField] = new Date(
              obj[this.dateField].getTime() + fadeDuration
            );
            dataList.splice(i + 1, 0, obj);
            i++;
            const obj2 = Object.assign({}, obj);
            obj2[this.dateField] = new Date(
              next[this.dateField] - fadeDuration
            );
            dataList.splice(i + 1, 0, obj2);
            i++;
          } else {
            // 否则，在最中间插入一个默认数据
            const obj = Object.assign({}, prev);
            obj[this.valueField] = this.interpolateInitValue;
            obj[this.dateField] = new Date(
              obj[this.dateField].getTime() + delta / 2
            );
            dataList.splice(i + 1, 0, obj);
            i++;
          }
        }
      }
    }
  }

  getComponent(sec: number): Component | null {
    const res = new Component({
      position: this.position,
      alpha: this.alphaScale(sec - this.fadeTime[0] - this.freezeTime[0]),
    });
    return res;
  }

  setMeta() {
    if (recourse.data.get(this.metaName)) {
      this.meta = rollup(
        cloneDeep(recourse.data.get(this.metaName)),
        (v) => v[0],
        (d) => (d as any)[this.idField]
      );
    }
  }
  valueFormat = (cData: any) => {
    return format(",.0f")(cData[this.valueField]);
  };

  labelFormat: KeyGenerate = (
    id: string,
    meta?: Map<string, any>,
    data?: any
  ) => {
    if (meta && meta.get(id) && meta.get(id).name) {
      return meta.get(id).name;
    } else {
      return id;
    }
  };

  private setAlphaScale() {
    this.alphaScale = scaleLinear(
      [
        this.aniTime[0] - this.freezeTime[0] - this.fadeTime[0],
        this.aniTime[0] - this.freezeTime[0],
        this.aniTime[1] + this.freezeTime[1],
        this.aniTime[1] + this.freezeTime[1] + this.fadeTime[1],
      ],
      [this.fadeTime[0] ? 0 : 1, 1, 1, this.fadeTime[1] ? 0 : 1]
    ).clamp(true);
  }

  private setDefaultAniTime(stage: Stage) {
    if (this.aniTime === undefined) {
      this.aniTime = [
        0 + this.fadeTime[0] + this.freezeTime[0],
        stage.options.sec - this.freezeTime[1] - this.fadeTime[1],
      ];
    }
  }
  getCurrentData(sec: number, filter = true) {
    let currentData = [...this.dataScales.values()];
    currentData = currentData.map((scale) => {
      return scale(sec);
    });
    if (filter) {
      currentData = currentData.filter((d) => d !== undefined);
    }
    currentData = currentData.sort((a, b) => {
      if (Number.isNaN(b[this.valueField])) {
        return -1;
      } else if (Number.isNaN(a[this.valueField])) {
        return 1;
      } else {
        return b[this.valueField] - a[this.valueField];
      }
    });
    return currentData;
  }

  protected getScalesBySec(sec: number) {
    const currentData = this.getCurrentData(sec);
    let [minValue, maxValue] = extent(currentData, (d) => d[this.valueField]);

    if (this.historyMax > maxValue) {
      maxValue = this.historyMax;
    }
    if (this.historyMin < minValue) {
      minValue = this.historyMin;
    }
    const trueSec =
      sec < this.aniTime[0]
        ? this.aniTime[0]
        : sec > this.aniTime[1]
        ? this.aniTime[1]
        : sec;
    const scales = {
      x: scaleLinear(
        [this.aniTime[0], trueSec],
        [0, this.shape.width - this.margin.left - this.margin.right]
      ),
      y: scaleLinear(
        [minValue, maxValue],
        [this.shape.height - this.margin.top - this.margin.bottom, 0]
      ),
    };
    return scales;
  }

  protected getAxis(sec: number, scales: { x: any; y: any }) {
    const size = 30;
    const tickComp = {
      text: `${this.yTickFormat(this.currentMax)}`,
      font,
      fillStyle: "#777",
      fontSize: size,
    } as TextOptions;
    const tickKeySec = this.tickKeySecRange(sec);
    const tickScales = tickKeySec.map((s) => {
      return this.getScalesBySec(s);
    });
    this.yAxisWidth = canvasHelper.measure(new Text(tickComp))?.width ?? 0;
    this.xAxisHeight = size;
    const yAxis = this.getAxisComponent(
      this.yTickFormat,
      tickScales[0].y,
      tickScales[1].y,
      this.margin.left + this.yAxisWidth,
      5,
      tickComp,
      "y",
      sec,
      tickKeySec,
      scales.y
    );
    const xAxis = this.getAxisComponent(
      this.xTickFormat,
      tickScales[0].x,
      tickScales[1].x,
      this.margin.top + this.xAxisHeight,
      5,
      tickComp,
      "x",
      sec,
      tickKeySec,
      scales.x
    );
    return { yAxis, xAxis };
  }

  protected getAxisComponent(
    format: (v: number | { valueOf(): number }) => string,
    scale0: ScaleLinear<number, number, never>,
    scale1: ScaleLinear<number, number, never>,
    pos: number,
    count: number,
    text: TextOptions,
    type: "x" | "y",
    sec: number,
    secRange: [number, number],
    scale: ScaleLinear<number, number, never>
  ) {
    const alpha = (sec - secRange[0]) / (secRange[1] - secRange[0]);
    const ticks0 = scale0.ticks(count);
    const ticks1 = scale1.ticks(count);
    const ticks: { v: number; a: number; init: number }[] = [
      ...ticks0.map((t) => {
        if (ticks1.find((d) => d === t)) {
          return { v: t, a: 1, init: 0 };
        } else {
          return { v: t, a: 1 - alpha, init: 0 };
        }
      }),
    ];

    ticks1.forEach((tickVal) => {
      const tick = ticks.find((d) => d.v === tickVal);
      if (tick) {
        tick.a = 1;
      } else {
        ticks.push({ v: tickVal, a: alpha, init: 1 });
      }
    });
    const res = new Component({
      position: {
        x: this.margin.left + this.yAxisWidth + this.yAxisPadding,
        y: this.margin.top + this.xAxisHeight + this.xAxisPadding,
      },
    });
    res.children = ticks.map((tick) => {
      const t = new Text(text);
      if (type === "y") {
        t.position = { y: scale(tick.v), x: -this.yAxisPadding };
        t.textAlign = "right";
        t.textBaseline = "middle";
      } else {
        t.position = { x: scale(tick.v), y: -this.xAxisPadding };
        t.textBaseline = "bottom";
        t.textAlign = "center";
      }
      // t.children.push(
      //   new Rect({
      //     shape: { width: 10, height: 1 },
      //     fillStyle: "#Fff",
      //   })
      // );
      t.text = format(tick.v);
      t.alpha = tick.a;
      return t;
    });
    return res;
  }
  protected tickKeySecRange(sec: number): [number, number] {
    const remained = sec % this.tickKeyFrameDuration;
    const start = sec - remained;
    const end = start + this.tickKeyFrameDuration;
    return [start, end];
  }
}
