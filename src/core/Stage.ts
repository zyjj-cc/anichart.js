import { Ani } from './ani/Ani'
import { CanvasRenderer } from './CanvasRenderer'
import { Renderer } from './Renderer'
import { Component } from './component/Component'
import { recourse } from './Recourse'
import { interval, Timer } from 'd3-timer'
import { Controller } from './Controller'

export class Stage {
  compRoot: Component = new Component()
  renderer: Renderer

  ctl: Controller
  options = { sec: 5, fps: 30 }
  outputOptions = {
    fileName: 'output',
    splitSec: 60,
  }

  interval: Timer | null
  output: boolean
  outputConcurrency = 128
  mode = 'output'
  private cFrame = 0
  private alreadySetup: boolean

  get frame (): number {
    return this.cFrame
  }

  set frame (val: number) {
    this.cFrame = val
  }

  get sec (): number {
    return this.cFrame / this.options.fps
  }

  set sec (val: number) {
    this.cFrame = ~~(val * this.options.fps)
  }

  get playing (): boolean {
    return this.interval !== null
  }

  get totalFrames (): number {
    return this.options.sec * this.options.fps
  }

  get canvas (): HTMLCanvasElement {
    return this.renderer.canvas
  }

  constructor (canvas?: HTMLCanvasElement) {
    this.renderer = new CanvasRenderer()
    this.renderer.stage = this
    if (canvas == null) {
      canvas = document.createElement('canvas')
      canvas.width = 1920
      canvas.height = 1080
      document.body.appendChild(canvas)
    }
    this.renderer.setCanvas(canvas)
    this.sec = 0
    this.ctl = new Controller(this)
  }

  addChild (child: Ani | Component): void {
    this.compRoot.children.push(child)
  }

  render (sec?: number): void {
    if (sec !== undefined) {
      this.sec = sec
    }
    if (!this.alreadySetup) {
      void this.loadRecourse().then(() => {
        this.compRoot.setup(this)
        this.alreadySetup = true
        this.doRender()
      })
    } else {
      this.doRender()
    }
  }

  private doRender (): void {
    this.renderer.clean()
    this.renderer.render(this.compRoot)
  }

  async loadRecourse (): Promise<any[]> {
    return await recourse.setup()
  }

  play (): void {
    void this.loadRecourse().then(() => {
      this.doPlay()
    })
  }

  private doPlay (): void {
    if (!this.alreadySetup) this.setup()
    if (this.interval != null) {
      this.interval.stop()
      this.interval = null
    } else {
      this.interval = interval((elapsed) => {
        if (this.output || this.mode === 'output') {
          this.cFrame++
        } else {
          this.cFrame = Math.floor((elapsed / 1000) * this.options.fps)
        }
        this.render()
        if (this.cFrame >= this.totalFrames) {
          if (this.interval != null) {
            this.interval.stop()
            this.interval = null
          }
        }
      }, (1 / this.options.fps) * 1000)
    }
  }

  setup (): void {
    void this.loadRecourse().then(() => {
      this.compRoot.setup(this)
      this.alreadySetup = true
    })
  }

  renderController (): void {
    this.ctl.render()
  }
}
