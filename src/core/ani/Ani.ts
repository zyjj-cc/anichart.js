import { Component } from '../component/Component'
import { Stage } from '../Stage'

export class Ani {
  stage?: Stage
  parent?: Ani
  children: Ani[] = []
  getComponent (sec: number) {
    return new Component({}, this.children.map(ani => ani.getComponent(sec)))
  }

  setup (stage: Stage, parent?: Ani) {
    this.stage = stage
    this.parent = parent
    this.children.forEach(ani => { ani.setup(stage, this) })
  }
}
