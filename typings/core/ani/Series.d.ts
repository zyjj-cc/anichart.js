import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { Ani } from "./Ani";
export declare class Scene extends Ani {
    private child;
    durationSec: number;
    setup(stage: Stage): void;
    constructor(child: Ani | Component, durationSec: number);
    getComponent(sec: number): Component | null;
}
export declare class Series extends Component {
    children: Scene[];
    addScene(scene: Scene): void;
    setup(stage: Stage): void;
}
