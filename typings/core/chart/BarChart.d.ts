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
    isUp?: boolean;
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
    clipBar: boolean;
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
    /**
     * 获得所有能显示在图表上的数据 ID 列表。
     * 这个列表可以用于筛去无用数据。
     */
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
    getTotalHistoryByID(id: any): any;
    private getBarOptions;
    getBarIdx(hisIndex: number[], cFrame: number): number;
    /**
     * 判断当前帧，柱状条是否在上升
     *
     * @param cFrame  当前帧
     * @param hisIndex  历史排序数据
     * @returns 是否在上升
     */
    private barIsUp;
    private getBarX;
    private getBarY;
    private getBarComponent;
    private getLabelTextOptions;
}
