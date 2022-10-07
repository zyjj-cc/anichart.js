import { Component } from '../component/Component'
import { Stage } from '../Stage'
import { Ani } from './Ani'

export interface GridAniOptions {
  aniTime?: [number, number]
  col?: number
  row?: number
  shape?: { width: number, height: number }
  position?: { x: number, y: number }
  items?: Ani[]
}

export class GridAni extends Ani {
  col: number
  row: number
  items: Ani[]
  position: { x: number, y: number }
  shape: { width: number, height: number }
  constructor (options?: GridAniOptions) {
    super()
    if (options != null) {
      this.col = options.col ?? 3
      this.row = options.row ?? 3
      this.position = options.position ?? { x: 0, y: 0 }
      this.items = options.items ?? []
      this.shape = options.shape ?? { width: 0, height: 0 }
    }
  }

  wrapper: Component
  async setup (stage: Stage, parent?: Ani) {
    await super.setup(stage, parent)
    if (!this.shape) {
      this.shape = {
        width: stage.canvas.width,
        height: stage.canvas.height,
      }
    }
  }

  getComponent (sec: number) {
    this.wrapper = new Component({
      key: 'wrapper',
      position: this.position,
    })
    const height = this.shape.height / this.row
    const width = this.shape.width / this.col
    this.items.forEach((item, index) => {
      const col = index % this.col
      const row = Math.floor(index / this.col)
      const comp = item.getComponent(sec)
      comp.position = { x: width * col + width / 2, y: height * row }
      this.wrapper.addChild(comp)
    })
    return this.wrapper
  }
}
