import { Component } from "../component/Component";
import { Stage } from "../Stage";
export declare class Ani {
    stage: Stage | undefined;
    offsetSec: number;
    parent: Ani | Component;
    constructor();
    getComponent(sec: number): Component | null;
    setup(stage: Stage): void;
}
