import { canvasRenderer, CanvasRenderer } from './CanvasRenderer'
import { Component } from './component/Component'
import { Text } from './component/Text'
export class CanvasHelper {
  isPointInPath (area: Path2D | string, x: number, d: number): any {
    if (typeof area === 'string') {
      area = new Path2D(area)
    }
    return this.renderer.ctx?.isPointInPath(area, x, d)
  }

  renderer: CanvasRenderer = canvasRenderer
  constructor () {
    let canvas = document.querySelector('canvas')
    if (canvas == null) {
      canvas = document.createElement('canvas')
    }
    this.renderer.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('canvas 2d context not found')
    } else {
      this.renderer.ctx = ctx
    }
  }

  measure<T extends Component>(c: T): {width: number} {
    this.renderer.ctx.save()
    if (c.type === 'Text') {
      return this.measureText((c as unknown) as Text)
    }
    this.renderer.ctx.restore()
    return { width: 0 }
  }

  private measureText (c: Text): {width: number} {
    this.renderer.prerenderText(c)
    const res = this.renderer.ctx.measureText(c.text ?? '')
    this.renderer.ctx.restore()
    return res
  }

  getPattern (img: CanvasImageSource): CanvasPattern {
    const p = this.renderer.ctx.createPattern(img, 'repeat')
    if (p) {
      return p
    } else {
      throw new Error('createPattern error')
    }
  }
}
export const canvasHelper = new CanvasHelper()
