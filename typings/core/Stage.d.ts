import { Ani } from "./ani/Ani";
import { Renderer } from "./Renderer";
import { Component } from "./component/Component";
import { Timer } from "d3";
import { Controller } from "./Controller";
export declare class Stage {
    compRoot: Component;
    renderer: Renderer;
    ctl: Controller;
    options: {
        sec: number;
        fps: number;
    };
    outputOptions: {
        fileName: string;
        splitSec: number;
    };
    interval: Timer | null;
    output: boolean;
    outputConcurrency: number;
    mode: string;
    private cFrame;
    private alreadySetup;
    get frame(): number;
    set frame(val: number);
    get sec(): number;
    set sec(val: number);
    get playing(): boolean;
    get totalFrames(): number;
    get canvas(): any;
    constructor(canvas?: HTMLCanvasElement);
    addChild(child: Ani | Component): void;
    render(sec?: number): void;
    private doRender;
    loadRecourse(): Promise<any[]>;
    play(): void;
    private doPlay;
    setup(): void;
    renderController(): void;
}
