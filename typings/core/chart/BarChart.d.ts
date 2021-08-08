import { Component } from "../component/Component";
import { TextOptions } from "../component/Text";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGenerate } from "./BaseChart";
import { ScaleLinear } from "d3";
export interface BarChartOptions extends BaseChartOptions {
    domain?: (data: any) => [number, number];
    dy?: number;
    barFontSizeScale?: number;
    itemCount?: number;
    barPadding?: number;
    barGap?: number;
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
    pos: {
        x: number;
        y: number;
    };
    shape: {
        width: number;
        height: number;
    };
    color: string;
    radius: number;
    alpha: number;
    image?: string;
}
export declare class BarChart extends BaseChart {
    dateLabelOptions: TextOptions;
    barFontSizeScale: number;
    showRankLabel: boolean;
    private readonly rankPadding;
    rankLabelPlaceholder: number;
    reduceID: boolean;
    dy: number;
    barInfoOptions: TextOptions;
    domain: (data: any) => [number, number];
    totalHistoryIndex: Map<any, any>;
    get maxRankLabelWidth(): number;
    constructor(options?: BarChartOptions);
    itemCount: number;
    barPadding: number;
    barGap: number;
    swapDurationMS: number;
    rankOffset: number;
    lastValue: Map<string, number>;
    labelPlaceholder: number;
    valuePlaceholder: number;
    showDateLabel: boolean;
    get sampling(): number;
    barInfoFormat: (id: any, meta: Map<string, any>, data: Map<string, any>) => string;
    IDList: string[];
    setup(stage: Stage): void;
    private getConvolveKernel;
    private getTotalHistoryIndex;
    /**
     * 卷积的一种实现，特别地，这个函数对左右两边进行 padding 处理。
     *
     * @param array 被卷数组
     * @param weights 卷积核
     * @returns 卷积后的数组，大小和被卷数组一致
     */
    private convolve;
    private setShowingIDList;
    get maxValueLabelWidth(): any;
    get totalRankPlaceHolder(): number;
    get maxLabelWidth(): any;
    getComponent(sec: number): Component;
    private appendRankLabels;
    private getRankLabelOptions;
    getScaleX(currentData: any[]): ScaleLinear<number, number, never>;
    getDateLabelText(sec: number): string;
    private get barHeight();
    private getBarOptions;
    private getBarX;
    private getBarY;
    private getBarComponent;
    private getLabelTextOptions;
}
