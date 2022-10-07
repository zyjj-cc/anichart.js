import { Ani } from './ani/Ani'
import { CanvasRenderer } from './CanvasRenderer'
import { Renderer } from './Renderer'
import { Resource } from './Resource'
import { interval, Timer } from 'd3-timer'
import { Controller } from './Controller'

export class Stage {
  root = new Ani()
  renderer: Renderer
  resource = new Resource()

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

  addChild (child: Ani): void {
    this.root.children.push(child)
  }

  async render (sec?: number) {
    if (sec !== undefined) {
      this.sec = sec
    }
    if (!this.alreadySetup) {
      await this.loadRecourse()
      await this.root.setup(this)
      this.alreadySetup = true
      this.doRender()
    } else {
      this.doRender()
    }
  }

  private doRender (): void {
    this.renderer.clean()
    this.renderer.render(this.root)
  }

  async loadRecourse (): Promise<any[]> {
    return await this.resource.setup()
  }

  async play () {
    await this.loadRecourse()
    await this.doPlay()
  }

  private async doPlay () {
    if (!this.alreadySetup) await this.setup()
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
        void this.render()
        if (this.cFrame >= this.totalFrames) {
          if (this.interval != null) {
            this.interval.stop()
            this.interval = null
          }
        }
      }, (1 / this.options.fps) * 1000)
    }
  }

  async setup () {
    await this.loadRecourse()
    await this.root.setup(this)
    this.alreadySetup = true
  }

  renderController (): void {
    this.ctl.render()
  }
}
