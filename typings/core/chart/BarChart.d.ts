import { Component } from "../component/Component";
import { TextOptions } from "../component/Text";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGenerate } from "./BaseChart";
import { ScaleLinear } from "d3";
export interface BarChartOptions extends BaseChartOptions {
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
    dateLabelOptions: TextOptions | undefined;
    barFontSizeScale: number;
    showRankLabel: boolean;
    private readonly rankPadding;
    rankLabelPlaceholder: number;
    reduceID: boolean;
    dy: number;
    barInfoOptions: any;
    get maxRankLabelWidth(): number;
    constructor(options?: BarChartOptions);
    itemCount: number;
    barPadding: number;
    barGap: number;
    swap: number;
    rankOffset: number;
    lastValue: Map<string, number>;
    labelPlaceholder: number;
    valuePlaceholder: number;
    showDateLabel: boolean;
    get sampling(): number;
    barInfoFormat: (id: any, data?: Map<string, any> | undefined, meta?: Map<string, any> | undefined) => string;
    historyIndex: Map<any, any>;
    IDList: string[];
    setup(stage: Stage): void;
    private setShowingIDList;
    private setHistoryIndex;
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
