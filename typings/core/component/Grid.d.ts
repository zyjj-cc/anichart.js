import { Stage } from "../Stage";
import { BaseCompOptions, Component } from "./Component";
export interface GridOptions extends BaseCompOptions {
    row?: number;
    col?: number;
    shape?: {
        width: number;
        height: number;
    };
}
export declare class Grid extends Component {
    shape?: {
        width: number;
        height: number;
    };
    row: number | undefined;
    col: number;
    constructor(options?: GridOptions);
    setup(stage: Stage): void;
}
