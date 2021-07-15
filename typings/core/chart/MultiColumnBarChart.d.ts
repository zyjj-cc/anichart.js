import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BarChart, BarChartOptions } from "./BarChart";
interface MultiColumnBarBarOptions extends BarChartOptions {
    cols?: number;
}
export declare class MultiColumnBarChart extends BarChart {
    cols: number;
    c: Component;
    itemCount: number;
    constructor(options?: MultiColumnBarBarOptions);
    setup(stage: Stage): void;
    getComponent(sec: any): Component;
}
export {};
