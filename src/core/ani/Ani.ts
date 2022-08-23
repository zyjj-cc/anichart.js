import { Component } from '../component/Component'
import { Stage } from '../Stage'

export class Ani {
  stage: Stage | undefined
  parent: Ani | Component
  getComponent (sec: number): Component | null {
    return null
  }

  setup (stage: Stage) {
    this.stage = stage
  }
}
