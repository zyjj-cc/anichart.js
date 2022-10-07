import { Component } from '../component/Component'
import { Stage } from '../Stage'

export class Ani {
  stage?: Stage
  parent?: Ani
  children: Ani[] = []
  getComponent (sec: number) {
    return new Component({ key: 'ani-root' }, this.children.map(ani => ani.getComponent(sec)))
  }

  async setup (stage: Stage, parent?: Ani) {
    this.stage = stage
    this.parent = parent
    for (const child of this.children) {
      await child.setup(stage, this)
    }
  }
}
