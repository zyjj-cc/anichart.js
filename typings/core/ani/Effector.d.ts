import { Component } from "../component/Component";
import { Ani } from "./Ani";
declare type Scale = (sec: number) => number;
interface FadeOptions {
    alpha: Scale;
}
export declare class Effector {
    static fade(item: Ani | Component, options: FadeOptions): Ani;
}
export {};
