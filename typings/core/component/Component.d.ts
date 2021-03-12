import { Ani } from "../ani/Ani";
import { Stage } from "../Stage";
export interface ShadowOptions {
    enable?: boolean;
    color?: string;
    blur?: number;
    offset?: {
        x: number;
        y: number;
    };
    fillColor?: string | CanvasGradient | CanvasPattern;
    strokeColor?: string | CanvasGradient | CanvasPattern;
}
export interface BaseCompOptions {
    shadow?: ShadowOptions;
    offsetSec?: number;
    center?: {
        x: number;
        y: number;
    };
    position?: {
        x: number;
        y: number;
    };
    offset?: {
        x: number;
        y: number;
    };
    scale?: {
        x: number;
        y: number;
    };
    children?: Component[];
    alpha?: number;
    filter?: string;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    lineWidth?: number;
}
export declare class Component {
    type: string;
    offsetSec: number;
    shadow: ShadowOptions;
    center: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    scale: {
        x: number;
        y: number;
    };
    children: (Component | Ani)[];
    alpha: number;
    filter: string;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    stage: Stage;
    parent: Component | Ani;
    setup(stage: Stage): void;
    addChild(comp: Component | Ani): void;
    constructor(options?: BaseCompOptions);
}
