import { BaseChartOptions, BaseChart } from "./BaseChart";
import { FontWeight, Text } from "../component/Text";
interface PieChartOptions extends BaseChartOptions {
    radius?: [number, number];
    labelTextStyle?: {
        font: string;
        lineWidth: number;
        fontSize: number;
        fontWeight: FontWeight;
        strokeStyle: string;
    };
    showDateLabel?: boolean;
    cornerRadius?: number;
    padAngle?: number;
    minRadio?: number;
}
export declare class PieChart extends BaseChart implements PieChartOptions {
    minRadio: number;
    radius: [number, number];
    cornerRadius: number;
    padAngle: number;
    keyDurationSec: number;
    labelTextStyle: {
        font: string;
        lineWidth: number;
        fontSize: number;
        fontWeight: FontWeight;
        strokeStyle: string;
    };
    dateLabel: Text;
    showDateLabel: boolean;
    constructor(options?: PieChartOptions);
    getComponent(sec: number): import("../..").Component | null;
    private getPieData;
}
export {};
