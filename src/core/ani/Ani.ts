import { Component } from "../component/Component";
import { Stage } from "../Stage";

export class Ani {
  stage: Stage | undefined;
  parent: Ani | Component;
  constructor() {}
  getComponent(sec: number): Component | null {
    return null;
  }
  setup(stage: Stage) {
    this.stage = stage;
  }
}
